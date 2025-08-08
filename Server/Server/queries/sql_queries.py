"""
This file is intended to eventually replace sql_templates.py
Instead of returning a paramaterized SQL string and parameters,
these queries will return the results of the query immediately.

Additionally, these all use SQLAlchemy, which will allow quick
switching between different database engines (MySQL, SQLite).

"""

from typing import Any, Dict, List, Tuple, TypeAlias
from sqlalchemy import (
    Inspector,
    MetaData,
    Table,
    case,
    create_engine,
    desc,
    distinct,
    func,
    inspect,
    literal,
    select,
)
from datetime import datetime, timedelta
from sqlalchemy.engine import Engine
from sqlalchemy.sql import ColumnElement, and_
from sqlalchemy.sql.elements import ColumnClause
from sqlalchemy.sql.functions import count

from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
    TutorDetailChartRequestDTO,
    TutorDetailKpiRequestDTO,
    TutorInfoRequestDTO,
    TutorLeaderboardRequestDTO,
)
from Server.queries.sql_helper import (
    get_day,
    get_first_day_of_month,
    get_first_day_of_year,
    get_first_sunday_of_week,
)


# SQLAlchemy Globals
engine: Engine = None
metadata = MetaData()


def makeEngine():
    global engine
    engine = create_engine("sqlite:///Server/schwartz_test_db.db", echo=False)
    metadata.create_all(engine)

    inspector: Inspector = inspect(engine)
    table_names = inspector.get_table_names()


def getAccountTypeCase(user_t: Table):
    return case(
        (user_t.c.tutor == 1, "Tutor"),
        (user_t.c.parentAccount == 1, "Parent"),
        else_="Student",
    )


ResultAndQuery: TypeAlias = Tuple[List[Dict[str, Any]], str]


def getResults(stmt) -> ResultAndQuery:
    with engine.connect() as conn:
        sql = str(stmt.compile(compile_kwargs={"literal_binds": True}))
        rows = conn.execute(stmt).all()

        resultList: List[Dict[str, Any]] = []
        for row in rows:
            resultList.append(row._asdict())

        return (resultList, sql)

def getOneResult(rq: ResultAndQuery) -> ResultAndQuery:
    (resultList, query) = rq
    return (resultList[0], query)


def DetailedSignupsQ(dto: DetailedSignupRequestDTO) -> ResultAndQuery:
    """
    Detailed Signups Query
    """
    user_t = Table("User", metadata, autoload_with=engine)
    school_t = Table("School", metadata, autoload_with=engine)

    # Build WHERE conditions
    conditions: List[ColumnElement] = []

    if dto.signupMethodCategories:
        conditions.append(user_t.c.hearAboutUsDropdown.in_(dto.signupMethodCategories))

    if dto.freeResponseSearchKeyword:
        conditions.append(
            user_t.c.hearAboutUsFRQ.like(f"%{dto.freeResponseSearchKeyword}%")
        )

    if dto.startDate:
        conditions.append(user_t.c.createdAt >= dto.startDate)

    if dto.endDate:
        conditions.append(user_t.c.createdAt <= dto.endDate)

    if dto.accountType:
        conditions.append(getAccountTypeCase(user_t).in_(dto.accountType))

    # SELECT clause
    stmt = (
        select(
            (user_t.c.firstName + literal(" ") + user_t.c.lastName).label("name"),
            getAccountTypeCase(user_t).label("accountType"),
            user_t.c.hearAboutUsDropdown.label("signupMethodCategory"),
            user_t.c.hearAboutUsFRQ.label("freeResponseText"),
            user_t.c.createdAt.label("dateOfSignup"),
            school_t.c.name.label("school"),
            literal(None).label("numberOfSessions"),
        )
        .select_from(user_t.join(school_t, user_t.c.schoolId == school_t.c.id))
        .where(and_(*conditions))
    )

    return getResults(stmt)

    # sql = stmt.compile(compile_kwargs={"literal_binds": True})
    # return str(sql)


def SignupsSummaryBoxQ(dto: SignupSummaryBoxRequestDTO) -> ResultAndQuery:
    """
    Signups Summary Box Query
    """
    user_t = Table("User", metadata, autoload_with=engine)
    school_t = Table("School", metadata, autoload_with=engine)

    # Build WHERE conditions
    conditions: List[ColumnElement] = []

    if dto.signupMethodCategories:
        conditions.append(user_t.c.hearAboutUsDropdown.in_(dto.signupMethodCategories))

    if dto.startDate:
        conditions.append(user_t.c.createdAt >= dto.startDate)

    if dto.endDate:
        conditions.append(user_t.c.createdAt <= dto.endDate)

    if dto.accountType:
        conditions.append(getAccountTypeCase(user_t).in_(dto.accountType))

    stmt = (
        select(func.count().label("signupCount"))
        .select_from(user_t)
        .where(and_(*conditions))
    )

    return getResults(stmt)


