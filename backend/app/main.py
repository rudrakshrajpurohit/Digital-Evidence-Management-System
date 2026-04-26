from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import auth, evidence, audit, custody, logs

# Initialize database tables and triggers on startup
init_db()

app = FastAPI(
    title="Digital Evidence & Chain-of-Custody API",
    description="A forensic-grade digital evidence system ensuring immutability and complete auditability.",
    version="1.0.0"
)

# Allow CORS for the separate React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Core routers ──────────────────────────────────────────
from app.routes import users
app.include_router(auth.router)       # /auth/login, /auth/register
app.include_router(users.router)      # /api/users
app.include_router(evidence.router)   # /evidence/...
app.include_router(audit.router)      # /audit/evidence/{id}/logs
app.include_router(custody.router)    # /api/custody
app.include_router(logs.router)       # /api/logs/access, /api/logs/system

@app.get("/")
def root():
    return {"message": "Digital Evidence API is running securely.", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
