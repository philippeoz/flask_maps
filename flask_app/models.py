from peewee import *
from settings import DATABASE_URL

db = SqliteDatabase(DATABASE_URL)


class BaseModel(Model):
    class Meta:
        database = db


class Marker(BaseModel):
    lt = CharField()
    lg = CharField()
    base64 = TextField(null=True, default=None)
    address = TextField(null=True, default=None)