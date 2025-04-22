from sqlalchemy import Column, Integer, String
from app import db

from .utils import ModelUtils

class Player(db.Model):
    """
    Player Table
    """
    player_id = Column(Integer, primary_key=True)
    first_name = Column(String(20), unique=True)

    games_played = db.relationship('Game', secondary="game_player", backref="players")

    def __repr__(self):
        return f"{self.first_name}"
    
    
    
    def get_score(self):
        return ModelUtils.total_score(self.player_id)

    def to_json(self):
        return {"id" : self.player_id, "name": self.first_name, "games_played" : [game.to_json() for game in self.games_played], "total_score" : self.get_score()}


