import peewee
from app import app
from settings import DEBUG
from models import db, Marker

db.connect()

try:
    db.create_tables([Marker, ])
except peewee.OperationalError:
    pass


if __name__ == '__main__':
    app.run(debug=DEBUG, use_reloader=DEBUG)
