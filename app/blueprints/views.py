from flask import Blueprint, make_response, render_template, redirect, url_for
"""Display informatio for user"""
view_bp = Blueprint('/',__name__,  url_prefix='/')

@view_bp.route('/')
def view_home():
    return render_template("index.html")

@view_bp.route('/stats')
def stats():
    # NOTE: redirect to another template follows <name>.<function_name>
    return redirect(url_for("api.api_home"))