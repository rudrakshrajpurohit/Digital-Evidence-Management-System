from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routes import auth, evidence, audit

# Initialize Database and create strict immutability triggers
init_db()

app = FastAPI(
    title="Digital Evidence & Chain-of-Custody API",
    description="A forensic-grade digital evidence system ensuring immutability and complete auditability.",
    version="1.0.0"
)

# Allow CORS for the separate React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this in production to match frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(evidence.router)
app.include_router(audit.router)

@app.get("/")
def root():
    return {"message": "Digital Evidence API is running securely."}
