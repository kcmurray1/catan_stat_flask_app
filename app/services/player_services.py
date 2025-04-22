from sqlalchemy import select
from app.utils.db_utils import get_db
from app.models import Player, game_player
from app.models.utils import ModelUtils
IGNORED_COLUMNS = frozenset(["game_id", "player_id", "score"])


class PlayerServices():
    def get_rolls(player_id, game_id) -> dict:
         # retrieve roll counts
        db = get_db()
        player_stats = db.session.execute(
            select(*ModelUtils.allCounts())
            .where(game_player.c.player_id == player_id)
            .where(game_player.c.game_id == game_id)
        ).mappings().first()

        # no rolls were recorded
        if not player_stats:
            return  {key.split("_")[-1] : 0 for key in game_player.c.keys() if key not in IGNORED_COLUMNS}
   
    
        return {key.split("_")[-1] : player_stats[key] for key in player_stats.keys()}
    
    def get_player(username):
        db = get_db()
        return db.session.scalar(select(Player).where(Player.first_name == username))