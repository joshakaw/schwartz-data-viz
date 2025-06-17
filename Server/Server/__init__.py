"""
Initializes the application
from the main_blueprint;
initializes DB
"""

from flask import Flask
from Server import db


def create_app():
    app = Flask(__name__)

    # Initialize the DB
    with app.app_context():
        db.init_db(app)

    from Server.views import (
        main_api as main_blueprint,
    )  # Import the Blueprint from views.py

    app.register_blueprint(main_blueprint)

    return app
