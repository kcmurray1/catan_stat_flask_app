from flask import Blueprint, make_response, request
import random
api_bp = Blueprint('api', __name__)

@api_bp.route('/api-home')
def api_home():
    return make_response({"result": "Welcome"}, 200)

# update database with roll for player
@api_bp.route('/submit-roll/<ID>', methods=['POST'])
def submit(ID):
    data = request.json

    print(data, ID)

    return make_response({"result": "nice!"}, 201)


# Retrieve player information such as 
# roll count
@api_bp.route('/player/<ID>', methods=["POST"])
def get_player_info(ID):
    print(ID)
    test = {}
    for i in range(2, 13):
        test[i] = random.randint(1,10)
    return test