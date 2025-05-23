"""
This script runs the Server application using a development server.
"""

from os import environ
from Server import app
from flask_cors import CORS

if __name__ == "__main__":
    HOST = environ.get("SERVER_HOST", "localhost")
    PORT = 5555
    # try:
    #     PORT = int(environ.get('SERVER_PORT', '5555'))
    # except ValueError:
    #     PORT = 5555

    CORS(app)  # Allows for requests to be accepted by React
    app.run(host=HOST, port=PORT)
