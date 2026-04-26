from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Case(Base):
    __tablename__ = "cases"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, default=func.now())
    
    evidence_items = relationship("Evidence", back_populates="case")

class Evidence(Base):
    __tablename__ = "evidence"

    # use UUIDs ideally for evidence_id but integers with indexing work as per spec
    evidence_id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_path = Column(String(500), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=func.now())
    hash = Column(String(64), nullable=False) # SHA-256 of the file content
    
    case = relationship("Case", back_populates="evidence_items")
    uploader = relationship("User", back_populates="evidence_uploaded")
    logs = relationship("EvidenceLog", back_populates="evidence", order_by="EvidenceLog.timestamp")

class EvidenceLog(Base):
    __tablename__ = "evidence_logs"
    
    log_id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(Integer, ForeignKey("evidence.evidence_id"), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    action = Column(String(100), nullable=False) # "Upload", "View", "Download", "Verify"
    timestamp = Column(DateTime, default=func.now())
    
    # Hash chaining for logs:
    previous_hash = Column(String(64), nullable=False)
    current_hash = Column(String(64), nullable=False)
    
    evidence = relationship("Evidence", back_populates="logs")
    user = relationship("User", back_populates="logs")
