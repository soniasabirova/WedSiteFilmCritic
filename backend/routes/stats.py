from flask import Blueprint, jsonify, session
from models import db, Movie
from sqlalchemy import func, extract
from collections import Counter
from datetime import datetime

stats_bp = Blueprint('stats', __name__)

def get_user_id():
    return session.get('user_id')


@stats_bp.route('/general', methods=['GET'])
def get_general_stats():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movies = Movie.query.filter_by(user_id=user_id).all()
    
    if not movies:
        return jsonify({
            'total_movies': 0,
            'average_rating': None,
            'favorite_genre': None
        }), 200
    
    total = len(movies)
    avg_rating = round(sum(m.rating for m in movies) / total, 1)
    
    genres = [m.genre for m in movies]
    favorite = Counter(genres).most_common(1)[0][0]
    favorite_name = Movie.GENRE_NAMES.get(favorite, favorite)
    
    return jsonify({
        'total_movies': total,
        'average_rating': avg_rating,
        'favorite_genre': favorite_name
    }), 200


@stats_bp.route('/monthly', methods=['GET'])
def get_monthly_stats():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    year = datetime.now().year
    
    data = db.session.query(
        extract('month', Movie.watch_date).label('month'),
        func.count(Movie.id).label('count')
    ).filter(
        Movie.user_id == user_id,
        extract('year', Movie.watch_date) == year
    ).group_by(extract('month', Movie.watch_date)).all()
    
    months = {1:'Янв',2:'Фев',3:'Мар',4:'Апр',5:'Май',6:'Июн',
              7:'Июл',8:'Авг',9:'Сен',10:'Окт',11:'Ноя',12:'Дек'}
    
    monthly_dict = {int(r.month): r.count for r in data}
    result = [{'month': months[i], 'month_num': i, 'count': monthly_dict.get(i, 0)} for i in range(1, 13)]
    
    return jsonify({'monthly': result}), 200


@stats_bp.route('/ratings', methods=['GET'])
def get_ratings():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    data = db.session.query(
        Movie.rating,
        func.count(Movie.id).label('count')
    ).filter(Movie.user_id == user_id).group_by(Movie.rating).all()
    
    ratings_dict = {r.rating: r.count for r in data}
    total = sum(ratings_dict.values())
    
    result = []
    for r in range(1, 6):
        count = ratings_dict.get(r, 0)
        result.append({
            'rating': r,
            'stars': '★' * r + '☆' * (5 - r),
            'count': count,
            'percentage': round((count / total * 100) if total > 0 else 0, 1)
        })
    
    return jsonify({'ratings': result, 'total': total}), 200


@stats_bp.route('/top', methods=['GET'])
def get_top():
    user_id = get_user_id()
    if not user_id:
        return jsonify({'error': 'Не авторизован'}), 401
    
    movies = Movie.query.filter_by(user_id=user_id)\
        .order_by(Movie.rating.desc(), Movie.created_at.desc()).limit(5).all()
    
    result = [{'rank': i+1, 'title': m.title, 'rating': m.rating, 
               'stars': '★'*m.rating + '☆'*(5-m.rating)} for i, m in enumerate(movies)]
    
    return jsonify({'top_movies': result}), 200
