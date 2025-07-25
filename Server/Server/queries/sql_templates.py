"""
These queries will eventually all be replaced by
the sql_queries file. Do not make new queries here.

The queries that exist here are not transferrable between
different database providers, and are made specifically
for MySQL.
"""

from typing import Any, List, Tuple, TypeAlias

from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
)
from Server.queries import sql_helper


def qSignupsByCategory(startDate, endDate, categories):
    """
    MIGRATED - DO NOT USE
    """
    sqlListOfCategories = sql_helper.array_to_sql_in_clause(categories)

    return f"""
select 
    user.hearAboutUsDropdown  as 'category',
    count(*) as 'signups' from `user_t` as user
where
    user.hearAboutUsDropdown is not null 
    {f"and `user`.createdAt >= '{startDate[0]}'" if startDate else ""}
    {f"and `user`.createdAt <= '{endDate[0]}'" if endDate else ""}
    {f"and `user`.hearAboutUsDropdown in {sqlListOfCategories}" if sqlListOfCategories else ""}
group by 
    user.hearAboutUsDropdown
order by 
    count(*) desc
""".replace(
        "\n", " "
    )


def qMailchimpUsers(dto: MailchimpUsersRequestDTO) -> str:
    """
    MIGRATED - DO NOT USE
    """
    # sortChoice = "mostrecentsession desc"
    sortChoice = "createdAt desc"

    return f"""
SELECT
    u.id AS studentId,
    u.firstName,
    u.lastName,
    u.email,
    u.phone,
    CONCAT(tutor.firstName, ' ', tutor.lastName) AS tutor,
    parent.id AS parentAccount,
    u.createdAt AS createdAt,
    school.name AS school,
    latest_sessions.numberSessions AS numSessions,
    latest_session_details.date AS mostRecentSession,
    subject.name AS mostRecentSubject
FROM
    user_t AS u
INNER JOIN
    school_t AS school ON u.schoolId = school.id
LEFT JOIN
    (
        SELECT
            sessionstudent.studentId,
            COUNT(tutoringsession.id) AS numberSessions,
            MAX(tutoringsession.date) AS maxSessionDate
        FROM
            sessionstudent_t AS sessionstudent
        INNER JOIN
            tutoringsession_t AS tutoringsession ON sessionstudent.sessionId = tutoringsession.id
        GROUP BY
            sessionstudent.studentId
    ) AS latest_sessions ON latest_sessions.studentId = u.id
LEFT JOIN
    (
        SELECT
            sessionstudent.studentId,
            tutoringsession.id AS sessionId,
            tutoringsession.date,
            tutoringsession.tutorId,
            tutoringsession.subjectId
        FROM
            sessionstudent_t AS sessionstudent
        INNER JOIN
            tutoringsession_t AS tutoringsession ON sessionstudent.sessionId = tutoringsession.id
        INNER JOIN (
            SELECT
                sessionstudent.studentId,
                MAX(tutoringsession.date) AS maxDate
            FROM
                sessionstudent_t AS sessionstudent
            INNER JOIN
                tutoringsession_t AS tutoringsession ON sessionstudent.sessionId = tutoringsession.id
            GROUP BY
                sessionstudent.studentId
        ) AS max_dates ON
            max_dates.studentId = sessionstudent.studentId AND
            tutoringsession.date = max_dates.maxDate
    ) AS latest_session_details ON latest_session_details.studentId = u.id
LEFT JOIN
    user_t AS tutor ON tutor.id = latest_session_details.tutorId
LEFT JOIN
    subject_t AS subject ON subject.id = latest_session_details.subjectId
LEFT JOIN
    user_t AS parent ON parent.id = u.parentId
where 
	1=1
    {f"and {accountTypeCase} in {sql_helper.array_to_sql_in_clause(dto.accountType)}" if dto.accountType else ""}
	{f"and CONCAT(u.firstName, ' ', u.lastName) like '%{dto.studentNameSearchKeyword[0]}%'" if dto.studentNameSearchKeyword else ""}
	{f"and latest_sessions.numbersessions >= '{dto.minNumberOfSessions[0]}'" if dto.minNumberOfSessions else ""}
	{f"and latest_sessions.numbersessions <= '{dto.maxNumberOfSessions[0]}'" if dto.maxNumberOfSessions else ""}
	{f"and tutoringsession.date >= '{dto.startDate[0]}'" if dto.startDate else ""}
    {f"and tutoringsession.date <= '{dto.endDate[0]}'" if dto.endDate else ""}
order by
    {sortChoice}
{f"limit {dto.pageSize[0]} offset {dto.pageIndex[0] * dto.pageSize[0]}" if dto.pageSize else ""}
"""


def qSchoolsNameType() -> str:
    """
    MIGRATED
    """
    return (
        f"SELECT DISTINCT name as schoolName, schoolType as schoolType FROM school_t;"
    )


def qSchoolTypes() -> str:
    """
    MIGRATED
    """
    return "SELECT DISTINCT schoolType FROM school_t;"


# Returns list of params, and str SQL query (with %s replacements)
ParameterizedQueryReturn: TypeAlias = Tuple[List[Any], str]

