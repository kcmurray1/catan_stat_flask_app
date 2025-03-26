from app import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

class Player(db.Model):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(20), unique=True)

    def __init__(self, first_name):
        self.first_name = first_name

    def __repr__(self):
        return f"{self.first_name}"


    

class Game(db.Model):
    id = Column(Integer, primary_key=True)
    date = Column(DateTime(timezone=True), default=func.now())
    # foreign key
    winner_id = Column(Integer, ForeignKey("player.id"))

