from flask import Blueprint, make_response

api_bp = Blueprint('api', __name__)

@api_bp.route('/api-home')
def api_home():
    return make_response({"result": "Welcome"}, 200)