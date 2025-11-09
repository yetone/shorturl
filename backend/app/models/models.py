from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets
from app.database import Base

class URL(Base):
    __tablename__ = "urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, index=True)
    short_code = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    share_token = Column(String(64), unique=True, index=True, nullable=True)
    
    user = relationship("User", back_populates="urls")
    clicks = relationship("Click", back_populates="url", cascade="all, delete-orphan")
    
    def generate_share_token(self):
        """Generate a unique share token for URL stats sharing"""
        return secrets.token_urlsafe(32)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_admin = Column(Integer, default=0)  # 0: normal user, 1: admin user
    
    urls = relationship("URL", back_populates="user", cascade="all, delete-orphan")

class Click(Base):
    __tablename__ = "clicks"

    id = Column(Integer, primary_key=True, index=True)
    url_id = Column(Integer, ForeignKey("urls.id"))
    clicked_at = Column(DateTime, default=datetime.utcnow)
    referrer = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    client_host = Column(String, nullable=True)  # 添加新字段存储客户端主机信息
    operating_system = Column(String, nullable=True)
    location = Column(String, nullable=True)
    country = Column(String, nullable=True)  # 添加国家字段
    city = Column(String, nullable=True)  # 添加城市字段
    
    url = relationship("URL", back_populates="clicks")

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)
    registration_enabled = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)

class DemoURL(Base):
    __tablename__ = "demo_urls"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String, index=True)
    short_code = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, index=True)  # 24 hours from creation
    ip_address = Column(String, nullable=True)  # For rate limiting
