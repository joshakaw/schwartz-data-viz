from . import sql_helper

def qSignupsByCategory(startDate, endDate, categories):
    sqlListOfCategories = sql_helper.array_to_sql_in_clause(categories)

    return \
f"""
select 
    user.hearAboutUsDropdown  as 'category',
    count(*) as 'signups' from `user_t` as user
where
    user.hearAboutUsDropdown is not null 
    {f"and `user`.createdAt >= '{startDate}'" if startDate else ""}
    {f"and `user`.createdAt <= '{endDate}'" if endDate else ""}
    {f"and `user`.hearAboutUsDropdown in {sqlListOfCategories}" if sqlListOfCategories else ""}
group by 
    user.hearAboutUsDropdown
order by 
    count(*) desc
""".replace("\n", " ")

def qMailchimpUsers():
    # TODO: Implement Mailchimmp User SQL template
    # raise NotImplementedError("Not implemented")

    return\
f"""
select
	user.id as studentId,
	-- Kept AS for clear column name
	user.firstName,
	user.lastName,
	user.email,
	user.phone,
	CONCAT(tutor.firstName, ' ', tutor.lastName) as tutor,
	parent.id as parentAccount,
	user.createdAt as createdAt,
	school.name as school,
	latest_sessions.numbersessions as numSessions,
	tutoringsession.date as mostRecentSession,
	subject.name as mostRecentSubject
from
	user_t as user
inner join
	school_t as school on
	user.schoolId = school.id
inner join
  sessionstudent_t as sessionstudent on
	user.id = sessionstudent.studentId
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
	user.id = latest_sessions.studentId
	and tutoringsession.date = latest_sessions.maxSessionDate
inner join
  user_t tutor on
	tutoringsession.tutorId = tutor.id
inner join
	subject_t as subject on
	tutoringsession.subjectId = subject.id
left join 
	user_t parent on
	user.parentId = parent.id
order by
	mostrecentsession desc;
"""