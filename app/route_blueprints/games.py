from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db, add_db_item
from app.models import Player, Game, game_player, ModelUtils
from sqlalchemy import select, update, func
import random

games_bp = Blueprint('games', __name__)


def get_game(game_id) -> (Game | None):
    db = get_db()
    game = db.session.scalar(select(Game).where(Game.game_id == game_id))
    return game

@games_bp.route("/")
def games_home():
    payload = [game.to_json() for game in get_db().session.scalars(select(Game)).all()]
    return make_response({"result" : "success", "games" : payload}, 200)

@games_bp.route("/<int:game_id>", methods=["POST"])
def games_data(game_id):

    game = get_game(game_id)

    if not game:
        return make_response({"error" : "game not found"}, 404)
    
    db = get_db()

    individual_sums = [func.sum(game_player.c[f"roll_count_{i}"]) for i in range(2,13)]

    
    total_roll_counts = db.session.execute(
        select(*individual_sums)
        .where(game_player.c.game_id == game_id)
        .where(game_player.c.player_id == Player.player_id)
    ).one()
    print(Game.query.get(game_id).players)
    print(total_roll_counts)

    column_names = [i for i in range(2, 13)]

    game_data = db.session.execute(
        select(game_player, Player.first_name)
        .where(game_player.c.game_id == game_id)
        .where(game_player.c.player_id == Player.player_id)
    ).mappings()


    if not game_data:
        return make_response({"error": "unable to retrieve game players"}, 500)


    payload = dict()
    payload["rolls"] = {}
    payload["players"] = [x.first_name for x in Game.query.get(game_id).players]
    
    for key, val in zip(column_names, total_roll_counts):
        payload["rolls"][key] = val 

    return make_response({"result" : "success", "game" : payload}, 200)
    
