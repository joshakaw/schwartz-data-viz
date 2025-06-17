import unittest

from Server.dtos.dtos import DetailedSignupRequestDTO, SignupSummaryBoxRequestDTO
from Server.queries.sql_templates import qDetailedSignups, qSignupsByCategory, qSignupsSummaryBox

class Test_test_sql_templates(unittest.TestCase):
    def test_signupsByCategory_full(self):
        string = qSignupsByCategory(['2002-01-01'], ['2004-01-01'], ['A', 'B'])
        self.maxDiff = None
        self.assertEqual(\
"""
select 
    user.hearAboutUsDropdown  as 'category',
    count(*) as 'signups' from `user_t` as user
where
    user.hearAboutUsDropdown is not null 
    and `user`.createdAt >= '2002-01-01'
    and `user`.createdAt <= '2004-01-01'
    and `user`.hearAboutUsDropdown in ('A','B')
group by 
    user.hearAboutUsDropdown
order by 
    count(*) desc
""".replace("\n", " "), string)

    def test_signupsByCategory_empty(self):
        string = qSignupsByCategory(None, None, None)
        self.maxDiff = None
        self.assertEqual(\
"""
select 
    user.hearAboutUsDropdown  as 'category',
    count(*) as 'signups' from `user_t` as user
where
    user.hearAboutUsDropdown is not null 
    
    
    
group by 
    user.hearAboutUsDropdown
order by 
    count(*) desc
""".replace("\n", " "), string)

    def test_qDetailedSignups(self):
        dto = DetailedSignupRequestDTO(
            signupMethodCategories=None,
            freeResponseSearchKeyword="Royal",
            startDate="2022-11-13",
            endDate="2022-11-14",
            accountType=["Student"],
            educationLevel=["K-12"]
        )
        (params, query) = qDetailedSignups(dto)
        print(params)
        print(query)

    def test_qSignupsSummaryBox(self):
        dto = SignupSummaryBoxRequestDTO(
            signupMethodCategories=None,
            startDate="2022-11-13",
            endDate="2022-11-14",
            accountType=["Student"],
        )
        (params, query) = qSignupsSummaryBox(dto)
        print(params)
        print(query)

if __name__ == '__main__':
    unittest.main()
