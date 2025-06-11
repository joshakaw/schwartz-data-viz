"""
Database connection functions
for Flask application context
"""

from json import loads
from typing import Any, List, Tuple, TypeAlias
import MySQLdb
from MySQLdb.cursors import Cursor
from flask import g, current_app

# https://mysqlclient.readthedocs.io/user_guide.html#installation

def init_db(app):
    """
    Sets up Flask so the close_db() function
    is called at the end of response handler.
    """

    current_app.teardown_appcontext(close_db)

def get_db_cursor() -> Cursor:
    if "db" not in g:

        dbSettingsJson = loads(open("./Server/util/dbconfig.json", encoding="utf-8").read())

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

# Helper methods

def get_column_names(cursor: Cursor) -> List[str]:
    """
    Gets the column names from
    the cursor.
    """
    MySQLDescriptionObject : TypeAlias = Tuple[str, Any, None, None, None, None, Any, Any]
    MySQLDescriptionType : TypeAlias = List[MySQLDescriptionObject]

    # https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-description.html

    def extract_column_names(obj: MySQLDescriptionObject) -> str:
        return obj[0] # Returns the column name

    description: MySQLDescriptionType = cursor.description
    return list(map(extract_column_names,description))