from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.evidence import Evidence
from app.schemas.evidence import CustodyCreate, EvidenceLogResponse
from app.core.dependencies import get_current_user
from app.routes.evidence import append_to_chain_of_custody

router = APIRouter(prefix="/api/custody", tags=["custody"])

@router.post("", response_model=EvidenceLogResponse)
def add_custody_entry(
    payload: CustodyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ev_id_str = payload.evidenceId
    evidence_id = int(ev_id_str.replace("EVD-", "")) if str(ev_id_str).startswith("EVD-") else int(ev_id_str)

    evidence = db.query(Evidence).filter(Evidence.evidence_id == evidence_id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")

    try:
        new_log = append_to_chain_of_custody(
            db=db,
            evidence_id=evidence_id,
            user_id=current_user.user_id,
            action=payload.action,  # updated to match new schema field
            notes=payload.notes
        )
        db.commit()
        db.refresh(new_log)
        return new_log
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to add custody entry")
