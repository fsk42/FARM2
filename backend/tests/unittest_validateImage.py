import unittest
import os
from unittest.mock import patch
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from main import validateImage

class TestValidateImage(unittest.TestCase):

    def setUp(self):
        """
        Bereite Testdateien vor, die für die Tests verwendet werden.
        """
        # Erstelle Testbilder mit verschiedenen Eigenschaften
        self.valid_image_path = "test_valid.jpg"
        self.invalid_size_image_path = "test_large.jpg"
        self.invalid_format_image_path = "test_invalid.bmp"

        # Erstellt eine gültige Testdatei (klein und im richtigen Format)
        with open(self.valid_image_path, "wb") as f:
            f.write(os.urandom(1024 * 1024 * 4))  # 4 MB

        # Erstellt eine große Testdatei (> 5 MB)
        with open(self.invalid_size_image_path, "wb") as f:
            f.write(os.urandom(1024 * 1024 * 6))  # 6 MB

        # Erstellt eine Testdatei mit ungültigem Format
        with open(self.invalid_format_image_path, "wb") as f:
            f.write(os.urandom(1024 * 1024 * 1))  # 1 MB

    def tearDown(self):
        """
        Entferne die Testdateien nach den Tests.
        """
        for file_path in [self.valid_image_path, self.invalid_size_image_path, self.invalid_format_image_path]:
            if os.path.exists(file_path):
                os.remove(file_path)

    def test_valid_image(self):
        """
        Teste, ob ein gültiges Bild erfolgreich validiert wird.
        """
        self.assertTrue(validateImage(self.valid_image_path))

    def test_invalid_size_image(self):
        """
        Teste, ob eine zu große Datei einen ValueError auslöst.
        """
        with self.assertRaises(ValueError) as context:
            validateImage(self.invalid_size_image_path)
        self.assertIn("Datei ist zu groß", str(context.exception))

    def test_invalid_format_image(self):
        """
        Teste, ob eine Datei mit ungültigem Format einen ValueError auslöst.
        """
        with self.assertRaises(ValueError) as context:
            validateImage(self.invalid_format_image_path)
        self.assertIn("Ungültiges Format", str(context.exception))

    def test_nonexistent_file(self):
        """
        Teste, ob eine nicht vorhandene Datei einen ValueError auslöst.
        """
        with self.assertRaises(ValueError) as context:
            validateImage("nonexistent.jpg")
        self.assertIn("wurde nicht gefunden", str(context.exception))

if __name__ == "__main__":
    # Mock für cl.load_settings
    with patch("main.Client.load_settings") as mock_load_settings:
        mock_load_settings.return_value = None  # Kein Effekt
        unittest.main()
