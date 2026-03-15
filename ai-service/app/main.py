from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.routes.advisor import router as advisor_router
from app.routes.trustscore import router as trustscore_router

app = FastAPI(
    title="NexusLife AI Service",
    description="AI-powered insights and trust score engine for NexusLife",
    version="1.0.0",
)

# CORS — allow backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
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
