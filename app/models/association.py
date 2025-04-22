from app import db

from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint, select, update
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
