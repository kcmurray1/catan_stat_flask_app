from sqlalchemy import select, update, func, desc
from app.utils.db_utils import get_db
from app.models import Player, Game, game_player

class GameService:
    """
    Collection of functions used to interact with the Game and Game Associated 
    tables
    """
    def create_game(players):
        db = get_db()

        # Create new Game Object
        new_game = Game()
        info_to_add = [new_game]

        for player_name in players:
            # check if player already exists
            new_player = db.session.scalar(select(Player).where(Player.first_name == player_name))
            if not new_player:
                # Create a new Player
                new_player = Player(first_name=player_name)
                info_to_add.append(new_player)
            # Add player to this game
            new_player.games_played.append(new_game)

        # save to DB
        db.session.add_all(info_to_add)
        db.session.commit()

        return new_game.game_id

    def add_game_roll(username, roll):
        
        db = get_db()

        roll_column = f"roll_count_{roll}"

        # update roll for game_player entry
        db.session.execute(
            update(game_player)
            .where(
                game_player.c.player_id == select(Player.player_id).where(Player.first_name == username).scalar_subquery()
            )
            .where(
                game_player.c.game_id == select(Game.game_id).order_by(Game.date.desc()).scalar_subquery()
            )
            .values(
                {roll_column: game_player.c[roll_column] + 1}
            )
        )

        db.session.commit()
    
    def update_scores(game_id, username, score):
        print(type(score))
        db = get_db()

        db.session.execute(
            update(game_player)
            .where(
                game_player.c.game_id == game_id
            )
            .where(
                game_player.c.player_id == select(Player.player_id).where(Player.first_name == username).scalar_subquery()
            )
            .values(
                {"score": int(score)}
            )
        )

        db.session.commit()
    
    def game_details(game_id):
        db = get_db()

        # individual statements to sum columns roll_count_2, roll_count_3...roll_count_12
        individual_sums = [func.sum(game_player.c[f"roll_count_{i}"]) for i in range(2,13)]

        
        total_roll_counts = db.session.execute(
            select(*individual_sums)
            .where(game_player.c.game_id == game_id)
            .where(game_player.c.player_id == Player.player_id)
        ).one()

        # get the rolls, score, and name of the players in the game
        game_data = db.session.execute(
            select(game_player, Player.first_name)
            .where(game_player.c.game_id == game_id)
            .where(game_player.c.player_id == Player.player_id)
        ).mappings()

        # Adjust naming of columns(change roll_count_2 to 2, roll_count_3 to 3..etc)
        formatted_roll_counts = dict()
        
        column_names = [i for i in range(2, 13)]

        for key, val in zip(column_names, total_roll_counts):
            formatted_roll_counts[key] = val 

        return formatted_roll_counts
    
    def get_winner(game_id) -> Player:
        """Return Player that had greatest score for a game"""
        return get_db().session.scalar(
        select(
            Player,
            func.sum(game_player.c.score).label("total_score")
        )
        .join(game_player, Player.player_id == game_player.c.player_id)
        .group_by(Player.player_id, Player.first_name)
        .where(game_player.c.game_id == game_id)
        .order_by(desc("total_score"))
        )

         
