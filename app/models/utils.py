from app import db
from sqlalchemy import func, select
from .association import game_player

class ModelUtils:

    def total_score(player_id):
        total_score = db.session.scalar(
        select(func.sum(game_player.c.score))
        .where(game_player.c.player_id == player_id)
        )
        if not total_score:
            return 0
        return total_score
    
        
    def CountColumnNames(column_name=None):
        return [column_name if column_name else i for i in range(2,13)]
    
    def game_player_columns():
        x =  [i for i in range(2,13)] + ["score"]
        print(x)
        return [i for i in range(2,13)] + ["score"]
    
    def allCounts():
        return [game_player.c[f"roll_count_{i}"] for i in range(2,13)]
    

    