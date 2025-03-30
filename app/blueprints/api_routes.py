from flask import Blueprint, make_response, request
api_bp = Blueprint('api', __name__)

@api_bp.route('/api-home')
def api_home():
    return make_response({"result": "Welcome"}, 200)

@api_bp.route('/submit', methods=['POST'])
def submit():
    data = request.json

    print(data)

    return make_response({"result": "nice!"}, 201)