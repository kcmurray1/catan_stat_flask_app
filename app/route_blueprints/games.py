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

@games_bp.route("/create", methods=["POST"])
def games_create():
    db = get_db()

    # Create new Game Object
    new_game = Game()
    info_to_add = [new_game]

    for player_name in request.json["players"]:
        # check if player already exists
        new_player = db.session.scalar(select(Player).where(Player.first_name == player_name))
        if not new_player:
            # Create a new Player
            new_player = Player(first_name=player_name)
            info_to_add.append(new_player)
        # Add player to this game
        new_player.games_played.append(new_game)

    # save to DB
    db.session.add_all(info_to_add)
    db.session.commit()

    return make_response({"result": "Success", "game_id": new_game.game_id}, 201)


@games_bp.route("/<int:game_id>")
def games_data(game_id):

    # Verify game exists
    game = get_game(game_id)

    if not game:
        return make_response({"error" : "game not found"}, 404)
    
    db = get_db()

    # individual statements to sum columns roll_count_2, roll_count_3...roll_count_12
    individual_sums = [func.sum(game_player.c[f"roll_count_{i}"]) for i in range(2,13)]

    
    total_roll_counts = db.session.execute(
        select(*individual_sums)
        .where(game_player.c.game_id == game_id)
        .where(game_player.c.player_id == Player.player_id)
    ).one()

    # get the rolls, score, and name of the players in the game
    game_data = db.session.execute(
        select(game_player, Player.first_name)
        .where(game_player.c.game_id == game_id)
        .where(game_player.c.player_id == Player.player_id)
    ).mappings()


    if not game_data:
        return make_response({"error": "unable to retrieve game players"}, 500)

    # Adjust naming of columns(change roll_count_2 to 2, roll_count_3 to 3..etc)
    payload = dict()
    payload["rolls"] = {}
    payload["players"] = [x.first_name for x in Game.query.get(game_id).players]
    
    column_names = [i for i in range(2, 13)]

    for key, val in zip(column_names, total_roll_counts):
        payload["rolls"][key] = val 

    return make_response({"result" : "success", "game" : payload}, 200)
    

@games_bp.route("/add-roll/<username>", methods=["POST"])
def add_roll(username):
    db = get_db()
    data = request.json

    roll_column = f"roll_count_{data["roll"]}"


    # update roll for game_player entry
    db.session.execute(
        update(game_player)
        .where(
            game_player.c.player_id == select(Player.player_id).where(Player.first_name == username).scalar_subquery()
        )
        .where(
            game_player.c.game_id == select(Game.game_id).order_by(Game.date.desc()).scalar_subquery()
        )
        .values(
            {roll_column: game_player.c[roll_column] + 1}
        )
    )

    db.session.commit()

    return make_response({"result": "nice!"}, 201)
