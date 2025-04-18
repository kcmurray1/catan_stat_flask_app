from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()

DB_NAME = "database.db"

def create_app():
    app = Flask(__name__, static_folder="frontend/static", template_folder="../app/frontend/templates")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    

    db.init_app(app)

    from .route_blueprints.views import view_bp
    from .route_blueprints.players import players_bp
    from .route_blueprints.games import games_bp

    app.register_blueprint(view_bp, url_prefix='/')
    app.register_blueprint(players_bp, url_prefix='/players')
    app.register_blueprint(games_bp, url_prefix='/games')

    from .models import Player, Game
    if not path.exists('app/' + DB_NAME):
        with app.app_context():
            db.create_all()
    return app


