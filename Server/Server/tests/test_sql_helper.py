import unittest
from Server import create_app
from Server.queries.sql_helper import read_sql_from_queries


class Test_test_sql_helper(unittest.TestCase):
    def test_reading_sql_from_queries_folder(self):
        app = create_app()
        with app.app_context():
            content = read_sql_from_queries('test_query')
            self.assertEqual(content, "select user.hearAboutUsDropdown  as 'category' , count(*) as 'signups' from `user` group by user.hearAboutUsDropdown order by count(*) desc")

if __name__ == '__main__':
    unittest.main()