# Reusables
accountTypeCase = "(case when u.tutor is true then 'Tutor' when u.parentAccount is true then 'Parent' else 'Student' end)"


def qDetailedSignups(dto: DetailedSignupRequestDTO) -> ParameterizedQueryReturn:
    """
    REPLACED IN SQL_QUERIES.PY
    """
    # This query will use parameters, so the db.execute() can
    # escape anything that could lead to SQL Injection

    # Content of the Where clause
    whereContent = "1=1 "
    params: List[Any] = []

    if dto.signupMethodCategories:
        whereContent += "and u.hearAboutUsDropdown in %s "
        params.append(dto.signupMethodCategories)

    if dto.freeResponseSearchKeyword:
        whereContent += "and u.hearAboutUsFRQ like %s "
        params.append(f"%{dto.freeResponseSearchKeyword}%")

    if dto.startDate:
        whereContent += "and u.createdAt >= %s "
        params.append(dto.startDate)

    if dto.endDate:
        whereContent += "and u.createdAt <= %s "
        params.append(dto.endDate)

    if dto.accountType:
        whereContent += f"and {accountTypeCase} in %s "
        params.append(dto.accountType)

    # if dto.educationLevel:
    #     educationLevelsList: List[str] = []
    #     if "K-12" in dto.educationLevel:
    #         educationLevelsList.append("elementary")
    #         educationLevelsList.append("middle")
    #         educationLevelsList.append("high")
    #     if "College" in dto.educationLevel:
    #         educationLevelsList.append("college")
    #         educationLevelsList.append("graduate")
    #         educationLevelsList.append("postgraduate")

    #     whereContent += "and educationlevel in %s "
    #     params.append(educationLevelsList)

    # Create SQL string
    return (
        params,
        f"""
select
    CONCAT(u.firstName, ' ', u.lastName) as name,
    {accountTypeCase} as accountType,
    u.hearAboutUsDropdown  as signupMethodCategory,
    u.hearAboutUsFRQ as freeResponseText,
    u.createdAt as dateOfSignup,
    st.name as school,
    null as numberOfSessions
from user_t u
inner join school_t st on schoolId = st.id
where {whereContent};
""",
    )


def qSignupsSummaryBox(dto: SignupSummaryBoxRequestDTO) -> ParameterizedQueryReturn:
    """
    MIGRATED TO SQL_QUERIES - DO NOT USE
    """
    # Content of the Where clause
    whereContent = "1=1 "
    params: List[Any] = []

    if dto.signupMethodCategories:
        whereContent += "and u.hearAboutUsDropdown in %s "
        params.append(dto.signupMethodCategories)

    if dto.startDate:
        whereContent += "and u.createdAt >= %s "
        params.append(dto.startDate)

    if dto.endDate:
        whereContent += "and u.createdAt <= %s "
        params.append(dto.endDate)

    if dto.accountType:
        whereContent += f"and {accountTypeCase} in %s "
        params.append(dto.accountType)

    # Create SQL string
    return (
        params,
        f"""
select COUNT(*) as signupCount
from (select *, {accountTypeCase} as accountType from user_t u) u
where {whereContent};
""",
    )


def qSignupsLineChart(dto: SignupLineChartRequestDTO) -> ParameterizedQueryReturn:
    """
    MIGRATED TO SQL_QUERIES -  DO NOT USEs
    """
    # Reusable clause for SELECT and GROUP BY
    firstSundayOfWeek = (
        "DATE(DATE_SUB(DATE(u.createdAt), INTERVAL DAYOFWEEK(u.createdAt) - 1 DAY))"
    )
    firstDayOfMonth = (
        "DATE(CONCAT(year(DATE(u.createdAt)), '-', MONTH(DATE(u.createdAt)), '-1'))"
    )
    firstDayOfYear = "DATE(CONCAT(year(DATE(u.createdAt)), '-1-1'))"

    selectedGrouping = ""
    match dto.groupBy:
        case "week":
            selectedGrouping = firstSundayOfWeek
        case "month":
            selectedGrouping = firstDayOfMonth
        case "year":
            selectedGrouping = firstDayOfYear
        case _:
            # Unknown input
            selectedGrouping = firstSundayOfWeek

    # Content of the Where clause
    whereContent = "1=1 "
    params: List[Any] = []

    if dto.signupMethodCategories:
        whereContent += "and u.hearAboutUsDropdown in %s "
        params.append(dto.signupMethodCategories)

    if dto.startDate:
        whereContent += "and u.createdAt >= %s "
        params.append(dto.startDate)

    if dto.endDate:
        whereContent += "and u.createdAt <= %s "
        params.append(dto.endDate)

    if dto.accountType:
        whereContent += f"and {accountTypeCase} in %s "
        params.append(dto.accountType)

    # Create SQL string

    return (
        params,
        f"""
select
	{selectedGrouping} as date,
	u.hearAboutUsDropdown as signupMethodCategory,
	COUNT(u.createdAt) as numberOfSignups
from
	user_t u
where {whereContent}
group by {selectedGrouping}, hearAboutUsDropdown
order by date desc;
""",
    )
