"""
This script runs the Server application 
using a development server.
"""

from os import environ

from Server import create_app
from flask_cors import CORS

# https://mysqlclient.readthedocs.io/user_guide.html#installation
# https://pypika.readthedocs.io/en/latest/

if __name__ == "__main__":
    HOST = environ.get("SERVER_HOST", "localhost")
    PORT = 5555

    app = create_app()
    CORS(app)  # Allows for requests to be accepted by React

    app.run(host=HOST, port=PORT, debug=True)
