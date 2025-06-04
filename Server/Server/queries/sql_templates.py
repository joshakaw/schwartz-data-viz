from . import sql_helper

def qSignupsByCategory(startDate, endDate, categories):
    sqlListOfCategories = sql_helper.array_to_sql_in_clause(categories)

    return \
f"""
select 
    user.hearAboutUsDropdown  as 'category',
    count(*) as 'signups' from `user`
where
    user.hearAboutUsDropdown is not null 
    {f"and `user`.createdAt > '{startDate}'" if startDate else ""}
    {f"and `user`.createdAt < '{endDate}'" if endDate else ""}
    {f"and `user`.hearAboutUsDropdown in {sqlListOfCategories}" if sqlListOfCategories else ""}
group by 
    user.hearAboutUsDropdown
order by 
    count(*) desc
""".replace("\n", " ")

def qMailchimpUsers():
    # TODO: Implement Mailchimmp User SQL template
    raise NotImplementedError("Not implemented")