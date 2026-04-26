from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models.user import User
from app.models.evidence import AuditLog
from app.schemas.user import UserCreate, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token
from sqlalchemy import or_

router = APIRouter(prefix="/auth", tags=["auth"])

def log_audit(db: Session, user_id: int, action: str, target_table: str, details: str):
    audit = AuditLog(
        user_id=user_id,
        action=action,
        target_table=target_table,
        target_id=None,
        action_details=details
    )
    db.add(audit)

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    role_name = user.role if user.role else "Investigator"
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=hashed_password,
        role=role_name,
        department=user.department
    )
    db.add(new_user)
    db.flush() # get user_id
    
    # Audit log
    log_audit(db, new_user.user_id, "Register", "users", f"Registered new user {user.full_name}")
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Try looking up by email or full_name, just in case frontend passes username as full_name or email
    user = db.query(User).filter(
        or_(User.email == form_data.username, User.full_name == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    role_name = user.role if user.role else "Unknown"
    # Create token using email as the subject identifier
    access_token = create_access_token(subject=user.email, role=role_name)
    
    # Audit log login
    try:
        log_audit(db, user.user_id, "Login", "users", f"User logged in: {user.full_name}")
        db.commit()
    except Exception:
        db.rollback()
        # Non-fatal error if log fails
        pass

    return {"access_token": access_token, "token_type": "bearer"}
