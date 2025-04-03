from flask import Blueprint, make_response, render_template, redirect, url_for, current_app, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select
from app.models import Player, Game
from app.utils.db_utils import get_db, add_db_item
from datetime import date
"""Display informatio for user"""
view_bp = Blueprint('/',__name__,  url_prefix='/')

@view_bp.route('/')
def view_home():
    current_date = date.today()

    db = get_db()

    g = db.session.scalar(select(Game.game_id).order_by(Game.date.desc()))

    print("recent game", g)

    return render_template("index.html", people=Player.query.all(), today=current_date.strftime("%m/%d/%Y"))

@view_bp.route('/add-player/<name>')
def add_player(name):
    db = get_db()
    # Create new Player
    # p = Player(first_name=name)
    p = db.session.scalar(select(Player).where(Player.first_name== "Obama"))

    p.first_name = name
    # add_db_item(p)
   
    # add player to current game
    # p.games_played.append(
        # db.session.scalar(select(Game).where(Game.game_id == 1))
    # )

    db.session.commit()
  
    
    
    return f"""Added awd to database {str(Player.query.all())}"""


@view_bp.route('/remove-player')
def remove_player():
    # p = Player.query.get()
    # if p:
    #     db = get_db()
    #     db.session.delete(p)
    #     db.session.commit()
    return "hi"

@view_bp.route('/stats')
def stats():        
    items = Player.query.all()
    for player in items:
        print(player.first_name)
    game = Game.query.first()
    print(game.players)
    # NOTE: redirect to another template follows <name>.<function_name>
    return redirect(url_for("api.api_home"))