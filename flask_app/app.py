from flask import Flask
from base import base_blueprint
from flask_wtf.csrf import CSRFProtect


app = Flask("flask_app")
app.config.from_object('settings')
csrf = CSRFProtect(app)
app.register_blueprint(base_blueprint)