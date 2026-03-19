from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes.advisor import router as advisor_router
from app.routes.trustscore import router as trustscore_router

app = FastAPI(
    title="NexusLife AI Service",
    description="AI-powered insights and trust score engine for NexusLife",
    version="1.0.0",
)

# CORS — allow backend and frontend to call this service
# Support both local development and production environments
allowed_origins = [
    "http://localhost:5000",
    "http://localhost:5173",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5173",
]

# Add production origins from environment or Render domains
prod_backend = os.getenv("BACKEND_URL")
prod_frontend = os.getenv("FRONTEND_URL")
if prod_backend:
    allowed_origins.append(prod_backend)
if prod_frontend:
    allowed_origins.append(prod_frontend)

# Allow any *.onrender.com domain for flexibility
allowed_origins.append("https://*.onrender.com")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(advisor_router)
app.include_router(trustscore_router)


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "nexuslife-ai-service"}
