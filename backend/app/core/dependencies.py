"""
JWT authentication dependencies for FastAPI.
Works with MySQL `digital_evidence`.users schema:
  - Primary key: user_id (not id)
  - Login identifier: email (full_name is display name, no username column)
  - Role stored as varchar in users.role column (not a FK)
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.config import settings
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        # 'sub' stores the user's email (used as the unique login identifier)
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


def require_role(required_roles: list[str]):
    """
    Dependency factory that checks if the current user's role (varchar field)
    is in the allowed list.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        user_role = current_user.role  # direct varchar, e.g. "Admin"
        if user_role not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Requires one of: {', '.join(required_roles)}"
            )
        return current_user
    return role_checker
