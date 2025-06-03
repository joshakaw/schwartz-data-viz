"""
Routes and views for 
the Flask application.
"""

from flask import Blueprint, jsonify
import pandas as pd
from Server import db
import os

from json import loads

from Server.queries.sql_helper import read_sql_from_queries

# Defines the API blueprint to be applied to the app
main_api = Blueprint("main", __name__)

@main_api.route("/sql")
def sqlTest():
    """
    TEST
    """
    c = db.get_db_cursor()
    query =  read_sql_from_queries("signupsByCategory")

    print(query)
    c.execute(query)

    return str(c.fetchall())

@main_api.route("/signupDashboard/signupsByCategory")
def signupsByCategory():
    c = db.get_db_cursor()
    query =  read_sql_from_queries("signupsByCategory")

    c.execute(query)
    data = c.fetchall() # Returns 2d tuple
    pdData = pd.DataFrame(data, columns=['category', 'signups'])

    # pdSignupData = pd.DataFrame(
    #     {
    #         "category": [
    #             "Social Media",
    #             "Physical Ads",
    #             "Friend Referral",
    #             "Email Campaign",
    #         ],
    #         "signups": [15, 10, 8, 12],
    #     }
    # )

    return jsonify(loads(pdData.to_json(orient="records")))


@main_api.route("/mailchimpDashboard/users")
def mailchimpUsers():
    current_dir = os.getcwd()
    print(current_dir)

    jsonTextAccountData = open("./Server/util/mailchimpUsers.json").read()

    jsonAccountData = loads(jsonTextAccountData)
    pdAccountData = pd.json_normalize(jsonAccountData)

    return jsonify(loads(pdAccountData.to_json(orient="records")))


@main_api.route("/dataTest")
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