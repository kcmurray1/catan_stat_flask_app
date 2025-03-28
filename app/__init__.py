from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()

DB_NAME = "database.db"

def create_app():
    app = Flask(__name__, static_folder="frontend/static", template_folder="../app/frontend/templates")
    
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    

    db.init_app(app)

    from .blueprints.api_routes import api_bp
    from .blueprints.views import view_bp

    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(view_bp, url_prefix='/')

    from .models import Player, Game
    if not path.exists('app/' + DB_NAME):
        with app.app_context():
            db.create_all()
    return app