def SignupsLineChartQ(dto: SignupLineChartRequestDTO) -> ResultAndQuery:
    """
    Signups Summary Box Query
    """
    user_t = Table("User", metadata, autoload_with=engine)
    school_t = Table("School", metadata, autoload_with=engine)

    # Get the date grouping selection
    selectedGrouping: ColumnClause = get_first_sunday_of_week(
        engine.dialect.name, user_t.c.createdAt, 
    )

    match dto.groupBy:
        case "day":
            selectedGrouping = get_day(engine.dialect.name, user_t.c.createdAt)
        case "week":
            selectedGrouping = get_first_sunday_of_week(engine.dialect.name, user_t.c.createdAt)
        case "month":
            selectedGrouping = get_first_day_of_month(engine.dialect.name, user_t.c.createdAt)
        case "year":
            selectedGrouping = get_first_day_of_year(engine.dialect.name, user_t.c.createdAt)
        case _:
            pass

    # Build WHERE conditions
    conditions: List[ColumnElement] = []

    if dto.signupMethodCategories:
        conditions.append(user_t.c.hearAboutUsDropdown.in_(dto.signupMethodCategories))

    if dto.startDate:
        conditions.append(user_t.c.createdAt >= dto.startDate)

    if dto.endDate:
        conditions.append(user_t.c.createdAt <= dto.endDate)

    if dto.accountType:
        conditions.append(getAccountTypeCase(user_t).in_(dto.accountType))

    stmt = (
        select(
            selectedGrouping.label("date"),
            user_t.c.hearAboutUsDropdown.label("signupMethodCategory"),
            func.count().label("numberOfSignups"),
        )
        .select_from(user_t)
        .where(and_(*conditions))
        .group_by(selectedGrouping, user_t.c.hearAboutUsDropdown)
        .order_by(desc("date"))
    )

    return getResults(stmt)


def SchoolTypesQ() -> ResultAndQuery:
    school_t = Table("School", metadata, autoload_with=engine)

    stmt = select(school_t.c.schoolType).distinct().select_from(school_t)
    return getResults(stmt)


def SchoolsNameAndTypeQ() -> ResultAndQuery:
    school_t = Table("School", metadata, autoload_with=engine)

    stmt = (
        select(
            school_t.c.name.label("schoolName"),
            school_t.c.schoolType.label("schoolType"),
        )
        .distinct()
        .select_from(school_t)
    )
    return getResults(stmt)


