from flask import Flask, current_app
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import Integer, ForeignKey, Column, String, UniqueConstraint, update, select, join

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

user_channel = db.Table('user_channel',
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('channel_id', Integer, ForeignKey('channel.id')),
    Column('roll_count_2', Integer),
    Column('roll_count_3', Integer),
    Column('roll_count_4', Integer),
    Column('roll_count_5', Integer),
    Column('roll_count_6', Integer),
    Column('roll_count_7', Integer),
    Column('roll_count_8', Integer),
    Column('roll_count_9', Integer),
    Column('roll_count_10', Integer),
    Column('roll_count_11', Integer),
    Column('roll_count_12', Integer),
    UniqueConstraint('user_id', 'channel_id', name='unique_user_channel')

)



class User(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String(20))
    following = db.relationship('Channel', secondary="user_channel", backref='followers')

    def __repr__(self):
        return f'<User: {self.name}>'

class Channel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))

    def __repr__(self):
        return f'<Channel: {self.name}>'
    
def add():
    anthony = db.get_or_404(User, 1)
    pp = db.session.scalars(db.select(Channel).where(Channel.name == "beast")).first()
    
    anthony.following.append(pp)
    db.session.commit()

def updateScore():
    name_to_find = "Anthon"
    anthony_game = db.session.scalars(
        db.select(user_channel)
        .where(
            user_channel.c.user_id == db.session.scalars(db.select(User).where(User.name == name_to_find)).first().id
        )
    ).first()

    print(anthony_game)


def build():
    db.create_all()
    anthony = User(name='Anthon')
    erin = User(name='erin')

    pp = Channel(name='pp')

    beast = Channel(name='beast')

    db.session.add_all([anthony, erin, pp, beast])

    db.session.commit()

if __name__ == "__main__":
    with app.app_context():
        # add()
        # updateScore()
        # build()
        db.session.execute(update(user_channel).where(
            user_channel.c.user_id == 
            select(User.id).where(User.name == "Anthon").scalar_subquery()
            ).values(
                {f"roll_count_{2}": 33}
            )
        )

        db.session.commit()
        idk = db.session.execute(db.select(user_channel))

        print(idk.all())
        

        # print(idk)
        # idk = db.session.execute(db.select(user_channel).where(user_channel.channel_id == 1))
        # idk = db.session.scalars(db.select(Channel))

        # https://stackoverflow.com/questions/75727550/what-is-the-proper-way-to-query-in-flask-sqlalchemy-3-0

        # pp = db.session.scalars(db.select(Channel).where(Channel.name == "pp")).first()

        # anthony.following.append(pp)
        # print(pp.name)
        # for item in anthony.following:
        #     print(item)

        # for channel in idk:
            # print(channel.name ,channel.followers)
        # db.session.commit()
       