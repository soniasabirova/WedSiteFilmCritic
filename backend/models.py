from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    """Модель пользователя"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Связь с фильмами
    movies = db.relationship('Movie', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Хеширование пароля с помощью bcrypt"""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Проверка пароля"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }


class Movie(db.Model):
    """Модель фильма/сериала"""
    __tablename__ = 'movies'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    title = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # 'film' или 'series'
    genre = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 звёзд
    watch_date = db.Column(db.Date, nullable=False)
    review = db.Column(db.Text, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Словарь для перевода жанров
    GENRE_NAMES = {
        'action': 'Боевик',
        'comedy': 'Комедия',
        'drama': 'Драма',
        'fantasy': 'Фэнтези',
        'horror': 'Ужасы',
        'scifi': 'Фантастика',
        'thriller': 'Триллер',
        'romance': 'Мелодрама',
        'animation': 'Анимация',
        'documentary': 'Документальный'
    }
    
    TYPE_NAMES = {
        'film': 'Фильм',
        'series': 'Сериал'
    }
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'type_name': self.TYPE_NAMES.get(self.type, self.type),
            'genre': self.genre,
            'genre_name': self.GENRE_NAMES.get(self.genre, self.genre),
            'rating': self.rating,
            'watch_date': self.watch_date.isoformat(),
            'review': self.review,
            'created_at': self.created_at.isoformat()
        }

