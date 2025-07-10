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
    TutorLeaderboardRequestDTO,
)
from flask import Blueprint, jsonify, request
from Server import db

from json import loads

from Server.queries.sql_helper import read_sql_from_queries
from Server.queries.sql_queries import (
    DetailedSignupsQ,
    MailchimpUsersQ,
    SchoolTypesQ,
    SchoolsNameAndTypeQ,
    SignupsByCategoryQ,
    SignupsLineChartQ,
    SignupsSummaryBoxQ,
    TutorLeaderboardQ,
    makeEngine,
)
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

# Start the SQLAlchemy engine
makeEngine()


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

    # Get result
    (result, sql) = DetailedSignupsQ(dto)

    return jsonify(result)


@main_api.route("/signupDashboard/lineChart")
def signupsLineChart():
    import pandas as pd

    # Get request
    dto = SignupLineChartRequestDTO(**request.args.to_dict(flat=False))

    # Run query
    (result, sql) = SignupsLineChartQ(dto)

    pdData = pd.DataFrame(result)
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
            series_by_category[category].append({"x": row["date"], "y": int(value)})

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

    # Get query result
    (result, sql) = SignupsSummaryBoxQ(dto)

    return jsonify(result)


@main_api.route("/signupDashboard/signupsByCategory")
def signupsByCategory():
    # Get request
    dto = SignupsByCategoryRequestDTO(**request.args.to_dict(flat=False))

    # Run query
    (result, sql) = SignupsByCategoryQ(dto.startDate, dto.endDate, dto.signupMethodCategories)

    return jsonify(result)


@main_api.route("/mailchimpDashboard/users")
def mailchimpUsers():
    # Get request
    dto = MailchimpUsersRequestDTO(**request.args.to_dict(flat=False))

    # Get query result
    (data, sql) = MailchimpUsersQ(dto)

    # Create count query
    cloneDto = copy(dto)
    cloneDto.pageSize = None
    cloneDto.pageIndex = None

    (counterResult, counterSql) = MailchimpUsersQ(cloneDto)
    number = len(counterResult)

    pageData = data
    print(f"Page Data: {pageData}")

    if dto.limit:
        # Remember that pageIndex is the page number, 
        # not the index of the first record.
        offset = dto.pageIndex[0] * dto.pageSize[0]
        remaining = dto.limit - offset
        numberOfItemsOnPage = min(max(remaining, 0), dto.pageSize[0])

        pageData = pageData[:numberOfItemsOnPage]

        print(numberOfItemsOnPage)

        pageData = pageData[:numberOfItemsOnPage]

    # Minimum of actual total records available, or records available w/ row limit
    totalItemsAvailable = min(number, dto.limit if dto.limit else number)

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
    # Execute first query
    schoolNamesDict = SchoolsNameAndTypeQ()

    # Execute second query
    schoolTypesDict = SchoolTypesQ()

    return jsonify(
        {
            "schoolNames": schoolNamesDict,
            "schoolTypes": schoolTypesDict,
        }
    )

@main_api.route("/tutorData/leaderboard")
def tutor_data_leaderboard():
    # Get request
    dto = TutorLeaderboardRequestDTO(**request.args.to_dict(flat=False))

    # Run query
    (result, query) = TutorLeaderboardQ(dto)

    # Return result
    return jsonify(result)


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
