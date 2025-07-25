import unittest

from werkzeug import Response

from Server import create_app


class Test_test_views(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app = create_app()
        app.testing = True
        cls._client = app.test_client()

    @classmethod
    def tearDownClass(cls):
        cls._client = None

    def test_detailed_signups_table(self):
        response = self._client.get(
            "/detailedSignupsDashboard/table?startDate=2021-10-01&endDate=2025-01-01&signupMethodCategories=Physical%20Advertising&signupMethodCategories=Friend%20Referral&accountType=Tutor"
        )
        print(response.get_json())
        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_signups_by_category(self):
        # Does not test response/query validity
        response = self._client.get(
            "/signupDashboard/signupsByCategory?startDate=2021-10-01&endDate=2022-01-01&signupMethodCategories=Physical%20Advertising&signupMethodCategories=Friend%20Referral",
            # json={
            #     "startDate": "2021-10-01",
            #     "endDate": "2022-01-01",
            #     "signupMethodCategories": ["Physical Advertising", "Friend Referral"],
            # },
        )
        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_mailchimp_users(self):
        # Does not test response/query validity
        response = self._client.get(
            "/mailchimpDashboard/users?pageIndex=1&pageSize=10&studentNameSearchKeyword=D&minNumberOfSessions=1&maxNumberOfSessions=10&startDate=2020-10-01&endDate=2023-01-01&accountType=Student&accountType=Tutor&accountType=Parent&educationLevel=K-12&limit=15",
            # json={
            #     "pageIndex": 0,
            #     "pageSize": 10,
            #     "studentNameSearchKeyword": "D",
            #     "minNumberOfSessions": 1,
            #     "maxNumberOfSessions": 10,
            #     "startDate": "2021-10-01",
            #     "endDate": "2022-01-01",
            #     "accountType": ["Student", "Tutor", "Parent"],
            #     "educationLevel": ["K-12"],
            # },
        )

        print(response.get_json())
        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_signups_line_chart(self):
        response: Response = self._client.get(
            "/signupDashboard/lineChart?groupBy=week&startDate=2022-01-01"
        )
        print(response.get_json())

        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_signups_summary_box(self):
        response: Response = self._client.get(
            "/signupDashboard/summaryBox?startDate=2022-01-01"
        )
        print(response.get_json())

        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_education_level_schools(self):
        response: Response = self._client.get("/educationLevelSchools")
        print(response.get_json())

        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_tutor_data_leaderboard(self):
        response: Response = self._client.get("/tutorData/leaderboard")
        print(response.get_json())

        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK


if __name__ == "__main__":
    unittest.main()
