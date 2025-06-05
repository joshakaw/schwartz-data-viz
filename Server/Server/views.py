"""
Routes and views for
the Flask application.
"""

from Server.dtos.dtos import (
    ApiPaginatedRequest,
    MailchimpUsersRequestDTO,
    SignupsByCategoryRequestDTO,
)
from flask import Blueprint, jsonify, request
import pandas as pd
from Server import db

from json import loads

from Server.queries.sql_helper import read_sql_from_queries
from Server.queries.sql_templates import qMailchimpUsers, qSignupsByCategory

# Defines the API blueprint to be applied to the app
main_api = Blueprint("main", __name__)


@main_api.route("/sql")
def sqlTest():
    """
    TEST
    """
    c = db.get_db_cursor()
    query = read_sql_from_queries("signupsByCategory")

    print(query)
    c.execute(query)

    return str(c.fetchall())


@main_api.route("/signupDashboard/signupsByCategory")
def signupsByCategory():
    # Get request
    dto = SignupsByCategoryRequestDTO(**request.get_json())

    # Create query
    query = qSignupsByCategory(dto.startDate, dto.endDate, dto.signupMethodCategories)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query)

    # Transform
    data = c.fetchall()  # Returns 2d tuple
    pdData = pd.DataFrame(data, columns=["category", "signups"])

    return jsonify(loads(pdData.to_json(orient="records")))


@main_api.route("/mailchimpDashboard/users")
def mailchimpUsers():
    # TODO: Implement filtering

    # Get request
    dto = ApiPaginatedRequest[MailchimpUsersRequestDTO](**request.get_json())

    print(dto.pageIndex)
    print(dto.filter.startDate)  # Works!

    # Create query
    query = qMailchimpUsers(dto)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query)

    # Transform
    data = c.fetchall()  # Returns 2d tuple
    pdData = pd.DataFrame(
        data,
        columns=[
            "studentId",
            "firstName",
            "lastName",
            "email",
            "phone",
            "tutor",
            "parentAccount",
            "createdAt",
            "school",
            "numSessions",
            "mostRecentSession",
            "mostRecentSubject",
        ],
    )

    return jsonify(
        loads(pdData.to_json(orient="records"))
    )  # TODO: Is this expected format by client?


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