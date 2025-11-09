from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import event
from .database import engine, Base, get_db
from .routers import users, auth, urls, redirect, settings, frontend, demo
from .models.models import SiteSettings, User
from sqlalchemy.orm import Session
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShortURL API", description="A URL shortener service API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize site settings if not exists
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    settings = db.query(SiteSettings).first()
    if not settings:
        settings = SiteSettings(registration_enabled=True)
        db.add(settings)
        db.commit()

# Serve static files from the frontend build
STATIC_DIR = os.environ.get("STATIC_DIR", "/app/static")
if os.path.exists(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=f"{STATIC_DIR}/assets"), name="static")

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(urls.router)
app.include_router(redirect.router)
app.include_router(settings.router)
app.include_router(demo.router, prefix="/api")

# API health check route
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# This should be the last router to be included
# It will handle all routes that haven't been matched by other routers
app.include_router(frontend.router)
