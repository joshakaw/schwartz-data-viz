"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import jsonify, render_template
import pandas as pd
from Server import app
from json import loads, dumps

"""
Test endpoint for React app
to display

GET /dataTest
"""


@app.route("/dataTest")
def dataTest():
    teamMembers = [
        {"name": "josh"},
        {"name": "owen"},
        {"name": "tyler"},
        {"name": "tarik"},
    ]

    pdTeamMembers = pd.DataFrame({"name": ["josh", "owen", "tyler", "tarik"]})

    capitalized = pdTeamMembers["name"].str.capitalize() # Now all names should be capitalized

    response = jsonify(loads(capitalized.to_json(orient="records")))
    return response

@app.route("/signupDashboard/signupsByCategory")
def signupsByCategory():

    return "Not implemented"

@app.route("/mailchimpDashboard/users")
def mailchimpUsers():
    return "Not implemented"


@app.route("/")
@app.route("/home")
def home():
    """Renders the home page."""
    return render_template(
        "index.html",
        title="Home Page",
        year=datetime.now().year,
    )


@app.route("/contact")
def contact():
    """Renders the contact page."""
    return render_template(
        "contact.html",
        title="Contact",
        year=datetime.now().year,
        message="Your contact page.",
    )


@app.route("/about")
def about():
    """Renders the about page."""
    return render_template(
        "about.html",
        title="About",
        year=datetime.now().year,
        message="Your application description page.",
    )
