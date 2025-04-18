from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db, add_db_item
from app.models import Player, Game, game_player, ModelUtils
from sqlalchemy import select, update, func
import random

players_bp = Blueprint('players', __name__)

IGNORED_COLUMNS = frozenset(["game_id", "player_id", "score"])

def get_player(username):
    db = get_db()

    player = db.session.scalar(select(Player).where(Player.first_name == username))
    return player

# returns all registered players
@players_bp.route('/')
def players_home():
    payload = [player.to_json() for player in get_db().session.scalars(select(Player)).all()]
    return make_response({"result" : "success", "players" : payload})

# Get all information for specific player
@players_bp.route('/<username>/')
def player_data(username):

    player = get_player(username)

    if not player:
        return make_response({"error" : "Player not found"}, 404)
    
    return make_response({"result": "Success!", "player" : player.to_json()}, 200)

# Get roll frequency from specific game
@players_bp.route('/<username>/<game_id>/rolls')
def players_stats(username, game_id):
    # Verify player exists
    player = get_player(username)

    if not player:
        return make_response({"error" : "Player not found"}, 404)

    # retrieve roll counts
    db = get_db()
    player_stats = db.session.execute(
        select(*ModelUtils.allCounts())
        .where(game_player.c.player_id == player.player_id)
        .where(game_player.c.game_id == game_id)
    ).mappings().first()

    # no rolls were recorded
    if not player_stats:
        return  {key.split("_")[-1] : 0 for key in game_player.c.keys() if key not in IGNORED_COLUMNS}
   
    
    payload = {key.split("_")[-1] : player_stats[key] for key in player_stats.keys()}

    # issue retrieving information from player
    if not player_stats:
        return make_response({"error" : "cannot retrieve player stats"}, 500)

 
    return make_response({"result": "success", "rolls" : payload}, 201)

    

