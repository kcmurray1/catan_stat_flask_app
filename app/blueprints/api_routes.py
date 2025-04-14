from flask import Blueprint, make_response, request
from app.utils.db_utils import get_db, add_db_item
from app.models import Player, Game, game_player, ModelUtils
from sqlalchemy import select, update, func
import random
api_bp = Blueprint('api', __name__)

@api_bp.route('/api-status')
def api_home():
    return make_response({"result": "Success!"}, 200)

@api_bp.route('/game-data/<id>', methods=["POST"])
def get_game_data(id):
    db = get_db()


    all_count_columns = sum(func.sum(game_player.c[f"roll_count_{i}"]) for i in range(2,13))

    individual_sums = [func.sum(game_player.c[f"roll_count_{i}"]) for i in range(2,13)]

    
    total_roll_counts = db.session.execute(
        select(*individual_sums)
        .where(game_player.c.game_id == id)
        .where(game_player.c.player_id == Player.player_id)
    ).one()
    print(Game.query.get(id).players)
    print(total_roll_counts)

    column_names = [i for i in range(2, 13)]

    game_data = db.session.execute(
        select(game_player, Player.first_name)
        .where(game_player.c.game_id == id)
        .where(game_player.c.player_id == Player.player_id)
    ).mappings()



    payload = dict()
    payload["rolls"] = {}
    payload["players"] = [x.first_name for x in Game.query.get(id).players]
    
    for key, val in zip(column_names, total_roll_counts):
        payload["rolls"][key] = val 


    if not game_data:
        return make_response({"error": "Game not found"}, 404)

    return make_response({"result": "success", "data" : payload}, 201)

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

    data = request.json

    for player_name in data["players"]:
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

    return make_response({"result": "Success"}, 201)


#FIXME: Unimplemented
# Retrieve ALL player information such as Games played, wins, overall roll frequency etc.
@api_bp.route('/player/<username>', methods=["POST"])
def get_player_info(username):
    db = get_db()


    # Get all games played
    res = db.session.execute(select(Player).where(Player.first_name == username)).one_or_none()

    payload = {"result" : "player not found"}
   
    if not res:
        return make_response(payload, 404)
    
    payload["result"] = "success"
    

    for player in res:
        payload["player_data"] = player.to_json()
  
    

    return make_response(payload, 203)

@api_bp.route('/player/<game_id>/<player>', methods=["POST"])
def get_player(game_id, player):
    payload = dict()

    db = get_db()

    player_rolls = db.session.execute(
        select(*ModelUtils.allCounts())
        .where(
            game_player.c.player_id == select(Player.player_id).where(Player.first_name == player).scalar_subquery()
        )
        .where(game_player.c.game_id == game_id)
    ).one_or_none()
    if not player_rolls:
        return make_response({"result": "player not found"}, 404)
    
    for key, val in zip(ModelUtils.CountColumnNames(), player_rolls):
        payload[key] = val 

    return make_response({"result": "Success", "data" : payload}, 201)

# Get player roll information for current game
@api_bp.route('/player/current-game/<player>', methods=["POST"])
def get_player_rolls(player):
    db = get_db()

    player_rolls = db.session.execute(
        select(game_player)
        .where(
            game_player.c.player_id == select(Player.player_id).where(Player.first_name == player).scalar_subquery()
        )
        .where(
            game_player.c.game_id == select(Game.game_id).order_by(Game.game_id.desc()).scalar_subquery()
        )
    ).mappings().first()

    # Return default value if player does not have any rolls
    if not player_rolls:
        return dict(zip( (i for i in range(2,13)), (0 for _ in range(2,13))))
    # Return player rolls for current game
    rolls = {}
    for key,val in zip(player_rolls.keys(), player_rolls.values()):
        if(key != "player_id" and key != "game_id"):
            key = key.split('_')[-1]
            rolls[key] = val

    return rolls
    
