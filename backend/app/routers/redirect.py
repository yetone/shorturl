from fastapi import APIRouter, Depends, HTTPException, Request, Header
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.models import URL, Click, DemoURL
from user_agents import parse as ua_parse
import geoip2.database
import os

# Path to the GeoLite2 database
GEOIP_DB_PATH = os.environ.get("GEOIP_DB_PATH", "/app/GeoLite2-City.mmdb")
geoip_reader = None

# Try to initialize the GeoIP reader
try:
    if os.path.exists(GEOIP_DB_PATH):
        geoip_reader = geoip2.database.Reader(GEOIP_DB_PATH)
except Exception as e:
    print(f"Failed to initialize GeoIP database: {e}")

router = APIRouter(tags=["redirect"], prefix="/r")

@router.get("/{short_code}")
def redirect_to_url(
    short_code: str, 
    request: Request, 
    db: Session = Depends(get_db),
    user_agent: Optional[str] = Header(None),
    referer: Optional[str] = Header(None)
):
    # First check regular URLs
    db_url = db.query(URL).filter(URL.short_code == short_code).first()

    # If not found, check demo URLs
    if db_url is None:
        from datetime import datetime
        demo_url = db.query(DemoURL).filter(
            DemoURL.short_code == short_code,
            DemoURL.expires_at > datetime.utcnow()
        ).first()

        if demo_url is None:
            raise HTTPException(status_code=404, detail="URL not found or expired")

        # Demo URLs don't track clicks - just redirect
        return RedirectResponse(url=demo_url.original_url)
    
    # Parse user agent to get operating system and browser
    operating_system = "Unknown"
    if user_agent:
        try:
            parsed_ua = ua_parse(user_agent)
            operating_system = parsed_ua.os.family
        except Exception as e:
            print(f"Error parsing user agent: {e}")
    
    # Get location from IP address
    location = "Unknown"
    country = None
    city = None
    
    # Get the real client IP address, accounting for reverse proxies
    client_host = None
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For can contain multiple IPs - the leftmost is the original client
        client_host = forwarded_for.split(",")[0].strip()
    else:
        # Fall back to the direct client IP if X-Forwarded-For is not present
        client_host = request.client.host if request.client else None
    
    if client_host and geoip_reader:
        try:
            # Skip localhost or private IPs
            if not (client_host == "127.0.0.1" or client_host.startswith("192.168.") or client_host.startswith("10.") or client_host.startswith("172.16.")):
                response = geoip_reader.city(client_host)
                if response.city.name and response.country.name:
                    location = f"{response.city.name}, {response.country.name}"
                    city = response.city.name
                    country = response.country.name
                elif response.country.name:
                    location = response.country.name
                    country = response.country.name
        except Exception as e:
            print(f"Error getting location: {e}")
    
    # Record the click
    click = Click(
        url_id=db_url.id,
        referrer=referer,
        user_agent=user_agent,
        ip_address=client_host,
        client_host=client_host,  # 存储客户端主机信息
        operating_system=operating_system,
        location=location,
        country=country,
        city=city
    )
    db.add(click)
    db.commit()
    
    # Redirect to the original URL
    return RedirectResponse(url=db_url.original_url)
