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
        response = self._client.get(
            "/signupDashboard/signupsByCategory",
            json={
                "startDate": "2021-10-01",
                "endDate": "2022-01-01",
                "categories": ["Physical Advertising", "Friend Referral"],
            },
        )
        self.assertGreaterEqual(len(str(response.get_json())), 2) # At minimum "[]"
        self.assertEqual(response.status_code, 200)  # OK


if __name__ == "__main__":
    unittest.main()
