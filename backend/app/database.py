"""
Database connection and initialization for MySQL `digital_evidence`.
Uses SQLAlchemy with the pymysql driver.
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import Generator
from app.core.config import settings
import logging

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,  # Recycle connections after 1 hour to avoid MySQL gone-away errors
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def setup_database_triggers():
    """
    Sets up strict immutability triggers in the MySQL database.
    Prevents evidence and chain_of_custody records from being modified or deleted,
    enforcing forensic integrity.
    """
    triggers_sql = [
        # Block EVIDENCE Updates
        """
        CREATE TRIGGER IF NOT EXISTS prevent_evidence_update
        BEFORE UPDATE ON evidence
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Updates to evidence table are prohibited.';
        END;
        """,
        # Block EVIDENCE Deletions
        """
        CREATE TRIGGER IF NOT EXISTS prevent_evidence_delete
        BEFORE DELETE ON evidence
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Deletions from evidence table are prohibited.';
        END;
        """,
        # Block CHAIN_OF_CUSTODY Updates
        """
        CREATE TRIGGER IF NOT EXISTS prevent_custody_update
        BEFORE UPDATE ON chain_of_custody
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Updates to chain_of_custody are prohibited.';
        END;
        """,
        # Block CHAIN_OF_CUSTODY Deletions
        """
        CREATE TRIGGER IF NOT EXISTS prevent_custody_delete
        BEFORE DELETE ON chain_of_custody
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Deletions from chain_of_custody are prohibited.';
        END;
        """,
        # Block AUDIT_LOGS Updates
        """
        CREATE TRIGGER IF NOT EXISTS prevent_audit_update
        BEFORE UPDATE ON audit_logs
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Updates to audit_logs are prohibited.';
        END;
        """,
        # Block AUDIT_LOGS Deletions
        """
        CREATE TRIGGER IF NOT EXISTS prevent_audit_delete
        BEFORE DELETE ON audit_logs
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Deletions from audit_logs are prohibited.';
        END;
        """,
    ]

    with engine.connect() as conn:
        for sql in triggers_sql:
            try:
                conn.execute(text(sql))
                conn.commit()
            except Exception as e:
                logging.info(f"Trigger creation skipped (might already exist): {str(e)}")


def init_db():
    """Create all tables from SQLAlchemy models and set up triggers."""
    # Import all models so that Base.metadata knows about them
    from app.models.base import Base
    import app.models.user    # noqa: F401 — registers User, Role, UserRole, CaseMember
    import app.models.evidence  # noqa: F401 — registers Case, Evidence, ChainOfCustody, AuditLog

    Base.metadata.create_all(bind=engine)
    setup_database_triggers()
