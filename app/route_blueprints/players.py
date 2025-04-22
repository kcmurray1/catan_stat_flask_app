from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db
from app.models import *
from sqlalchemy import select
from app.services.player_services import PlayerServices

players_bp = Blueprint('players', __name__)

def get_player(username):
    db = get_db()

    return db.session.scalar(select(Player).where(Player.first_name == username))

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
    
    # retrieve rolls
    try:
        rolls = PlayerServices.get_rolls(player.player_id, game_id)
    except Exception as e:
        return make_response({"error" : str(e)}, 500)
    return make_response({"result": "success", "rolls" : rolls}, 201)

    

