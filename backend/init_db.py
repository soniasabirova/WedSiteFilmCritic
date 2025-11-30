"""
Скрипт для инициализации базы данных PostgreSQL

Перед запуском:
1. Установите PostgreSQL
2. Создайте базу данных: CREATE DATABASE kinocritic;
3. Создайте файл .env с настройками (см. env_example.txt)
4. Запустите этот скрипт: python init_db.py
"""

from app import create_app
from models import db

def init_database():
    """Создание всех таблиц в базе данных"""
    app = create_app()
    
    with app.app_context():
        # Создаём все таблицы
        db.create_all()
        print("✅ Таблицы успешно созданы!")
        print("\nСозданы таблицы:")
        print("  - users (пользователи)")
        print("  - movies (фильмы/сериалы)")

if __name__ == '__main__':
    init_database()

