"""
Database connection functions
for Flask application context
"""

from json import loads
import MySQLdb
from flask import g, current_app

# https://mysqlclient.readthedocs.io/user_guide.html#installation

def init_db(app):
    """
    Sets up Flask so the close_db() function
    is called at the end of response handler.
    """

    current_app.teardown_appcontext(close_db)

def get_db_cursor():
    if "db" not in g:

        dbSettingsJson = loads(open("./Server/util/dbconfig.json").read())

        g.db = MySQLdb.connect(
            host=dbSettingsJson["endpoint"],
            user=dbSettingsJson["username"],
            password=dbSettingsJson["password"],
            database=dbSettingsJson["database"],
            port=dbSettingsJson["port"],
        )
    return g.db.cursor()

def close_db(exception):
    db = g.pop('db', None)

    if db is not None:
        db.close()