"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import jsonify, render_template
import pandas as pd
from Server import app
import os

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

    capitalized = pdTeamMembers[
        "name"
    ].str.capitalize()  # Now all names should be capitalized

    response = jsonify(loads(capitalized.to_json(orient="records")))
    return response


@app.route("/signupDashboard/signupsByCategory")
def signupsByCategory():

    pdSignupData = pd.DataFrame(
        {
            "category": [
                "Social Media",
                "Physical Ads",
                "Friend Referral",
                "Email Campaign",
            ],
            "signups": [15, 10, 8, 12],
        }
    )

    return jsonify(loads(pdSignupData.to_json(orient="records")))


@app.route("/mailchimpDashboard/users")
def mailchimpUsers():
    current_dir = os.getcwd()
    print(current_dir)

    jsonTextAccountData = open("./Server/util/mailchimpUsers.json").read()

    jsonAccountData = loads(jsonTextAccountData)
    pdAccountData = pd.json_normalize(jsonAccountData)

    return jsonify(loads(pdAccountData.to_json(orient="records")))


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
