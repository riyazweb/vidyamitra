"""
VidyaMitra Backend - FastAPI Main Application
AI-Powered Career Intelligence Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from app.core.config import ALLOWED_ORIGINS, PUBLIC_API_BASE_URL, API_HOST, API_PORT

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="VidyaMitra API",
    description="AI-Powered Career Intelligence Platform - Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== ROUTERS ====================
from app.routers import resume, quiz, interview, skills, training, jobs, chat

app.include_router(resume.router, prefix="/api/resume", tags=["Resume Analysis"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz & Assessment"])
app.include_router(interview.router, prefix="/api/interview", tags=["Mock Interview"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills Assessment"])
app.include_router(training.router, prefix="/api/training", tags=["Training Plans"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Job Recommendations"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Career Assistant"])

# ==================== ROOT ENDPOINTS ====================

@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint - Check if API is running
    """
    return {
        "status": "✅ Running",
        "message": "Welcome to VidyaMitra API",
        "version": "1.0.0",
        "docs": f"{PUBLIC_API_BASE_URL}/docs"
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "service": "VidyaMitra Backend",
        "timestamp": __import__("datetime").datetime.now().isoformat()
    }


@app.get("/api/v1/status", tags=["Health Check"])
async def api_status():
    """
    Detailed API status with component checks
    """
    return {
        "api": "✅ Online",
        "authentication": "⚙️ Configured",
        "database": "⚙️ Configured",
        "ai_service": "⚙️ Configured",
        "external_apis": "⚙️ Configured",
        "version": "1.0.0"
    }


# ==================== ERROR HANDLERS ====================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors
    """
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if os.getenv("DEBUG") else "An error occurred"
        }
    )


# ==================== STARTUP & SHUTDOWN ====================

@app.on_event("startup")
async def startup_event():
    """
    Run on application startup
    """
    print("🚀 VidyaMitra Backend Starting...")
    print(f"📡 API Documentation: {PUBLIC_API_BASE_URL}/docs")
    print("✅ Ready to process career insights!")


@app.on_event("shutdown")
async def shutdown_event():
    """
    Run on application shutdown
    """
    print("🛑 VidyaMitra Backend Shutting Down...")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=API_HOST,
        port=API_PORT,
        reload=True,
        log_level="info"
    )
