from flask import Flask, send_from_directory, session
from flask_cors import CORS
from config import Config
from models import db

def create_app():
    app = Flask(__name__, static_folder='../')
    app.config.from_object(Config)
    
    db.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Импорт и регистрация роутов
    from routes.auth import auth_bp
    from routes.movies import movies_bp
    from routes.stats import stats_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(movies_bp, url_prefix='/api/movies')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def serve_index():
        return send_from_directory(app.static_folder, 'index.html')
    
    @app.route('/<path:filename>')
    def serve_static(filename):
        return send_from_directory(app.static_folder, filename)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True, port=5000)
