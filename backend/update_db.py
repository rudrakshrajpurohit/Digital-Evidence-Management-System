import os
import sys
from sqlalchemy import text
from app.database import engine

def main():
    try:
        with engine.connect() as conn:
            # Check if column exists
            result = conn.execute(text("SHOW COLUMNS FROM evidence_logs LIKE 'notes';"))
            if not result.fetchone():
                print("Adding 'notes' column to 'evidence_logs' table...")
                conn.execute(text("ALTER TABLE evidence_logs ADD COLUMN notes TEXT;"))
                conn.commit()
                print("Successfully added 'notes' column.")
            else:
                print("'notes' column already exists.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
