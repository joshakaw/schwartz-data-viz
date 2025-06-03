"""
Helper functions to deal with
SQL strings
"""

import os

from flask import current_app

#def init_sql_helper():
    

def read_sql_from_queries(fileName: str) -> str:
    """
    Returns SQL string from file in queries folder.
    File contents are turned into a single line string.
    fileName: File name in queries folder
    """
    filePath = os.path.join(current_app.root_path, "queries", fileName + ".sql")
    print(filePath)
    # filePath = "./Server/queries/" + fileName + ".sql"

    sql = open(filePath).read().replace("\n", " ")

    if(sql.__len__ == 0):
        raise Exception("File is empty.")
    if(sql.find(";") != -1):
        raise Exception("Only one SQL statement allowed.")

    return sql
