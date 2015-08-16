from flask import Flask
from flask.ext.mail import Mail

from config import config

mail = Mail()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    mail.init_app(app)

    # attach routes and custom error pages here
    # from .main import main as main_blueprint
    # app.register_blueprint(main_blueprint)
    # from app import views
    return app
