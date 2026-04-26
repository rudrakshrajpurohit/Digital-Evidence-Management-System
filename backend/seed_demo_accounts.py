import os
import sys

# Ensure app is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models.user import User, Role, UserRole
from app.core.security import get_password_hash

MOCK_USERS = {
    'admin@dems.gov': {'name': 'Admin User', 'role': 'Admin', 'department': 'IT Security'},
    'det.johnson@dems.gov': {'name': 'Det. Johnson', 'role': 'Investigator', 'department': 'Homicide'},
    'analyst.chen@dems.gov': {'name': 'Analyst Chen', 'role': 'Analyst', 'department': 'Digital Forensics'},
    'auditor@dems.gov': {'name': 'Auditor Smith', 'role': 'Auditor', 'department': 'Internal Affairs'},
}

def seed_db():
    db = SessionLocal()
    try:
        # Seed Roles - optional but strictly matches the schema expectations for role reference metadata
        for email, u in MOCK_USERS.items():
            role_name = u['role']
            role = db.query(Role).filter(Role.role_name == role_name).first()
            if not role:
                role = Role(role_name=role_name, description=f"{role_name} role")
                db.add(role)
                db.commit()
                db.refresh(role)
            
            # Seed User
            user = db.query(User).filter(User.email == email).first()
            if not user:
                hashed_password = get_password_hash('demo123')
                new_user = User(
                    full_name=u['name'],
                    email=email,
                    password_hash=hashed_password,
                    role=role_name,
                    department=u.get('department')
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
                # Assign role relationship logic explicitly if needed
                user_role_link = UserRole(user_id=new_user.user_id, role_id=role.role_id)
                db.add(user_role_link)
                db.commit()
                print(f"Seeded user: {email} as {role_name}")
            else:
                print(f"User {email} already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db() # Also creates tables if missing
    seed_db()
    print("Database seeding complete!")
