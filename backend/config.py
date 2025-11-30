from datetime import timedelta
import os

class Config:
    SECRET_KEY = 'kinocritic-secret-2025'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres123@localhost:5432/kinocritic')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Сессии
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
