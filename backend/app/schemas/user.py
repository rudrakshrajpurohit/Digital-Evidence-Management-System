"""
Pydantic schemas for User authentication and responses.
Column names match the MySQL `digital_evidence` schema exactly:
  - users.full_name (no 'username' column)
  - users.password_hash
  - users.role (varchar, inline — no role FK)
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserBase(BaseModel):
    full_name: str
    email: EmailStr


class UserCreate(UserBase):
    password: str
    role: Optional[str] = "Investigator"
    department: Optional[str] = None


class UserResponse(UserBase):
    user_id: int
    role: Optional[str]
    department: Optional[str]

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
