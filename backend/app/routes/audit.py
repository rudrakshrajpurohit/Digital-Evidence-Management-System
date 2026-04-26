from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.evidence import ChainOfCustody, Evidence
from app.schemas.evidence import EvidenceLogResponse
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/evidence/{id}/logs", response_model=List[EvidenceLogResponse])
def get_evidence_logs(
    id: str,
    db: Session = Depends(get_db),
    # Widened: any authenticated user can view logs for evidence they interact with
    current_user: User = Depends(require_role(["Auditor", "Admin", "Investigator", "Analyst"]))
):
    # Parse frontend string format "EVD-001" to int
    evidence_id = int(id.replace("EVD-", "")) if str(id).startswith("EVD-") else int(id)
    
    evidence = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    logs = (
        db.query(ChainOfCustody)
        .filter(ChainOfCustody.evidence_id == evidence_id)
        .order_by(ChainOfCustody.action_timestamp)
        .all()
    )

    # Legacy hash chain integrity check removed because MySQL schema uses a simple action log without previous/current hashes.
    # Focus is now on the immutable triggers preventing tampering.

    return logs
