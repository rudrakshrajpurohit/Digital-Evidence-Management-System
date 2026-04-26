from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.evidence import EvidenceLog, Evidence
from app.schemas.evidence import EvidenceLogResponse
from app.core.dependencies import require_role
from app.utils.hashing import generate_chain_hash

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/evidence/{id}/logs", response_model=List[EvidenceLogResponse])
def get_evidence_logs(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Auditor", "Admin"]))
):
    evidence = db.query(Evidence).filter(Evidence.evidence_id == id).first()
    if not evidence:
            raise HTTPException(status_code=404, detail="Evidence not found")

    logs = db.query(EvidenceLog).filter(EvidenceLog.evidence_id == id).order_by(EvidenceLog.timestamp).all()
    
    # Optional runtime verification of the chain
    if logs:
        expected_prev_hash = "GENESIS"
        for log in logs:
            if log.previous_hash != expected_prev_hash:
                # In a real system, we'd trigger a massive alert here.
                # The data in the DB has been tampered with directly.
                raise HTTPException(status_code=500, detail="CRITICAL: CHAIN OF CUSTODY HAS BEEN COMPROMISED. Tampered logs detected.")
            
            # Action data logic from hashing.py
            action_data = f"{log.evidence_id}|{log.user_id}|{log.action}|{log.timestamp.isoformat()}"
            recomputed_hash = generate_chain_hash(action_data, log.previous_hash)
            
            if recomputed_hash != log.current_hash:
                raise HTTPException(status_code=500, detail="CRITICAL: CHAIN OF CUSTODY HAS BEEN COMPROMISED. Invalid hash signature.")
            
            expected_prev_hash = log.current_hash
            
    return logs
