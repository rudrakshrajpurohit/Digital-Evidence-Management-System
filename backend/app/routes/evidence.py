from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import shutil
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.evidence import Evidence, ChainOfCustody, Case, AuditLog
from app.schemas.evidence import EvidenceResponse, VerifyResponse, EvidenceDetailResponse
from app.core.dependencies import get_current_user, require_role
from app.utils.hashing import generate_file_hash

router = APIRouter(prefix="/evidence", tags=["evidence"])
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def log_audit(db: Session, user_id: int, action: str, target_table: str, target_id: Optional[int], details: str):
    audit = AuditLog(
        user_id=user_id,
        action=action,
        target_table=target_table,
        target_id=target_id,
        action_details=details
    )
    db.add(audit)

def append_to_chain_of_custody(db: Session, evidence_id: int, user_id: int, action: str, notes: Optional[str] = None):
    # Map 'action' to action_type and notes to action_details
    new_log = ChainOfCustody(
        evidence_id=evidence_id,
        performed_by=user_id,
        action_type=action,
        action_details=notes,
        action_timestamp=datetime.utcnow()
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
        case = db.query(Case).filter(Case.case_title == case_title).first()
        if not case:
            case = Case(case_title=case_title)
            db.add(case)
            db.flush() # get case_id
            
        file_path = os.path.join(UPLOAD_DIR, f"{datetime.now().timestamp()}_{file.filename}")
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Generate initial file hash
        file_hash = generate_file_hash(file_path)
        
        # Create Evidence Record
        new_evidence = Evidence(
            case_id=case.case_id,
            evidence_name=file.filename[:255] if file.filename else "upload",
            evidence_type=file.content_type[:50] if file.content_type else "unknown",
            file_path=file_path,
            uploaded_by=current_user.user_id,
            file_hash=file_hash
        )
        db.add(new_evidence)
        db.flush() # get evidence_id
        
        # Log action in chain of custody
        append_to_chain_of_custody(db, new_evidence.evidence_id, current_user.user_id, "Upload", "Evidence uploaded")
        
        # Insert audit log dynamically
        log_audit(db, current_user.user_id, "Upload", "evidence", new_evidence.evidence_id, f"Uploaded evidence {file.filename}")
        
        db.commit()
        db.refresh(new_evidence)
        return new_evidence
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[EvidenceResponse])
def get_evidence(
    case_id: Optional[int] = None,
    uploaded_by: Optional[int] = None,
    file_type: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Evidence)
    if case_id:
        query = query.filter(Evidence.case_id == case_id)
    if uploaded_by:
        query = query.filter(Evidence.uploaded_by == uploaded_by)
    if file_type:
        query = query.filter(Evidence.evidence_type == file_type)
        
    return query.all()

@router.get("/{id}", response_model=EvidenceDetailResponse)
def get_evidence_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    evidence = db.query(Evidence).filter(Evidence.evidence_id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    try:
        append_to_chain_of_custody(db, id, current_user.user_id, "Accessed", "Viewed evidence details")
        db.commit()
        db.refresh(evidence)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write chain of custody log")
        
    # Build comprehensive payload
    return {
        **evidence.__dict__,
        "evidence_id": evidence.evidence_id,
        "id": evidence.evidence_id,
        "name": evidence.evidence_name,
        "file_name": evidence.evidence_name,
        "type": evidence.evidence_type,
        "hash": evidence.file_hash,
        "timestamp": evidence.uploaded_at,
        "created_at": evidence.uploaded_at,
        "custody_logs": evidence.custody_chain,
        "hash_info": { "stored_hash": evidence.file_hash }
    }

@router.delete("/{id}")
def delete_evidence(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    evidence = db.query(Evidence).filter(Evidence.evidence_id == id).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found")
        
    # Soft delete / record deletion in log
    try:
        append_to_chain_of_custody(db, id, current_user.user_id, "Deleted", "Marked as deleted")
        
        # Insert audit log dynamically
        log_audit(db, current_user.user_id, "Delete", "evidence", id, f"Deleted evidence {evidence.evidence_name}")
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to log deletion")
        
    return {"message": "Evidence flagged as deleted (chain preserved)."}

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
        append_to_chain_of_custody(db, id, current_user.user_id, "Download", "Downloaded evidence file")
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write chain of custody log")

    return FileResponse(path=evidence.file_path, filename=evidence.evidence_name)

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
    status = "Verified" if computed_hash == evidence.file_hash else "Tampered"
    
    # Log the verification action
    try:
        append_to_chain_of_custody(db, id, current_user.user_id, "Verified", f"Hash check completed. Result: {status}")
        
        # Insert audit log dynamically
        log_audit(db, current_user.user_id, "Verify", "evidence", id, f"Verified evidence {evidence.evidence_name}. Status: {status}")
        
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to write chain of custody log")
        
    return {
        "evidence_id": id,
        "status": status,
        "stored_hash": evidence.file_hash,
        "computed_hash": computed_hash
    }
