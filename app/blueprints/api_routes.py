from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db, add_db_item
from app.models import Player, Game, game_player
from sqlalchemy import select, update
import random
api_bp = Blueprint('api', __name__)

@api_bp.route('/api-home')
def api_home():
    return make_response({"result": "Welcome"}, 200)

# update database with roll for player
@api_bp.route('/submit-roll/<user>', methods=['POST'])
def submit(user):
    db = get_db()
    data = request.json

    print(data, user)
    roll_column = f"roll_count_{data["roll"]}"

    # update roll for game_player entry
    db.session.execute(update(game_player).where(
        game_player.c.player_id ==
        select(Player.player_id).where(Player.first_name == user).scalar_subquery()
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

    data = request.json

    for player_name in data["players"]:
        # Add player to this game
        new_player = Player(first_name=player_name)
        new_player.games_played.append(new_game)

        info_to_add.append(new_player)
        
        

    # save to DB
    db.session.add_all(info_to_add)
    db.session.commit()

    return make_response({"result": "Success"}, 201)



# Retrieve player information such as 
# roll count
@api_bp.route('/player/<ID>', methods=["POST"])
def get_player_info(ID):
    print(ID)
    test = {}
    for i in range(2, 13):
        test[i] = random.randint(1,10)
    return test