import unittest
from main import app

class NikeSneakersAppTestCase(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_home_page_status_code(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)

    def test_home_page_content(self):
        response = self.client.get('/')
        self.assertIn(b'NIKE Sneakers', response.data)
        self.assertIn(b'Step into the future of style and performance.', response.data)
