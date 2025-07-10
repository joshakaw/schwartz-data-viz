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

    def test_DetailedSignupsQ(self):
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

    def test_SignupsSummaryBoxQ(self):
        dto = SignupSummaryBoxRequestDTO(
            signupMethodCategories=None,
            startDate="2022-11-13",
            endDate="2025-11-14",
            accountType=["Student"],
        )
        (results, query) = SignupsSummaryBoxQ(dto)
        print(results)
        print(query)

    def test_SignupsLineChartQ(self):
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

    def test_SchoolTypesQ(self):
        (results, query) = SchoolTypesQ()
        print(results)
        print(query)

    def test_SchoolsNameAndTypeQ(self):
        (results, query) = SchoolsNameAndTypeQ()
        print(results)
        print(query)

    def test_MailchimpUsersQ(self):
        dto = MailchimpUsersRequestDTO(pageIndex=[0], pageSize=[3])
        (results, query) = MailchimpUsersQ(dto)
        print(results)
        print(query)

    def test_SignupsByCategoryQ(self):
        (results, query) = SignupsByCategoryQ(
            ["2002-01-01"], ["2025-01-01"], ["Social Media", "Email Campaign"]
        )

        print(results)
        print(query)

    def test_TutorLeaderboardQ(self):
        dto = TutorLeaderboardRequestDTO(subjects=["MMG 222"])

        (results, query) = TutorLeaderboardQ(dto)
        print(results)
        print(len(results))
        print(query)


if __name__ == "__main__":
    unittest.main()
