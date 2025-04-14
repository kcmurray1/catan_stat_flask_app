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
    
    all_games = db.session.execute(select(Game).order_by(Game.date.desc())).mappings().all()

    return render_template("index.html", people=Player.query.all(), game_history= [game["Game"] for game in all_games] ,today=current_date.strftime("%m/%d/%Y"))


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