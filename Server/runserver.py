"""
This script runs the Server application 
using a development server.
"""

from json import loads
from os import environ

from Server import create_app
from flask_cors import CORS

# https://mysqlclient.readthedocs.io/user_guide.html#installation
from MySQLdb import _mysql
# https://pypika.readthedocs.io/en/latest/
from pypika import MySQLQuery, Table, functions

dbSettingsJson = loads(open("./Server/util/dbconfig.json").read())

userT: Table = Table('user')
q = MySQLQuery.from_(userT).select(functions.Count('*')).where(userT.id > 200)

db = _mysql.connect(
    host=dbSettingsJson['endpoint'],
    user=dbSettingsJson['username'],
    password=dbSettingsJson['password'],
    database=dbSettingsJson['database'],
    port=dbSettingsJson['port']
)

db.query(str(q))
result = db.store_result()

print(result.fetch_row())

if __name__ == "__main__":
    HOST = environ.get("SERVER_HOST", "localhost")
    PORT = 5555

    app = create_app()
    CORS(app)  # Allows for requests to be accepted by React

    app.run(host=HOST, port=PORT, debug=True)
