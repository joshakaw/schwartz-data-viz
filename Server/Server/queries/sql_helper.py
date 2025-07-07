"""
Helper functions to deal with
SQL strings
"""

import os

from flask import current_app
from sqlalchemy import literal_column
from sqlalchemy.sql.elements import ColumnClause

def get_first_sunday_of_week(u, dialect_name) -> ColumnClause:
    if dialect_name == "mysql":
        return literal_column(
            f"DATE(DATE_SUB(DATE({u.c.createdAt.key}), INTERVAL DAYOFWEEK({u.c.createdAt.key}) - 1 DAY))"
        )
    elif dialect_name == "sqlite":
        return literal_column(
            f"DATE({u.c.createdAt.key}, 'weekday 0', '-6 days')"
        )
    else:
        raise NotImplementedError(f"Unsupported dialect: {dialect_name}")

def get_first_day_of_month(u, dialect_name) -> ColumnClause:
    if dialect_name == "mysql":
        return literal_column(
            f"DATE(CONCAT(year(DATE({u.c.createdAt.key})), '-', MONTH(DATE({u.c.createdAt.key})), '-1'))"
        )
    elif dialect_name == "sqlite":
        return literal_column(
            f"DATE({u.c.createdAt.key}, 'start of month')"
        )
    else:
        raise NotImplementedError(f"Unsupported dialect: {dialect_name}")

def get_first_day_of_year(u, dialect_name) -> ColumnClause:
    if dialect_name == "mysql":
        return literal_column(
            f"DATE(CONCAT(year(DATE({u.c.createdAt.key})), '-1-1'))"
        )
    elif dialect_name == "sqlite":
        return literal_column(
            f"DATE({u.c.createdAt.key}, 'start of year')"
        )
    else:
        raise NotImplementedError(f"Unsupported dialect: {dialect_name}")


def read_sql_from_queries(fileName: str) -> str:
    """
    Returns SQL string from file in queries folder.
    File contents are turned into a single line string.
    fileName: File name in queries folder
    """
    filePath = os.path.join(current_app.root_path, "queries", fileName + ".sql")
    print(filePath)
    # filePath = "./Server/queries/" + fileName + ".sql"

    sql = open(filePath, encoding="utf-8").read().replace("\n", " ")

    if sql.__len__ == 0:
        raise Exception("File is empty.")
    if sql.find(";") != -1:
        raise Exception("Only one SQL statement allowed.")

    return sql


def array_to_sql_in_clause(arr):
    """
    Converts a Python array (list or tuple) to a string suitable for a SQL IN clause.

    Args:
        arr: The input array (list or tuple) of numbers or strings.

    Returns:
        A string representing the SQL IN clause content.
        - For numbers: "1,2,3"
        - For strings: "('A', 'N')"
        - For an empty array: "" (or can be made to return an empty string if preferred)
    """
    if not arr:
        return ""

    # Check the type of the first element to determine formatting
    # This assumes a homogeneous array (all elements are of the same type)
    if isinstance(arr[0], (int, float)):
        # For numbers, just join them directly
        return ",".join(map(str, arr))
    elif isinstance(arr[0], str):
        # For strings, quote each element and join them
        # We also need to handle potential single quotes within the strings by doubling them
        quoted_elements = ["'" + str(item).replace("'", "''") + "'" for item in arr]
        return "(" + ",".join(quoted_elements) + ")"
    else:
        # Handle other types if necessary, or raise an error
        raise ValueError(
            "Unsupported data type in array. Only numbers and strings are supported."
        )
