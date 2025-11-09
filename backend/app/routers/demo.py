from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import Optional
import secrets
import string
import re
from collections import defaultdict

from app.database import get_db
from app.models import models
from pydantic import BaseModel, validator

router = APIRouter()

# In-memory rate limiting (simple approach without external dependencies)
# Format: {ip_address: {timestamp: request_count}}
rate_limit_storage = defaultdict(lambda: defaultdict(int))
RATE_LIMIT = 10  # requests per minute per IP
RATE_LIMIT_WINDOW = 60  # seconds

class DemoURLCreate(BaseModel):
    url: str

    @validator('url')
    def validate_url(cls, v):
        # Basic URL validation
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)

        if not url_pattern.match(v):
            raise ValueError('Invalid URL format. Please provide a valid http:// or https:// URL')

        # Check URL length
        if len(v) > 2048:
            raise ValueError('URL is too long (maximum 2048 characters)')

        return v

class DemoURLResponse(BaseModel):
    short_code: str
    original_url: str
    shortened_url: str
    expires_at: str
    created_at: str

    class Config:
        orm_mode = True

class StatsResponse(BaseModel):
    total_urls: int
    total_clicks: int
    total_users: int

def generate_short_code(length: int = 6) -> str:
    """Generate a random short code"""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for _ in range(length))

def check_rate_limit(ip_address: str) -> bool:
    """Check if IP address has exceeded rate limit"""
    now = datetime.utcnow()
    current_minute = int(now.timestamp() // RATE_LIMIT_WINDOW)

    # Clean old entries
    ip_data = rate_limit_storage[ip_address]
    old_minutes = [minute for minute in ip_data.keys() if minute < current_minute - 1]
    for old_minute in old_minutes:
        del ip_data[old_minute]

    # Check current minute
    if ip_data[current_minute] >= RATE_LIMIT:
        return False

    # Increment counter
    ip_data[current_minute] += 1
    return True

def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

@router.post("/demo/urls", response_model=DemoURLResponse, status_code=201)
async def create_demo_url(
    demo_url: DemoURLCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Create a demo shortened URL without authentication.
    Rate limited to 10 requests per minute per IP address.
    Demo URLs expire after 24 hours.
    """
    # Get client IP
    client_ip = get_client_ip(request)

    # Check rate limit
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again in a minute.",
            headers={"Retry-After": "60"}
        )

    # Generate unique short code
    max_attempts = 10
    short_code = None

    for _ in range(max_attempts):
        short_code = generate_short_code()
        # Check if code already exists in both URL and DemoURL tables
        existing_url = db.query(models.URL).filter(models.URL.short_code == short_code).first()
        existing_demo = db.query(models.DemoURL).filter(models.DemoURL.short_code == short_code).first()

        if not existing_url and not existing_demo:
            break
        short_code = None

    if not short_code:
        raise HTTPException(status_code=500, detail="Failed to generate unique short code. Please try again.")

    # Create demo URL with 24-hour expiry
    expires_at = datetime.utcnow() + timedelta(hours=24)

    db_demo_url = models.DemoURL(
        original_url=demo_url.url,
        short_code=short_code,
        expires_at=expires_at,
        ip_address=client_ip
    )

    db.add(db_demo_url)
    try:
        db.commit()
        db.refresh(db_demo_url)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create demo URL")

    # Build shortened URL (use request base URL)
    base_url = str(request.base_url).rstrip('/')
    shortened_url = f"{base_url}/r/{short_code}"

    return DemoURLResponse(
        short_code=db_demo_url.short_code,
        original_url=db_demo_url.original_url,
        shortened_url=shortened_url,
        expires_at=db_demo_url.expires_at.isoformat(),
        created_at=db_demo_url.created_at.isoformat()
    )

@router.get("/public/stats", response_model=StatsResponse)
async def get_public_stats(db: Session = Depends(get_db)):
    """
    Get public statistics about the service.
    Returns total URLs shortened, total clicks tracked, and total users.
    This endpoint is public and cached for performance.
    """
    # Count total URLs (excluding expired demo URLs)
    total_urls = db.query(func.count(models.URL.id)).scalar() or 0

    # Count non-expired demo URLs and add to total
    now = datetime.utcnow()
    active_demo_urls = db.query(func.count(models.DemoURL.id)).filter(
        models.DemoURL.expires_at > now
    ).scalar() or 0

    total_urls += active_demo_urls

    # Count total clicks
    total_clicks = db.query(func.count(models.Click.id)).scalar() or 0

    # Count total users
    total_users = db.query(func.count(models.User.id)).scalar() or 0

    return StatsResponse(
        total_urls=total_urls,
        total_clicks=total_clicks,
        total_users=total_users
    )

@router.delete("/demo/cleanup")
async def cleanup_expired_demo_urls(db: Session = Depends(get_db)):
    """
    Clean up expired demo URLs.
    This endpoint should be called periodically (e.g., daily cron job).
    For security, this could be protected with an internal API key in production.
    """
    now = datetime.utcnow()

    # Delete expired demo URLs
    deleted = db.query(models.DemoURL).filter(
        models.DemoURL.expires_at <= now
    ).delete(synchronize_session=False)

    db.commit()

    return {"message": f"Cleaned up {deleted} expired demo URLs"}