def MailchimpUsersQ(dto: MailchimpUsersRequestDTO) -> ResultAndQuery:
    # TODO: Fix education level (moved todo from old sql_template)
    user_t = Table("User", metadata, autoload_with=engine)
    school_t = Table("School", metadata, autoload_with=engine)
    sessionstudent_t = Table("SessionStudent", metadata, autoload_with=engine)
    tutoringsession_t = Table("TutoringSession", metadata, autoload_with=engine)
    subject_t = Table("Subject", metadata, autoload_with=engine)

    latest_sessions = (
        select(
            sessionstudent_t.c.studentId,
            func.count(tutoringsession_t.c.id).label("numberSessions"),
            func.max(tutoringsession_t.c.date).label("maxSessionDate"),
        )
        .select_from(
            sessionstudent_t.join(
                tutoringsession_t,
                sessionstudent_t.c.sessionId == tutoringsession_t.c.id,
            )
        )
        .group_by(sessionstudent_t.c.studentId)
        .subquery("latest_sessions")
    )

    max_dates = (
        select(
            sessionstudent_t.c.studentId,
            func.max(tutoringsession_t.c.date).label("maxDate"),
        )
        .select_from(
            sessionstudent_t.join(
                tutoringsession_t,
                sessionstudent_t.c.sessionId == tutoringsession_t.c.id,
            )
        )
        .group_by(sessionstudent_t.c.studentId)
        .subquery("max_dates")
    )

    latest_session_details = (
        select(
            sessionstudent_t.c.studentId,
            tutoringsession_t.c.id.label("sessionId"),
            tutoringsession_t.c.date,
            tutoringsession_t.c.tutorId,
            tutoringsession_t.c.subjectId,
        )
        .select_from(
            sessionstudent_t.join(
                tutoringsession_t,
                sessionstudent_t.c.sessionId == tutoringsession_t.c.id,
            ).join(
                max_dates,
                and_(
                    max_dates.c.studentId == sessionstudent_t.c.studentId,
                    max_dates.c.maxDate == tutoringsession_t.c.date,
                ),
            )
        )
        .subquery("latest_session_details")
    )

    tutor = user_t.alias("tutor")
    parent = user_t.alias("parent")

    account_type_case = getAccountTypeCase(user_t)

    stmt = select(
        user_t.c.id.label("studentId"),
        user_t.c.firstName,
        user_t.c.lastName,
        user_t.c.email,
        user_t.c.phone,
        (tutor.c.firstName + literal(" ") + tutor.c.lastName).label("tutor"),
        parent.c.id.label("parentAccount"),
        account_type_case.label("accountType"),
        user_t.c.createdAt,
        school_t.c.name.label("school"),
        latest_sessions.c.numberSessions.label("numSessions"),
        latest_session_details.c.date.label("mostRecentSession"),
        subject_t.c.name.label("mostRecentSubject"),
    ).select_from(
        user_t.join(school_t, user_t.c.schoolId == school_t.c.id)
        .outerjoin(latest_sessions, latest_sessions.c.studentId == user_t.c.id)
        .outerjoin(
            latest_session_details, latest_session_details.c.studentId == user_t.c.id
        )
        .outerjoin(tutor, tutor.c.id == latest_session_details.c.tutorId)
        .outerjoin(subject_t, subject_t.c.id == latest_session_details.c.subjectId)
        .outerjoin(parent, parent.c.id == user_t.c.parentId)
    )

    conditions: List[ColumnElement] = []

    if dto.accountType:
        conditions.append(account_type_case.in_(dto.accountType))

    if dto.studentNameSearchKeyword:
        keyword = f"%{dto.studentNameSearchKeyword[0]}%"
        conditions.append(
            (user_t.c.firstName + literal(" ") + user_t.c.lastName).like(keyword)
        )

    if dto.minNumberOfSessions:
        conditions.append(
            latest_sessions.c.numberSessions >= int(dto.minNumberOfSessions[0])
        )

    if dto.maxNumberOfSessions:
        conditions.append(
            latest_sessions.c.numberSessions <= int(dto.maxNumberOfSessions[0])
        )

    if dto.startDate:
        conditions.append(tutoringsession_t.c.date >= dto.startDate[0])

    if dto.endDate:
        conditions.append(tutoringsession_t.c.date <= dto.endDate[0])

    if conditions:
        stmt = stmt.where(and_(*conditions))

    sort_map = {
        "createdAt desc": user_t.c.createdAt.desc(),
        "mostrecentsession desc": latest_session_details.c.date.desc(),
    }

    stmt = stmt.order_by(sort_map.get(dto.sortByDesc or "createdAt desc"))

    if dto.pageSize:
        stmt = stmt.limit(dto.pageSize[0]).offset(dto.pageIndex[0] * dto.pageSize[0])

    if dto.schools:
        conditions.append(school_t.c.name.in_(dto.schools))

    return getResults(stmt)


def SignupsByCategoryQ(startDate, endDate, categories) -> ResultAndQuery:
    user_t = Table("User", metadata, autoload_with=engine)

    # WHERE conditions
    conditions: List[ColumnElement] = []

    if startDate:
        conditions.append(user_t.c.createdAt >= startDate[0])

    if endDate:
        conditions.append(user_t.c.createdAt <= endDate[0])

    if categories:
        conditions.append(user_t.c.hearAboutUsDropdown.in_(categories))

    # Base SELECT
    stmt = (
        select(
            user_t.c.hearAboutUsDropdown.label("category"),
            func.count().label("signups"),
        )
        .select_from(user_t)
        .where(user_t.c.hearAboutUsDropdown.isnot(None))
        .group_by(user_t.c.hearAboutUsDropdown)
        .order_by(desc(func.count()))
        .where(and_(*conditions))
    )

    return getResults(stmt)


