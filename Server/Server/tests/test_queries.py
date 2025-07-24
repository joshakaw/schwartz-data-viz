import unittest

from Server.dtos.dtos import (
    DetailedSignupRequestDTO,
    MailchimpUsersRequestDTO,
    SignupLineChartRequestDTO,
    SignupSummaryBoxRequestDTO,
    TutorLeaderboardRequestDTO,
)
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


class Test_test_queries(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        makeEngine()

    def test_detailed_signups_q(self):
        """
        SQLALCHEMY
        """
        dto = DetailedSignupRequestDTO(
            signupMethodCategories=None,
            freeResponseSearchKeyword=None,
            startDate="2023-11-13",
            endDate="2025-11-14",
            accountType=["Student"],
            educationLevel=["K-12"],
        )
        (results, query) = DetailedSignupsQ(dto)
        print(results)
        print(query)

    def test_signups_summary_box_q(self):
        dto = SignupSummaryBoxRequestDTO(
            signupMethodCategories=None,
            startDate="2022-11-13",
            endDate="2025-11-14",
            accountType=["Student"],
        )
        (results, query) = SignupsSummaryBoxQ(dto)
        print(results)
        print(query)

    def test_signups_line_chart_q(self):
        dto = SignupLineChartRequestDTO(
            groupBy="week",
            signupMethodCategories=None,
            startDate="2022-11-13",
            endDate="2025-11-14",
            accountType=["Student"],
        )

        (results, query) = SignupsLineChartQ(dto)
        print(results)
        print(query)

    def test_school_types_q(self):
        (results, query) = SchoolTypesQ()
        print(results)
        print(query)

    def test_schools_name_and_type_q(self):
        (results, query) = SchoolsNameAndTypeQ()
        print(results)
        print(query)

    def test_mailchimp_users_q(self):
        dto = MailchimpUsersRequestDTO(pageIndex=[0], pageSize=[3], schoolsIncluded=["Greggside Elementary"])
        (results, query) = MailchimpUsersQ(dto)
        print(results)
        print(query)

    def test_signups_by_category_q(self):
        (results, query) = SignupsByCategoryQ(
            ["2002-01-01"], ["2025-01-01"], ["Social Media", "Email Campaign"]
        )

        print(results)
        print(query)

    def test_tutor_leaderboard_q(self):
        dto = TutorLeaderboardRequestDTO(subjects=["MMG 222"])

        (results, query) = TutorLeaderboardQ(dto)
        print(results)
        print(len(results))
        print(query)


if __name__ == "__main__":
    unittest.main()
