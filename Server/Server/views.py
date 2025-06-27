"""
Routes and views for
the Flask application.
"""

from collections import defaultdict
from copy import copy
from typing import Any, List
from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
    SignupsByCategoryRequestDTO,
)
from flask import Blueprint, jsonify, request
from Server import db

from json import loads

from Server.queries.sql_helper import read_sql_from_queries
from Server.queries.sql_templates import (
    qDetailedSignups,
    qMailchimpUsers,
    qSchoolTypes,
    qSignupsByCategory,
    qSignupsLineChart,
    qSignupsSummaryBox,
    qSchoolsNameType,
)

# Defines the API blueprint to be applied to the app
main_api = Blueprint("main", __name__)


def rows_to_dicts(rows, columns):
    """
    Convert list of tuples and column names to list of dicts.

    Args:
        rows (list of tuple): Query result rows.
        columns (list of str): Column names.

    Returns:
        list of dict: Each dict maps column name to value.
    """
    return [dict(zip(columns, row)) for row in rows]


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

    return jsonify(rows_to_dicts(data, columns=db.get_column_names(c)))


@main_api.route("/signupDashboard/lineChart")
def signupsLineChart():
    import pandas as pd

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
    pivoted = (
        pdData.pivot_table(
            columns="signupMethodCategory",
            index=["date"],
            values="numberOfSignups",
            aggfunc="sum",
        )
        .fillna(0)
        .reset_index()
    )

    # Build data series for each signup method
    series_by_category = defaultdict(list)

    for row in pivoted.to_dict(orient="records"):
        for category, value in row.items():
            if category == "date":
                continue
            series_by_category[category].append(
                {"x": row["date"].isoformat(), "y": int(value)}
            )

    # Convert to desired format: list of { name, data } series
    chart_data = [
        {"signupMethodCategory": category, "data": points}
        for category, points in series_by_category.items()
    ]

    return jsonify(chart_data)

    # return jsonify(loads(pivoted.to_json(orient="records")))

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

    return jsonify(rows_to_dicts(data, columns=db.get_column_names(c)))

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

    return jsonify(rows_to_dicts(data, columns=["category", "signups"]))


@main_api.route("/mailchimpDashboard/users")
def mailchimpUsers():
    # Get request
    dto = MailchimpUsersRequestDTO(**request.args.to_dict(flat=False))

    # Create query
    query = qMailchimpUsers(dto)

    # Execute query
    c = db.get_db_cursor()
    c.execute(query)

    # Transform
    data = c.fetchall()  # Returns 2d tuple

    # Create count query
    cloneDto = copy(dto)
    cloneDto.pageSize = None
    cloneDto.pageIndex = None

    countQuery = f"select count(*) from ({qMailchimpUsers(cloneDto)}) as a"

    # Get count
    c.execute(countQuery)
    number = c.fetchall()

    pageData = rows_to_dicts(
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

    if dto.limit:
        cutoffAtRecordNumber = dto.limit
        numberOfItemsOnPage = cutoffAtRecordNumber - (
            dto.pageIndex[0] + dto.pageSize[0]
        )
        if numberOfItemsOnPage < 0:
            numberOfItemsOnPage = 0
        if numberOfItemsOnPage > dto.pageSize[0]:
            numberOfItemsOnPage = dto.pageSize[0]

        pageData = pageData[:numberOfItemsOnPage]

    # Minimum of actual total records available, or records available w/ row limit
    totalItemsAvailable = min(number[0][0], dto.limit if dto.limit else number[0][0])

    print(f"Number of items in data is {len(pageData)}.")
    print(
        f"[Index: {dto.pageIndex[0]}; Page Size: {dto.pageSize[0]}; totalItems: {totalItemsAvailable}]"
    )

    paginatedRepsonse = {
        "pageIndex": dto.pageIndex[0],
        "pageSize": dto.pageSize[0],
        "totalItems": totalItemsAvailable,
        "data": pageData,
    }

    return jsonify(paginatedRepsonse)


@main_api.route("/educationLevelSchools")
def educationLevelSchools():
    # Create query
    query = qSchoolsNameType()
    query2 = qSchoolTypes()  # School types

    # Execute first query
    c = db.get_db_cursor()
    c.execute(query)
    data = c.fetchall()
    schoolNamesDict = rows_to_dicts(data, db.get_column_names(c))

    # Execute second query
    c.execute(query2)
    data2 = c.fetchall()
    schoolTypesDict = rows_to_dicts(data2, db.get_column_names(c))

    return jsonify(
        {
            "schoolNames": schoolNamesDict,
            "schoolTypes": schoolTypesDict,
        }
    )


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
    dictData = rows_to_dicts(data, columns=db.get_column_names(c))

    return jsonify(dictData)


@main_api.route("/dataTest")
def dataTest():
    import pandas as pd

    pdTeamMembers = pd.DataFrame({"name": ["josh", "owen", "tyler", "tarik"]})

    capitalized = pdTeamMembers[
        "name"
    ].str.capitalize()  # Now all names should be capitalized

    response = jsonify(loads(capitalized.to_json(orient="records")))
    return response
