"""
Pydantic schemas for Evidence, Chain of Custody, and Audit Logs.
Column names match the MySQL `digital_evidence` schema exactly.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Chain of Custody ────────────────────────────────────────────────────────

class CustodyCreate(BaseModel):
    """Payload to manually add a chain-of-custody entry."""
    evidenceId: str
    action: str
    user: Optional[str] = None
    notes: Optional[str] = None


class CustodyResponse(BaseModel):
    custody_id: int
    evidence_id: Optional[int]
    action_type: Optional[str]
    performed_by: Optional[int]
    action_details: Optional[str]
    action_timestamp: datetime

    class Config:
        from_attributes = True


# ─── Audit Log ───────────────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    log_id: int
    user_id: Optional[int]
    action: Optional[str]
    target_table: Optional[str]
    target_id: Optional[int]
    action_details: Optional[str]
    action_timestamp: datetime

    class Config:
        from_attributes = True


# ─── Evidence ────────────────────────────────────────────────────────────────

class EvidenceBase(BaseModel):
    case_id: Optional[int]
    evidence_name: Optional[str]
    evidence_type: Optional[str]
    uploaded_by: Optional[int]
    file_hash: Optional[str]


class EvidenceResponse(EvidenceBase):
    evidence_id: int
    file_path: Optional[str]
    uploaded_at: Optional[datetime]
    
    # Frontend aliases pulling from Evidence properties
    id: Optional[int] = None
    name: Optional[str] = None
    file_name: Optional[str] = None
    type: Optional[str] = None
    hash: Optional[str] = None
    timestamp: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EvidenceDetailResponse(EvidenceResponse):
    custody_logs: List[CustodyResponse] = []
    hash_info: dict = {}
class VerifyResponse(BaseModel):
    evidence_id: int
    status: str
    stored_hash: Optional[str]
    computed_hash: str


# ─── Legacy aliases (keep custody.py import working) ─────────────────────────
class EvidenceLogResponse(BaseModel):
    log_id: int
    evidence_id: Optional[int]
    action: Optional[str]
    user_id: Optional[int]
    timestamp: datetime
    notes: Optional[str] = None
    current_hash: Optional[str] = "N/A - DB TRUTH"
    previous_hash: Optional[str] = "N/A"

    class Config:
        from_attributes = True
