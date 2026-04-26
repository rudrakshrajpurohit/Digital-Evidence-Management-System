from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import os
import shutil
from datetime import datetime, timezone

from app.database import get_db
from app.models.user import User
from app.models.evidence import Evidence, EvidenceLog, Case
from app.schemas.evidence import EvidenceResponse, VerifyResponse
from app.core.dependencies import get_current_user, require_role
from app.utils.hashing import generate_file_hash, generate_chain_hash

router = APIRouter(prefix="/evidence", tags=["evidence"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def append_to_chain_of_custody(db: Session, evidence_id: int, user_id: int, action: str):
    # Get the latest log to find the previous_hash
    latest_log = db.query(EvidenceLog).filter(EvidenceLog.evidence_id == evidence_id).order_by(EvidenceLog.timestamp.desc(), EvidenceLog.log_id.desc()).first()
    
    previous_hash = "GENESIS" if not latest_log else latest_log.current_hash
    timestamp = datetime.now(timezone.utc)
    
    # Action data string must be deterministic
    action_data = f"{evidence_id}|{user_id}|{action}|{timestamp.isoformat()}"
    current_hash = generate_chain_hash(action_data, previous_hash)
    
    new_log = EvidenceLog(
        evidence_id=evidence_id,
        user_id=user_id,
        action=action,
        timestamp=timestamp,
        previous_hash=previous_hash,
        current_hash=current_hash
    )
    db.add(new_log)
    return new_log

@router.post("/upload", response_model=EvidenceResponse)
def upload_evidence(
    case_title: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Investigator", "Admin"]))
):
    try:
        # Check or create case
        case = db.query(Case).filter(Case.title == case_title).first()
        if not case:
            case = Case(title=case_title)
            db.add(case)
            db.flush() # get case.id
            
        file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().timestamp()}_{file.filename}")
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Generate initial file hash
        file_hash = generate_file_hash(file_path)
        
        # Create Evidence Record
        new_evidence = Evidence(
            case_id=case.id,
            file_name=file.filename,
            file_type=file.content_type or "unknown",
            file_path=file_path,
            uploaded_by=current_user.id,
            hash=file_hash
        )
        db.add(new_evidence)
        db.flush() # get evidence_id
        
        # Log action (Atomic in the same transaction)
        append_to_chain_of_custody(db, new_evidence.evidence_id, current_user.id, "Upload")
        
        db.commit()
        db.refresh(new_evidence)
        return new_evidence
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[EvidenceResponse])
def get_evidence(
    case_id: Optional[int] = None,
    uploaded_by: Optional[int] = None,
    file_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Any authenticated user can list
):
    query = db.query(Evidence)
    if case_id:
        query = query.filter(Evidence.case_id == case_id)
    if uploaded_by:
        query = query.filter(Evidence.uploaded_by == uploaded_by)
    if file_type:
        query = query.filter(Evidence.file_type == file_type)
        
    return query.all()

@router.get("/{id}/download")
def download_evidence(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Investigator", "Admin", "Auditor"]))
):
    evidence = db.query(Evidence).filter(Evidence.evidence_id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    if not os.path.exists(evidence.file_path):
        raise HTTPException(status_code=404, detail="File physical path not found")
        
    # Log access before returning the file
    try:
        append_to_chain_of_custody(db, id, current_user.id, "Download")
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write chain of custody log")

    return FileResponse(path=evidence.file_path, filename=evidence.file_name)

@router.post("/{id}/verify", response_model=VerifyResponse)
def verify_evidence(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Analyst", "Admin", "Auditor"]))
):
    evidence = db.query(Evidence).filter(Evidence.evidence_id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    if not os.path.exists(evidence.file_path):
        raise HTTPException(status_code=404, detail="File physical path not found")
        
    # Recompute hash
    computed_hash = generate_file_hash(evidence.file_path)
    
    # Compare
    status = "VALID" if computed_hash == evidence.hash else "TAMPERED"
    
    # Log the verification action
    try:
        append_to_chain_of_custody(db, id, current_user.id, "Verify")
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write chain of custody log")
        
    return {
        "evidence_id": id,
        "status": status,
        "stored_hash": evidence.hash,
        "computed_hash": computed_hash
    }
