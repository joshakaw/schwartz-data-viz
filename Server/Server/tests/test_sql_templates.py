import unittest

from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
)
from Server.queries.sql_templates import (
    qDetailedSignups,
    qSignupsByCategory,
    qSignupsLineChart,
    qSignupsSummaryBox,
)


class Test_test_sql_templates(unittest.TestCase):
    def test_signupsByCategory_full(self):
        string = qSignupsByCategory(["2002-01-01"], ["2004-01-01"], ["A", "B"])
        self.maxDiff = None
        self.assertEqual(
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
""".replace(
                "\n", " "
            ),
            string,
        )

    def test_signupsByCategory_empty(self):
        string = qSignupsByCategory(None, None, None)
        self.maxDiff = None
        self.assertEqual(
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
""".replace(
                "\n", " "
            ),
            string,
        )

    def test_qDetailedSignups(self):
        dto = DetailedSignupRequestDTO(
            signupMethodCategories=None,
            freeResponseSearchKeyword="Royal",
            startDate="2022-11-13",
            endDate="2022-11-14",
            accountType=["Student"],
            educationLevel=["K-12"],
        )
        (params, query) = qDetailedSignups(dto)
        print(params)
        print(query)

        assert params == ['%Royal%', '2022-11-13', '2022-11-14', ['Student'], ['elementary', 'middle', 'high']]
        assert "u.hearAboutUsFRQ like %s" in query
        assert "u.createdAt >= %s" in query
        assert "u.createdAt <= %s" in query

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

        assert params == ["2022-11-13", "2022-11-14", ["Student"]]
        assert "u.createdAt >= %s" in query
        assert "u.createdAt <= %s" in query

    def test_qSignupsLineChart(self):
        dto = SignupLineChartRequestDTO(
            groupBy="week",
            signupMethodCategories=None,
            startDate="2022-11-13",
            endDate="2022-11-14",
            accountType=["Student"],
        )

        (params, query) = qSignupsLineChart(dto)
        print(params)
        print(query)

        assert params == ["2022-11-13", "2022-11-14", ["Student"]]
        assert "group by" in query
        assert "order by date desc" in query
        assert "u.createdAt >= %s" in query
        assert "u.createdAt <= %s" in query

if __name__ == "__main__":
    unittest.main()
