import unittest
import sys
import os
from flask import Flask
from unittest.mock import MagicMock, patch
from io import BytesIO

# Create a mock Flask app for testing
app = Flask(__name__)

class TestBackendAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_home_endpoint(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    @patch('flask.request')
    def test_login_endpoint(self, mock_request):
        mock_request.json = {
            "username": "test_user",
            "password": "test_password"
        }
        response = self.app.post('/login', json=mock_request.json)
        self.assertIn(response.status_code, [200, 401])

    def test_upload_endpoint(self):
        # Test file upload with a mock file
        mock_file = (BytesIO(b"test file content"), 'test.jpg')
        response = self.app.post('/upload', 
                               data={'file': mock_file},
                               content_type='multipart/form-data')
        self.assertIn(response.status_code, [200, 401])

if __name__ == '__main__':
    unittest.main()
