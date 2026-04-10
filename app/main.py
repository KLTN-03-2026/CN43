"""Job Portal API - Backend Server

A FastAPI-based job portal with:
- User authentication (JWT + OTP email verification)
- Job posting management (employers only)
- Application management (candidates apply to jobs)
- AI-powered CV screening using Google Gemini API
- Role-based access control (employer/candidate)

For detailed API spec, see: SPEC.md
"""

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.common.infrastructure.config import settings
from app.common.infrastructure.database import init_db
from app.features.auth.interfaces.controllers.auth import router as auth_router
from app.features.jobs.interfaces.controllers.jobs import router as jobs_router
from app.features.applications.interfaces.controllers.applications import router as applications_router

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager.

    Handles:
    - Database initialization on startup
    - Cleanup on shutdown
    """
    await init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    lifespan=lifespan,
    description="Job Portal Backend API - Spec Driven Development",
    version="1.0.0",
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)

# Mount static files for SPA (Single Page Application)
if STATIC_DIR.is_dir():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/health", tags=["health"])
async def health():
    """Health check endpoint.

    Returns:
        dict: Status indicator
    """
    return {"status": "ok"}


@app.get("/", tags=["frontend"])
async def serve_frontend():
    """Serve SPA frontend (index.html).

    Returns:
        FileResponse: index.html or error message if missing
    """
    index = STATIC_DIR / "index.html"
    if not index.is_file():
        return {
            "message": "Frontend is missing. Add static/index.html to serve the integrated UI."
        }
    return FileResponse(index)


@app.get("/{full_path:path}", tags=["frontend"])
async def serve_spa_routes(full_path: str):
    """Serve SPA routes fallback.

    For Single Page Applications (React, Vue, etc.), all undefined routes
    should return index.html so the frontend router can handle them.

    Args:
        full_path: The requested path

    Returns:
        FileResponse: index.html or error message if missing
    """
    index = STATIC_DIR / "index.html"
    if not index.is_file():
        return {
            "message": "Frontend is missing. Add static/index.html to serve the integrated UI."
        }
    return FileResponse(index)
