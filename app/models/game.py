from sqlalchemy import Column, Integer, func, DateTime
from app import db
from .association import game_player
from datetime import datetime

class Game(db.Model):
    game_id = Column(Integer, primary_key=True)
    date = Column(DateTime(timezone=True), default=func.now())


    def __repr__(self):
        return f'<Game: {self.date}>'
    
    def to_json(self):
        return {"date": self.date.strftime("%m/%d/%Y"), "id" : self.game_id}
    
   