from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import Generator
from app.core.config import settings
import logging

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
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
    This ensures that evidence and logs cannot be modified or deleted,
    even by an admin with database access, enforcing forensic integrity.
    """
    triggers_sql = [
        # Block EVIDENCE Updates
        """
        CREATE TRIGGER prevent_evidence_update
        BEFORE UPDATE ON evidence
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Updates to evidence table are prohibited.';
        END;
        """,
        # Block EVIDENCE Deletions
        """
        CREATE TRIGGER prevent_evidence_delete
        BEFORE DELETE ON evidence
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Deletions from evidence table are prohibited.';
        END;
        """,
        # Block LOG Updates
        """
        CREATE TRIGGER prevent_logs_update
        BEFORE UPDATE ON evidence_logs
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Updates to chain of custody logs are prohibited.';
        END;
        """,
        # Block LOG Deletions
        """
        CREATE TRIGGER prevent_logs_delete
        BEFORE DELETE ON evidence_logs
        FOR EACH ROW
        BEGIN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'STRICT FORENSIC RULE: Deletions from chain of custody logs are prohibited.';
        END;
        """
    ]
    
    with engine.connect() as conn:
        for sql in triggers_sql:
            try:
                # We catch errors because triggers might already exist
                conn.execute(text(sql))
                conn.commit()
            except Exception as e:
                logging.info(f"Trigger creation skipped (might already exist): {str(e)}")

def init_db():
    from app.models.base import Base
    import app.models.user
    import app.models.evidence
    Base.metadata.create_all(bind=engine)
    setup_database_triggers()
