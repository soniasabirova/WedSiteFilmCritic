from flask import Blueprint, request, jsonify, session
from models import db, Movie
from datetime import datetime

movies_bp = Blueprint('movies', __name__)

def get_user_id():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return user_id


@movies_bp.route('', methods=['GET'])
def get_movies():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    # Фильтры
    movie_type = request.args.get('type')
    genre = request.args.get('genre')
    rating = request.args.get('rating')
    sort_by = request.args.get('sort', 'date-desc')
    search = request.args.get('search', '').strip()
    
    query = Movie.query.filter_by(user_id=user_id)
    
    if movie_type:
        query = query.filter_by(type=movie_type)
    if genre:
        query = query.filter_by(genre=genre)
    if rating:
        query = query.filter(Movie.rating >= int(rating))
    if search:
        query = query.filter(Movie.title.ilike(f'%{search}%'))
    
    if sort_by == 'date-desc':
        query = query.order_by(Movie.watch_date.desc())
    elif sort_by == 'date-asc':
        query = query.order_by(Movie.watch_date.asc())
    else:
        query = query.order_by(Movie.created_at.desc())
    
    movies = query.all()
    return jsonify({'movies': [m.to_dict() for m in movies], 'total': len(movies)}), 200


@movies_bp.route('/recent', methods=['GET'])
def get_recent():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movies = Movie.query.filter_by(user_id=user_id)\
        .order_by(Movie.created_at.desc()).limit(3).all()
    
    return jsonify({'movies': [m.to_dict() for m in movies]}), 200


@movies_bp.route('/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movie = Movie.query.filter_by(id=movie_id, user_id=user_id).first()
    if not movie:
        return jsonify({'error': 'Фильм не найден'}), 404
    
    return jsonify({'movie': movie.to_dict()}), 200


@movies_bp.route('', methods=['POST'])
def add_movie():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    data = request.get_json()
    
    required = ['title', 'type', 'genre', 'rating', 'watch_date']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Заполните поле {field}'}), 400
    
    try:
        movie = Movie(
            user_id=user_id,
            title=data['title'].strip(),
            type=data['type'],
            genre=data['genre'],
            rating=int(data['rating']),
            watch_date=datetime.strptime(data['watch_date'], '%Y-%m-%d').date(),
            review=data.get('review', '').strip() or None
        )
        db.session.add(movie)
        db.session.commit()
        
        return jsonify({'message': 'Фильм добавлен', 'movie': movie.to_dict()}), 201
    except:
        return jsonify({'error': 'Ошибка сохранения'}), 400


@movies_bp.route('/<int:movie_id>', methods=['PUT'])
def update_movie(movie_id):
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movie = Movie.query.filter_by(id=movie_id, user_id=user_id).first()
    if not movie:
        return jsonify({'error': 'Фильм не найден'}), 404
    
    data = request.get_json()
    
    if data.get('title'):
        movie.title = data['title'].strip()
    if data.get('type'):
        movie.type = data['type']
    if data.get('genre'):
        movie.genre = data['genre']
    if data.get('rating'):
        movie.rating = int(data['rating'])
    if data.get('watch_date'):
        movie.watch_date = datetime.strptime(data['watch_date'], '%Y-%m-%d').date()
    if 'review' in data:
        movie.review = data['review'].strip() or None
    
    db.session.commit()
    return jsonify({'message': 'Фильм обновлён', 'movie': movie.to_dict()}), 200


@movies_bp.route('/<int:movie_id>', methods=['DELETE'])
def delete_movie(movie_id):
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movie = Movie.query.filter_by(id=movie_id, user_id=user_id).first()
    if not movie:
        return jsonify({'error': 'Фильм не найден'}), 404
    
    db.session.delete(movie)
    db.session.commit()
    return jsonify({'message': 'Фильм удалён'}), 200
