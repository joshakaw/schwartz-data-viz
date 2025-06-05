import unittest

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

    def test_signupsByCategory(self):
        # Does not test response/query validity
        response = self._client.get(
            "/signupDashboard/signupsByCategory",
            json={
                "startDate": "2021-10-01",
                "endDate": "2022-01-01",
                "signupMethodCategories": ["Physical Advertising", "Friend Referral"],
            },
        )
        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK

    def test_mailchimpUsers(self):
        # Does not test response/query validity
        response = self._client.get(
            "/mailchimpDashboard/users",
            json={
                "pageIndex": 0,
                "pageSize": 10,
                "filter": {
                    "signupMethodCategories": [
                        "Physical Advertising",
                        "Friend Referral",
                    ],
                    "freeResponseSearchKeyword": None,
                    "startDate": "2021-10-01",
                    "endDate": "2022-01-01",
                    "accountType": ["Student", "Tutor", "Parent"],
                    "educationLevel": ["K-12"],
                },
            },
        )

        self.assertGreaterEqual(len(str(response.get_json())), 2)  # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK


if __name__ == "__main__":
    unittest.main()
