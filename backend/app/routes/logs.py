"""
Logs Router — /api/logs
Serves real database-backed access logs and system activity logs.
Both endpoints pull from the ChainOfCustody and AuditLog tables.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.evidence import ChainOfCustody, Evidence, AuditLog
from app.core.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/logs", tags=["logs"])

# ---------------------------------------------------------------------------
# Access Logs — every action taken on a piece of evidence
# ---------------------------------------------------------------------------

@router.get("/access")
def get_access_logs(
    limit: int = Query(200, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Auditor", "Admin", "Investigator", "Analyst"]))
):
    """Return all evidence-level access log entries, newest first."""
    logs = (
        db.query(ChainOfCustody)
        .options(
            joinedload(ChainOfCustody.performer),
            joinedload(ChainOfCustody.evidence)
        )
        .order_by(ChainOfCustody.action_timestamp.desc())
        .limit(limit)
        .all()
    )

    result = []
    for log in logs:
        # Full name fallback
        user_name = log.performer.full_name if log.performer else f"User {log.performed_by}"
        evidence_label = f"EVD-{log.evidence_id:03d}" if log.evidence_id else "UNKNOWN"
        result.append({
            "id": log.custody_id,
            "user": user_name,
            "evidenceId": evidence_label,
            "action": log.action_type.upper() if log.action_type else "UNKNOWN",
            "timestamp": log.action_timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.action_timestamp else "",
            "ip": "—",          # IP not stored; placeholder keeps frontend table intact
            "notes": log.action_details,
            "hash": None, # Removed in new schema
        })

    return result


# ---------------------------------------------------------------------------
# System Activity — higher-level events (logins, uploads, permission changes…)
# Maps actions in AuditLog to system-style event types for the dashboard
# ---------------------------------------------------------------------------

ACTION_TO_EVENT = {
    "Created":  "UPLOAD",
    "Upload": "UPLOAD",
    "Verified": "VERIFY",
    "Verify": "VERIFY",
    "Accessed": "VIEW",
    "Download": "DOWNLOAD",
    "Deleted":  "DELETE",
    "Delete": "DELETE",
    "Login": "LOGIN"
}

@router.get("/system")
def get_system_logs(
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Auditor", "Admin", "Investigator", "Analyst"]))
):
    """Return system-level activity derived from the audit_logs table."""
    logs = (
        db.query(AuditLog)
        .options(joinedload(AuditLog.user))
        .order_by(AuditLog.action_timestamp.desc())
        .limit(limit)
        .all()
    )

    result = []
    for log in logs:
        user_name = log.user.full_name if log.user else f"User {log.user_id}"
        event_type = ACTION_TO_EVENT.get(log.action, str(log.action).upper())
        result.append({
            "id": log.log_id,
            "eventType": event_type,
            "user": user_name,
            "description": log.action_details or f"{user_name} performed {log.action}",
            "timestamp": log.action_timestamp.strftime("%Y-%m-%d %H:%M:%S") if log.action_timestamp else "",
        })

    return result
