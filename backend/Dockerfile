FROM python:3.11-slim

# Установка рабочей директории
WORKDIR /app

# Установка системных зависимостей для psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование файла зависимостей
COPY requirements.txt .

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование исходного кода
COPY . .

# Создание директории для статических файлов
RUN mkdir -p /app/static

# Переменные окружения
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Порт приложения
EXPOSE 5000

# Команда запуска
CMD ["python", "app.py"]

