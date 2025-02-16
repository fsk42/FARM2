import os
import unittest
from unittest.mock import patch, MagicMock
import sys

# 1) Optional: Den Pfad anpassen, damit Python 'main.py' findet.
#    Wenn du von "Insta_Program/backend" aus startest (z.B. `python -m unittest discover tests`),
#    reicht oft ein einfacher:
#
# from main import app
#
# 2) Oder du machst es mit einem relativen Import, wenn du die __init__.py -Dateien hast:
#
# from ..main import app
#
# Wähle EINE Variante, je nachdem, wie du startest.

from main import app  # <--- Variante 1 (funktioniert, wenn du die Tests innerhalb von backend startest)

class TestIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """
        Wird einmal vor allen Tests ausgeführt.
        Hier stellen wir sicher, dass der ./temp-Ordner existiert.
        """
        print("Erstelle ./temp für Integrationstests (falls nicht vorhanden).")
        os.makedirs("./temp", exist_ok=True)

    def setUp(self):
        """
        Wird vor jedem Test ausgeführt.
         - Wir erstellen einen Flask-Testclient
         - Wir patchen den Instagram-Client (cl) in main.py
        """
        self.client = app.test_client()

        # Patchen des globalen 'cl' in 'main.py', damit kein echter Upload erfolgt:
        patcher = patch('main.cl', autospec=True)
        self.mock_cl = patcher.start()
        self.addCleanup(patcher.stop)  # Stellt sicher, dass der Patch am Testende aufgehoben wird

    def test_image_upload_success(self):
        """
        Testet, ob ein Bild erfolgreich hochgeladen wird, wenn alle Parameter korrekt sind.
        Wir mocken die Instagram photo_upload-Methode, damit kein echter Upload stattfindet.
        """
        # Das Verhalten der gemockten Methode definieren:
        self.mock_cl.photo_upload.return_value = True

        # Pfad zum Testbild (relativer Pfad zu diesem Testskript)
        test_image_path = os.path.join(
            os.path.dirname(__file__),
            "behave",
            "test_files",
            "test_image.jpg"
        )

        # Daten für den Multipart-Form-Request
        data = {
            "post_type": "image",
            "caption": "Test Caption",
            "hashtags": "#dhbw #integrationtest",
            "scheduled_time": ""  # Leer bedeutet: direkt hochladen, nicht schedulen
        }

        # Bilddatei öffnen und an 'media' anhängen
        with open(test_image_path, "rb") as img:
            data["media"] = (img, "test_image.jpg")

            # POST-Request an das /upload-Endpoint
            response = self.client.post(
                "/upload",
                data=data,
                content_type="multipart/form-data"
            )

        # Überprüfen, ob Upload erfolgreich war
        self.assertEqual(response.status_code, 200, f"Unerwarteter Statuscode: {response.status_code}")
        self.assertIn("Post uploaded successfully!", response.get_data(as_text=True))

        # Sicherstellen, dass Instagram API (photo_upload) aufgerufen wurde:
        self.mock_cl.photo_upload.assert_called_once()

    def test_image_upload_invalid_format(self):
        """
        Testet, ob bei einem ungültigen Dateiformat ein Fehler (400) zurückkommt.
        """
        # Dummy-File-Pfad, hier könnte z.B. .txt hochgeladen werden
        # (soll bei validateImage fehlschlagen)
        fake_file_path = os.path.join(
            os.path.dirname(__file__),
            "behave",
            "test_files",
            "fake_file.txt"
        )
        # Leg dir dafür ggf. eine fake_file.txt an oder ändere den Namen entsprechend

        data = {
            "post_type": "image",
            "caption": "Test with invalid format",
            "hashtags": "#fakeformat"
        }

        with open(fake_file_path, "rb") as fake:
            data["media"] = (fake, "fake_file.txt")

            response = self.client.post(
                "/upload",
                data=data,
                content_type="multipart/form-data"
            )

        # Bei ungültigem Format erwarten wir HTTP 400:
        self.assertEqual(response.status_code, 400)
        self.assertIn("Ungueltiges Format", response.get_data(as_text=True))

        # Die Instagram-API sollte in diesem Fall nie aufgerufen werden:
        self.mock_cl.photo_upload.assert_not_called()


if __name__ == "__main__":
    unittest.main()
