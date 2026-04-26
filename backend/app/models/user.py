"""
User-related SQLAlchemy models aligned with MySQL `digital_evidence` schema.

Tables:
  users        — full_name, email, password_hash, role (varchar), department
  roles        — role_id, role_name, description
  user_roles   — user_id, role_id  (composite PK)
  case_members — case_id, user_id, assigned_at (composite PK)
"""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

    # Many-to-many back-reference
    user_role_entries = relationship("UserRole", back_populates="role")


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    # Role stored as a plain varchar string (e.g. "Admin", "Investigator")
    role = Column(String(50), nullable=True)
    department = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=func.now())

    # Relationships
    evidence_uploaded = relationship("Evidence", back_populates="uploader",
                                     foreign_keys="Evidence.uploaded_by")
    custody_entries = relationship("ChainOfCustody", back_populates="performer",
                                   foreign_keys="ChainOfCustody.performed_by")
    audit_log_entries = relationship("AuditLog", back_populates="user",
                                     foreign_keys="AuditLog.user_id")
    user_role_entries = relationship("UserRole", back_populates="user")
    case_memberships = relationship("CaseMember", back_populates="user")


class UserRole(Base):
    """Join table for explicit role assignments (many-to-many)."""
    __tablename__ = "user_roles"

    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    role_id = Column(Integer, ForeignKey("roles.role_id"), primary_key=True)

    user = relationship("User", back_populates="user_role_entries")
    role = relationship("Role", back_populates="user_role_entries")


class CaseMember(Base):
    """Tracks which users are members of which cases."""
    __tablename__ = "case_members"

    case_id = Column(Integer, ForeignKey("cases.case_id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), primary_key=True)
    assigned_at = Column(DateTime, default=func.now())

    user = relationship("User", back_populates="case_memberships")
    case = relationship("Case", back_populates="case_members")
