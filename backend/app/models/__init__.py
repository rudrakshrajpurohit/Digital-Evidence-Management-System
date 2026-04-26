"""Export all models so that Base.metadata.create_all() picks them up."""
from app.models.base import Base
from app.models.user import User, Role, UserRole, CaseMember
from app.models.evidence import Case, Evidence, ChainOfCustody, AuditLog

__all__ = [
    "Base",
    "User", "Role", "UserRole", "CaseMember",
    "Case", "Evidence", "ChainOfCustody", "AuditLog",
]
