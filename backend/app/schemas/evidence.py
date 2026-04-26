from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EvidenceLogBase(BaseModel):
    action: str
    timestamp: datetime
    previous_hash: str
    current_hash: str
    user_id: int

class EvidenceLogResponse(EvidenceLogBase):
    log_id: int
    evidence_id: int
    
    class Config:
        from_attributes = True

class EvidenceBase(BaseModel):
    case_id: int
    file_name: str
    file_type: str
    uploaded_by: int
    hash: str

class EvidenceResponse(EvidenceBase):
    evidence_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class VerifyResponse(BaseModel):
    evidence_id: int
    status: str
    stored_hash: str
    computed_hash: str