def TutorLeaderboardQ(dto: TutorLeaderboardRequestDTO) -> ResultAndQuery:
    # TODO: dto.subjects filter

    user_t = Table("User", metadata, autoload_with=engine)
    tutoringsession_t = Table("TutoringSession", metadata, autoload_with=engine)
    sessionstudent_t = Table("SessionStudent", metadata, autoload_with=engine)
    subject_t = Table("Subject", metadata, autoload_with=engine)

    conditions: List[ColumnElement] = []
    # tutor_user_conditions = []

    founding_date = datetime(2017, 9, 14)
    start_date = datetime.fromisoformat(dto.startDate.replace("Z", "")) if dto.startDate else founding_date
    end_date = datetime.fromisoformat(dto.endDate.replace("Z", "")) if dto.endDate else datetime.now()
    weeks_in_range = max((end_date - start_date).days / 7.0, 1.0)

    # Filters date of the tutoring session

    if dto.startDate:
        conditions.append(tutoringsession_t.c.date >= dto.startDate)

    if dto.endDate:
        conditions.append(tutoringsession_t.c.date <= dto.endDate)

    order_by_argument = func.count(tutoringsession_t.c.date)

    if dto.sortBy:
        if dto.sortBy == "hours":
            order_by_argument = "hoursTutored"
        elif dto.sortBy == "sessions":
            order_by_argument = "numberOfSessions"
        elif dto.sortBy == "recurringSessions":
            order_by_argument = "numRecurringSessions"
        elif dto.sortBy == "revenue":
            order_by_argument = "revenueGenerated"

    if dto.subjects:
        # NOT IMPLEMENTED - requires change to query
        print(
            "Subjects not implemented yet. Need to join subjects table and get subject name to be able to filter."
        )

    if dto.locations:
        # Aka session Method
        conditions.append(tutoringsession_t.c.method.in_(dto.locations))

    # Tutor-student pairings with more than one meetup (as to not count first meetup
    # as a recurring session with the JOIN, if HAVING were >= 0)
    student_tutor_recurring_pairings = (
        select(
            tutoringsession_t.c.tutorId.label("tutorId"),
            sessionstudent_t.c.studentId.label("studentId"),
            literal(1).label("isRecurringPairing"),
        )
        .select_from(
            tutoringsession_t.join(
                sessionstudent_t, tutoringsession_t.c.id == sessionstudent_t.c.sessionId
            )
        )
        .group_by("tutorId", "studentId")
        .having(func.count() > 1)
        .subquery()
    )

    stmt = (
        select(
            user_t.c.id.label("tutorId"),
            (user_t.c.firstName + literal(" ") + user_t.c.lastName).label("name"),
            func.count(tutoringsession_t.c.date).label("numberOfSessions"),
            func.max(tutoringsession_t.c.date).label("lastSession"),
            func.sum(tutoringsession_t.c.length).label("hoursTutored"),
            func.sum(student_tutor_recurring_pairings.c.isRecurringPairing).label(
                "numRecurringSessions"
            ),
            literal(0).label("revenueGenerated"),
            (func.coalesce(func.sum(tutoringsession_t.c.length), 0) / literal(weeks_in_range)).label("avgHoursPerWeek")
        )
        .select_from(
            user_t.outerjoin(
                tutoringsession_t, tutoringsession_t.c.tutorId == user_t.c.id
            )
            .outerjoin(
                sessionstudent_t, sessionstudent_t.c.sessionId == tutoringsession_t.c.id
            )
            .outerjoin(
                student_tutor_recurring_pairings,
                (
                    student_tutor_recurring_pairings.c.tutorId
                    == tutoringsession_t.c.tutorId
                )
                & (
                    student_tutor_recurring_pairings.c.studentId
                    == sessionstudent_t.c.studentId
                ),
            )
        )
        .group_by(user_t.c.id)
        .where(and_(*conditions))
        .order_by(desc(order_by_argument))
    )

    return getResults(stmt)

def TutorInfoQ(dto: TutorInfoRequestDTO) -> ResultAndQuery:

    user_t = Table("User", metadata, autoload_with=engine);

    stmt = select(
        (user_t.c.firstName + literal(" ") + user_t.c.lastName).label("name")
    ).where(user_t.c.id == dto.id)

    return getOneResult(getResults(stmt))

