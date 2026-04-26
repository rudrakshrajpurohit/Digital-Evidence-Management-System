import os
import sys

# Ensure app is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models.user import User, Role
from app.core.security import get_password_hash

MOCK_USERS = {
    'admin@dems.gov': {'name': 'Admin User', 'role': 'Admin'},
    'det.johnson@dems.gov': {'name': 'Det. Johnson', 'role': 'Investigator'},
    'analyst.chen@dems.gov': {'name': 'Analyst Chen', 'role': 'Analyst'},
    'auditor@dems.gov': {'name': 'Auditor Smith', 'role': 'Auditor'},
}

def seed_db():
    db = SessionLocal()
    try:
        # Seed Roles
        for email, u in MOCK_USERS.items():
            role_name = u['role']
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(name=role_name, description=f"{role_name} role")
                db.add(role)
                db.commit()
                db.refresh(role)
            
            # Seed User
            user = db.query(User).filter(User.username == email).first()
            if not user:
                hashed_password = get_password_hash('demo123')
                new_user = User(
                    username=email,
                    email=email,
                    hashed_password=hashed_password,
                    role_id=role.id
                )
                db.add(new_user)
                db.commit()
                print(f"Seeded user: {email} as {role_name}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() # Also creates tables if missing
    seed_db()
    print("Database seeding complete!")
