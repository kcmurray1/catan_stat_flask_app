from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db
from app.models import *
from sqlalchemy import select, func
from app.services.game_services import GameService

games_bp = Blueprint('games', __name__)


def get_game(game_id) -> (Game | None):
    db = get_db()
    return db.session.scalar(select(Game).where(Game.game_id == game_id))

@games_bp.route("/")
def games_home():
    payload = [game.to_json() for game in get_db().session.scalars(select(Game)).all()]
    return make_response({"result" : "success", "games" : payload}, 200)

@games_bp.route("/create", methods=["POST"])
def games_create():

    try:
        new_game = GameService.create_game(request.json["players"])
    except Exception as e:
        return make_response({"error" : str(e)}, 500)

    return make_response({"result": "Success", "game_id": new_game}, 201)


@games_bp.route("/<int:game_id>")
def games_data(game_id):

    # Verify game exists
    game = get_game(game_id)

    if not game:
        return make_response({"error" : "game not found"}, 404)
    
    try:
        total_roll_counts, _ = GameService.game_details(game_id)
    except Exception as e:
        return make_response({"error": str(e)}, 500)

    # Adjust naming of columns(change roll_count_2 to 2, roll_count_3 to 3..etc)
    payload = dict()
    payload["rolls"] = {}
    payload["players"] = [x.first_name for x in Game.query.get(game_id).players]
    
    column_names = [i for i in range(2, 13)]

    for key, val in zip(column_names, total_roll_counts):
        payload["rolls"][key] = val 

    return make_response({"result" : "success", "game" : payload}, 200)
    
# FIXME: change to PUT
@games_bp.route("/add-roll/<username>", methods=["POST"])
def add_roll(username):
    data = request.json

    try:
        GameService.add_game_roll(username, data["roll"])
    except Exception as e:
        return make_response({"error": str(e)}, 500)

    return make_response({"result": "nice!"}, 201)