def TutorDetailKpiQ(dto: TutorDetailKpiRequestDTO) -> ResultAndQuery:

    user_t = Table("User", metadata, autoload_with=engine)
    tutoringsession_t = Table("TutoringSession", metadata, autoload_with=engine)
    sessionstudent_t = Table("SessionStudent", metadata, autoload_with=engine)
    subject_t = Table("Subject", metadata, autoload_with=engine)

    conditions: List[ColumnElement] = []

    founding_date = datetime(2017, 9, 14)
    start_date = datetime.fromisoformat(dto.startDate.replace("Z", "")) if dto.startDate else founding_date
    end_date = datetime.fromisoformat(dto.endDate.replace("Z", "")) if dto.endDate else datetime.now()
    weeks_in_range = max((end_date - start_date).days / 7.0, 1.0)

    conditions.append(user_t.c.id == dto.id)

    if dto.startDate:
        conditions.append(tutoringsession_t.c.date >= dto.startDate)
    if dto.endDate:
        conditions.append(tutoringsession_t.c.date <= dto.endDate)

    order_by_argument = func.count(tutoringsession_t.c.date)

    # Recurring pairings (student/tutor pairs with more than one session)
    student_tutor_recurring_pairings = (
        select(
            tutoringsession_t.c.tutorId.label("tutorId"),
            sessionstudent_t.c.studentId.label("studentId"),
            literal(1).label("isRecurringPairing"),
        )
        .select_from(
            tutoringsession_t.join(sessionstudent_t, tutoringsession_t.c.id == sessionstudent_t.c.sessionId)
        )
        .group_by(tutoringsession_t.c.tutorId, sessionstudent_t.c.studentId)
        .having(func.count() > 1)
        .subquery()
    )

    stmt = (
        select(
            user_t.c.id.label("tutorId"),
            (user_t.c.firstName + literal(" ") + user_t.c.lastName).label("name"),

            # Total number of unique sessions (student-tutor pairings)
            func.count(sessionstudent_t.c.studentId).label("totalSessions"),

            # Repeat sessions only (student is in recurring pair)
            func.sum(
                case(
                    (
                        sessionstudent_t.c.studentId.in_(
                            select(student_tutor_recurring_pairings.c.studentId)
                            .where(student_tutor_recurring_pairings.c.tutorId == user_t.c.id)
                            .correlate(user_t)
                        ),
                        1
                    ),
                    else_=0
                )
            ).label("repeatSessionCount"),

            # Number of unique students taught
            func.count(distinct(sessionstudent_t.c.studentId)).label("uniqueStudents"),

            # Total student count (not unique)
            func.count(sessionstudent_t.c.studentId).label("totalStudentCount"),

            # Average hours per week
            (func.coalesce(func.sum(tutoringsession_t.c.length), 0) / literal(weeks_in_range)).label("avgHoursPerWeek"),
        )
        .select_from(
            user_t.outerjoin(
                tutoringsession_t, tutoringsession_t.c.tutorId == user_t.c.id
            )
            .outerjoin(
                sessionstudent_t, sessionstudent_t.c.sessionId == tutoringsession_t.c.id
            )
            .outerjoin(
                student_tutor_recurring_pairings,
                and_(
                    student_tutor_recurring_pairings.c.tutorId == tutoringsession_t.c.tutorId,
                    student_tutor_recurring_pairings.c.studentId == sessionstudent_t.c.studentId,
                ),
            )
        )
        .where(and_(*conditions))
        .group_by(user_t.c.id)
        .order_by(desc(order_by_argument))
    )

    return getOneResult(getResults(stmt))


def TutorDetailChartQ(dto: TutorDetailChartRequestDTO) -> ResultAndQuery:
    """
    Tutor Detail Chart
    Modified from Signups Summary Box Query
    """
    user_t = Table("User", metadata, autoload_with=engine)
    school_t = Table("School", metadata, autoload_with=engine)
    tutoringsession_t = Table("TutoringSession", metadata, autoload_with=engine)
    sessionstudent_t = Table("SessionStudent", metadata, autoload_with=engine)
    subject_t = Table("Subject", metadata, autoload_with=engine)

    # Get the date grouping selection
    selectedGrouping: ColumnClause = get_first_sunday_of_week(
        engine.dialect.name, user_t.c.createdAt, 
    )

    match dto.groupBy:
        case "day":
            selectedGrouping = get_day(engine.dialect.name, tutoringsession_t.c.date)
        case "week":
            selectedGrouping = get_first_sunday_of_week(engine.dialect.name, tutoringsession_t.c.date)
        case "month":
            selectedGrouping = get_first_day_of_month(engine.dialect.name, tutoringsession_t.c.date)
        case "year":
            selectedGrouping = get_first_day_of_year(engine.dialect.name, tutoringsession_t.c.date)
        case _:
            pass

    # Build WHERE conditions
    conditions: List[ColumnElement] = []

    # Add tutor ID filter
    conditions.append(user_t.c.id == dto.id)

    if dto.startDate:
        conditions.append(user_t.c.createdAt >= dto.startDate)

    if dto.endDate:
        conditions.append(user_t.c.createdAt <= dto.endDate)

    stmt = (
        select(
            selectedGrouping.label("date"),
            func.sum(tutoringsession_t.c.length).label("sessionHours"),
        )
        .select_from(
            user_t.outerjoin(
                tutoringsession_t, tutoringsession_t.c.tutorId == user_t.c.id
            )
            .outerjoin(
                sessionstudent_t, sessionstudent_t.c.sessionId == tutoringsession_t.c.id
            )
        )
        .where(and_(*conditions))
        .group_by(selectedGrouping)
        .order_by(desc("date"))
    )


    return getResults(stmt)