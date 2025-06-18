"""
Routes and views for
the Flask application.
"""

from copy import copy
from typing import Any, List
from MySQLdb.cursors import Cursor
from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
    SignupsByCategoryRequestDTO,
)
from flask import Blueprint, jsonify, request
import pandas as pd
from Server import db

from json import loads

from Server.queries.sql_helper import read_sql_from_queries
from Server.queries.sql_templates import (
    qDetailedSignups,
    qMailchimpUsers,
    qSignupsByCategory,
    qSignupsLineChart,
    qSignupsSummaryBox,
)

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


@main_api.route("/detailedSignupsDashboard/table")
def detailedSignupsTable():
    # Get request
    dto = DetailedSignupRequestDTO(**request.args.to_dict(flat=False))

    # Create query and params
    (params, query) = qDetailedSignups(dto)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query, params)

    # Transform
    data = c.fetchall()  # Returns 2d tuple
    pdData = pd.DataFrame(data, columns=db.get_column_names(c))

    return jsonify(loads(pdData.to_json(orient="records")))


@main_api.route("/signupDashboard/lineChart")
def signupsLineChart():
    # Get request
    dto = SignupLineChartRequestDTO(**request.args.to_dict(flat=False))

    # Create query
    (params, query) = qSignupsLineChart(dto)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query, params)

    # Transform
    data = c.fetchall()  # Returns 2d tuple
    pdData = pd.DataFrame(data, columns=db.get_column_names(c))

    return jsonify(loads(pdData.to_json(orient="records")))

    # sampleData = [
    #     {
    #         "date": "2024-06-01",
    #         "signupMethodCategory": "Friend Referral",
    #         "numberOfSignups": 25,
    #     },
    #     {
    #         "date": "2024-06-01",
    #         "signupMethodCategory": "Physical Advertising",
    #         "numberOfSignups": 60,
    #     },
    #     {
    #         "date": "2024-06-08",
    #         "signupMethodCategory": "Friend Referral",
    #         "numberOfSignups": 19,
    #     },
    #     {
    #         "date": "2024-06-08",
    #         "signupMethodCategory": "Physical Advertising",
    #         "numberOfSignups": 40,
    #     },
    # ]

    # pdSampleData = pd.DataFrame(sampleData)
    # return jsonify(loads(pdSampleData.to_json(orient="records")))


@main_api.route("/signupDashboard/summaryBox")
def signupsSummaryBox():
    # Get request
    dto = SignupSummaryBoxRequestDTO(**request.args.to_dict(flat=False))

    # Create query
    (params, query) = qSignupsSummaryBox(dto)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query, params)

    # Transform
    data = c.fetchall()  # Returns 2d tuple
    pdData = pd.DataFrame(data, columns=db.get_column_names(c))

    return jsonify(loads(pdData.to_json(orient="records")))

    # sampleData = {"signnupCount": 69}
    # # pdSampleData = pd.DataFrame(sampleData)
    # return jsonify(sampleData)


@main_api.route("/signupDashboard/signupsByCategory")
def signupsByCategory():
    # Get request
    dto = SignupsByCategoryRequestDTO(**request.args.to_dict(flat=False))
    # dto = SignupsByCategoryRequestDTO(**request.get_json())

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
    dto = MailchimpUsersRequestDTO(**request.args.to_dict(flat=False))
    # dto = ApiPaginatedRequest[MailchimpUsersRequestDTO](**request.json)

    print(dto.pageIndex)
    print(dto.startDate)  # Works!

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

    # Create count query
    cloneDto = copy(dto)
    cloneDto.pageSize = None
    cloneDto.pageIndex = None

    countQuery = f"select count(*) from ({qMailchimpUsers(cloneDto)}) as a"

    # Get count
    c.execute(countQuery)
    number = c.fetchall()

    paginatedRepsonse = {
        "pageIndex": dto.pageIndex[0],
        "pageSize": dto.pageSize[0],
        "totalItems": number[0][0],
        "data": loads(pdData.to_json(orient="records")),
    }

    return jsonify(paginatedRepsonse)


@main_api.route("/params")
def paramsTest():
    # Create query
    prefilledQuery = (
        "select * from user_t where firstName like 'Ro%' and id > 300 limit 10;"
    )
    query = "select * from user_t where firstName like %s and id > %s limit 10;"
    params: List[Any] = ["%Ar%", 100]

    # Execute query
    c = db.get_db_cursor()
    c.execute(query, params)
    print(f"Query: {c.mogrify(query, params)}")
    # Transform
    data = c.fetchall()
    pdData = pd.DataFrame(data, columns=db.get_column_names(c))

    return jsonify(loads(pdData.to_json(orient="records")))


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
