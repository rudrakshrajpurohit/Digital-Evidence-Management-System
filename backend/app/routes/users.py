from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.user import User, Role, UserRole
from app.core.security import get_password_hash
from app.core.dependencies import get_current_user, require_role
from app.routes.evidence import log_audit

router = APIRouter(prefix="/api/users", tags=["users"])

# --- Schemas ---

class ExtUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role_id: int

class UserExtResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: Optional[str]
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

# --- Routes ---

@router.post("", response_model=UserExtResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    payload: ExtUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    # Check if duplicate email
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Fetch role mapping explicitly from roles table
    role = db.query(Role).filter(Role.role_id == payload.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role_id")

    try:
        # 1) Create User record mapping 'name' to 'full_name'
        new_user = User(
            full_name=payload.name,
            email=payload.email,
            password_hash=get_password_hash(payload.password),
            role=role.role_name
        )
        db.add(new_user)
        db.flush() # flush to get user_id

        # 2) Mapping: Insert mapping between user and role in user_roles table
        new_user_role = UserRole(
            user_id=new_user.user_id,
            role_id=role.role_id
        )
        db.add(new_user_role)

        # Audit Log
        log_audit(db, current_user.user_id, "Create User", "users", new_user.user_id, f"Created new user: {new_user.full_name}")

        db.commit()
        db.refresh(new_user)

        # Map back to exact unified format requested by frontend
        return {
            "id": new_user.user_id,
            "name": new_user.full_name,
            "email": new_user.email,
            "role": new_user.role or "Investigator",
            "department": new_user.department,
            "created_at": new_user.created_at,
            "status": "Active"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


@router.get("", response_model=List[UserExtResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin", "Investigator", "Auditor"]))
):
    users = db.query(User).all()

    response = []
    for u in users:
        response.append({
            "id": u.user_id,
            "name": u.full_name,
            "email": u.email,
            "role": u.role or "Investigator",
            "department": u.department,
            "created_at": u.created_at,
            "status": "Active" # Mocking status, add real deactivated toggle if model has it later
        })

@router.patch("/{user_id}/role", response_model=UserExtResponse)
def update_user_role(
    user_id: int,
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    role_name = payload.get("role")
    if not role_name:
        raise HTTPException(status_code=400, detail="Role name required")
        
    role = db.query(Role).filter(Role.role_name == role_name).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role name")

    try:
        user.role = role.role_name
        
        # update user_role explicitly
        db.query(UserRole).filter(UserRole.user_id == user.user_id).delete()
        db.add(UserRole(user_id=user.user_id, role_id=role.role_id))
        
        log_audit(db, current_user.user_id, "Update Role", "users", user.user_id, f"Updated role to {role.role_name}")
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update role")
        
    return {
        "id": user.user_id,
        "name": user.full_name,
        "email": user.email,
        "role": user.role,
        "department": user.department,
        "created_at": user.created_at,
        "status": "Active"
    }

@router.patch("/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Admin"]))
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    try:
        # Assuming model supports deactivation later, for now we log it.
        log_audit(db, current_user.user_id, "Deactivate User", "users", user.user_id, f"Deactivated user {user.full_name}")
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to deactivate")
        
    return {"message": "User deactivated successfully"}

