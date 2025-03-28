from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError, PendingRollbackError



def get_db() -> SQLAlchemy:
    return current_app.extensions['sqlalchemy']

def add_db_item(item):
    db = get_db()
    # https://stackoverflow.com/questions/52075642/how-to-handle-unique-data-in-sqlalchemy-flask-python
    try:
        db.session.add(item)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
