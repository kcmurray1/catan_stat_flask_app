from app import db
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.sql import func

""" 
Association table for Game and Player
Each Game can have many players 
Each Player can play many DISTINCT games
"""
game_player = db.Table(
    "game_player",
    Column('player_id', Integer, ForeignKey('player.player_id')),
    Column('game_id', Integer, ForeignKey('game.game_id')),
    Column('score', Integer, default=0),
    Column('roll_count_2', Integer, default=0),
    Column('roll_count_3', Integer, default=0),
    Column('roll_count_4', Integer, default=0),
    Column('roll_count_5', Integer, default=0),
    Column('roll_count_6', Integer, default=0),
    Column('roll_count_7', Integer, default=0),
    Column('roll_count_8', Integer, default=0),
    Column('roll_count_9', Integer, default=0),
    Column('roll_count_10', Integer, default=0),
    Column('roll_count_11', Integer, default=0),
    Column('roll_count_12', Integer, default=0),
    UniqueConstraint('player_id', 'game_id', name='unique_game_player')

)



class Player(db.Model):
    player_id = Column(Integer, primary_key=True)
    first_name = Column(String(20), unique=True)

    games_played = db.relationship('Game', secondary="game_player", backref="players")

    def __repr__(self):
        return f"{self.first_name}"
    
    def to_json(self):
        return {"id" : self.player_id, "name": self.first_name, "games_played" : [game.to_json() for game in self.games_played]}




class Game(db.Model):
    game_id = Column(Integer, primary_key=True)
    date = Column(DateTime(timezone=True), default=func.now())

    def __repr__(self):
        return f'<Game: {self.date}>'
    
    def to_json(self):
        return {"date": self.date, "id" : self.game_id}


class ModelUtils:
    def CountColumnNames(column_name=None):
        return [column_name if column_name else i for i in range(2,13)]
    
    def game_player_columns():
        x =  [i for i in range(2,13)] + ["score"]
        print(x)
        return [i for i in range(2,13)] + ["score"]
    
    def allCounts():
        return [game_player.c[f"roll_count_{i}"] for i in range(2,13)]
    