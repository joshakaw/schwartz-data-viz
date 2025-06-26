from typing import Any, List, Tuple, TypeAlias

from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
)
from Server.queries import sql_helper


def qSignupsByCategory(startDate, endDate, categories):
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
    # sortChoice = "mostrecentsession desc"
    sortChoice = "createdAt desc"

    return f"""
select
    u.id as studentId,
    -- Kept AS for clear column name
    u.firstName,
    u.lastName,
    u.email,
    u.phone,
    CONCAT(tutor.firstName, ' ', tutor.lastName) as tutor,
    parent.id as parentAccount,
    u.createdAt as createdAt,
    school.name as school,
    latest_sessions.numbersessions as numSessions,
    tutoringsession.date as mostRecentSession,
    subject.name as mostRecentSubject
from
    user_t as u
inner join
    school_t as school on
    u.schoolId = school.id
inner join
  sessionstudent_t as sessionstudent on
    u.id = sessionstudent.studentId
inner join
  tutoringsession_t as tutoringsession on
    sessionstudent.sessionId = tutoringsession.id
inner join (
    select
        sessionstudent.studentId,
        MAX(tutoringsession.date) as maxSessionDate,
        COUNT(tutoringsession.id) as numberSessions
    from
        sessionstudent_t as sessionstudent
    inner join
    tutoringsession_t as tutoringsession on
        sessionstudent.sessionId = tutoringsession.id
    group by
        sessionstudent.studentId
) as latest_sessions on
    u.id = latest_sessions.studentId
    and tutoringsession.date = latest_sessions.maxSessionDate
inner join
  user_t tutor on
    tutoringsession.tutorId = tutor.id
inner join
    subject_t as subject on
    tutoringsession.subjectId = subject.id
left join 
    user_t parent on
    u.parentId = parent.id
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
{f"limit {dto.pageSize[0]} offset {dto.pageIndex[0]}" if dto.pageSize else ""}
"""


def qSchoolsNameType() -> str:
    return (
        f"SELECT DISTINCT name as schoolName, schoolType as schoolType FROM school_t;"
    )


def qSchoolTypes() -> str:
    return f"SELECT DISTINCT schoolType FROM school_t;"


# Returns list of params, and str SQL query (with %s replacements)
ParameterizedQueryReturn: TypeAlias = Tuple[List[Any], str]

# Reusables
accountTypeCase = "(case when u.tutor is true then 'Tutor' when u.parentAccount is true then 'Parent' else 'Student' end)"


def qDetailedSignups(dto: DetailedSignupRequestDTO) -> ParameterizedQueryReturn:
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

        # TODO: Fix education level
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
