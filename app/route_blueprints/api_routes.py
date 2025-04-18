from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db, add_db_item
from app.models import Player, Game, game_player, ModelUtils
from sqlalchemy import select, update, func
import random
api_bp = Blueprint('api', __name__)

@api_bp.route('/api-status')
def api_home():
    return make_response({"result": "Success!"}, 200)


# update database with roll for player
@api_bp.route('/submit-roll/<user>', methods=['POST'])
def submit(user):
    db = get_db()
    data = request.json

    roll_column = f"roll_count_{data["roll"]}"


    # update roll for game_player entry
    db.session.execute(
        update(game_player)
        .where(
            game_player.c.player_id == select(Player.player_id).where(Player.first_name == user).scalar_subquery()
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


@api_bp.route('/create-game', methods=["POST"])
def create_game():
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


