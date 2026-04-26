"""
Evidence-related SQLAlchemy models aligned with MySQL `digital_evidence` schema.

Tables:
  cases            — case_id, case_title, case_description, owner_id, status, created_at
  evidence         — evidence_id, case_id, evidence_name, evidence_type, file_path,
                     file_hash, uploaded_by, uploaded_at
  chain_of_custody — custody_id, evidence_id, action_type, performed_by,
                     action_details, action_timestamp
  audit_logs       — log_id, user_id, action, target_table, target_id,
                     action_details, action_timestamp
"""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class Case(Base):
    __tablename__ = "cases"

    case_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_title = Column(String(255), nullable=False)
    case_description = Column(Text, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    status = Column(String(50), nullable=True, default="Open")
    created_at = Column(DateTime, default=func.now())

    evidence_items = relationship("Evidence", back_populates="case")
    case_members = relationship("CaseMember", back_populates="case")
    owner = relationship("User", foreign_keys=[owner_id])


class Evidence(Base):
    __tablename__ = "evidence"

    evidence_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.case_id"), index=True, nullable=True)
    evidence_name = Column(String(255), nullable=True)
    evidence_type = Column(String(50), nullable=True)
    file_path = Column(Text, nullable=True)
    file_hash = Column(String(256), nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    uploaded_at = Column(DateTime, default=func.now())

    case = relationship("Case", back_populates="evidence_items")
    uploader = relationship("User", back_populates="evidence_uploaded",
                            foreign_keys=[uploaded_by])
    custody_chain = relationship("ChainOfCustody", back_populates="evidence",
                                 order_by="ChainOfCustody.action_timestamp")

    @property
    def id(self):
        return self.evidence_id

    @property
    def name(self):
        return self.evidence_name

    @property
    def file_name(self):
        return self.evidence_name

    @property
    def type(self):
        return self.evidence_type

    @property
    def hash(self):
        return self.file_hash

    @property
    def timestamp(self):
        return self.uploaded_at

    @property
    def created_at(self):
        return self.uploaded_at


class ChainOfCustody(Base):
    """Replaces the old `evidence_logs` table. Uses `chain_of_custody` in MySQL."""
    __tablename__ = "chain_of_custody"

    custody_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    evidence_id = Column(Integer, ForeignKey("evidence.evidence_id"), index=True, nullable=True)
    action_type = Column(String(100), nullable=True)
    performed_by = Column(Integer, ForeignKey("users.user_id"), index=True, nullable=True)
    action_details = Column(Text, nullable=True)
    action_timestamp = Column(DateTime, default=func.now())

    evidence = relationship("Evidence", back_populates="custody_chain")
    performer = relationship("User", back_populates="custody_entries",
                             foreign_keys=[performed_by])

    # Legacy properties for Pydantic schema serialization
    @property
    def log_id(self):
        return self.custody_id

    @property
    def action(self):
        return self.action_type

    @property
    def user_id(self):
        return self.performed_by

    @property
    def timestamp(self):
        return self.action_timestamp

    @property
    def notes(self):
        return self.action_details


class AuditLog(Base):
    """Stores system-wide audit events (login, upload, verify, delete, etc.)."""
    __tablename__ = "audit_logs"

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), index=True, nullable=True)
    action = Column(String(255), nullable=True)
    target_table = Column(String(100), nullable=True)
    target_id = Column(Integer, nullable=True)
    action_details = Column(Text, nullable=True)
    action_timestamp = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="audit_log_entries",
                        foreign_keys=[user_id])
