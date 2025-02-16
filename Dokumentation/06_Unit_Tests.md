# Dokumentation zu Unit-Tests Felix Hartmann

## Verzeichnisstruktur
Der Ordner `backend/tests` enthält die folgenden Dateien und Verzeichnisse:

### Dateien:
- **`__init__.py`**: Initialisierungsdatei für das `tests`-Paket.
- **`readme.md`**: Allgemeine Dokumentation für den Tests-Ordner.
- **`test_integration.py`**: Integrationstests für die Backend-Funktionalität.
- **`unittest_validateImage.py`**: Unit-Tests für die Bildvalidierungslogik.

### Verzeichnisse:
- **`__pycache__`**: Enthält kompilierten Python-Bytecode zur schnelleren Ausführung.
- **`behave`**: Behavior-Driven Development (BDD)-Tests.
- **`selenium_helpers`**: Hilfsprogramme für Selenium-basierte Tests.

## Überblick über die Tests
### Unittest
Diese Datei enthält Unit-Tests zur Validierung von Bildern. Sie stellt sicher, dass die Bildverarbeitungslogik den erwarteten Standards entspricht.

### Integrationstest
Diese Datei enthält Integrationstests, die die Interaktion zwischen verschiedenen Komponenten des Backends überprüfen.

### Automatischer Akzeptanztest
Diese Tests simulieren den kompletten Benutzer-Workflow, indem sie über die Benutzeroberfläche einen Post erstellen. Mithilfe von Selenium und behave wird überprüft, ob alle Schritte – von der Navigation zur Post-Erstellungsseite bis zum erfolgreichen Upload – korrekt ausgeführt werden.

## Unit-Test (validateImage) 
Der Unit-Test überprüft die Funktion validateImage in verschiedenen Szenarien, um sicherzustellen, dass sie wie erwartet funktioniert:

- Gültiges Bild:
Ein Bild mit korrekter Dateigröße (4 MB) und einem erlaubten Format (z.B. JPG) wird geprüft. Der Test erwartet, dass validateImage in diesem Fall True zurückgibt.
- Zu große Bilddatei:
Ein Bild, das die maximale erlaubte Dateigröße überschreitet (hier 6 MB), soll einen ValueError mit einer entsprechenden Fehlermeldung ("Datei ist zu groß") auslösen.
- Ungültiges Bildformat:
Ein Bild mit einem nicht erlaubten Format (z.B. BMP) wird getestet. Der Test erwartet, dass in diesem Fall ein ValueError mit der Meldung "Ungültiges Format" ausgelöst wird.
- Nicht vorhandene Datei:
Wird eine Datei übergeben, die nicht existiert, so soll validateImage ebenfalls einen ValueError mit einer Meldung, die darauf hinweist, dass die Datei nicht gefunden wurde, werfen.

## Testanleitung: Unit-Test für validateImage

### Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Hauptverzeichnis des Projekts (INSTA_PROGRAM):**
   ```bash
   cd /angepassterFilepath/Insta_Program
   ```

2. **Führen Sie den Test aus:**
   ```bash
   python -m unittest backend.tests.unittest_validateImage
   ```

### Ergebnis
- Wenn alles korrekt eingerichtet ist, sollten alle Tests erfolgreich ausgeführt werden.
- Beispielausgabe:
  ```plaintext
  Connected to the database successfully!
  ....
  ----------------------------------------------------------------------
  Ran 4 tests in 0.301s

  OK
  ```
# InteIntegrationstest für /upload-Endpoint

Der Integrationstest überprüft den kompletten Upload-Prozess des /upload-Endpoints in der Flask-Anwendung. Dabei wird sichergestellt, dass der Endpoint in unterschiedlichen Szenarien korrekt funktioniert:

- Erfolgreicher Bild-Upload (test_image_upload_success):
   - Simulierter Upload: Ein gültiges Bild mit allen erforderlichen Parametern (wie post_type, caption, hashtags und der Datei unter media) wird über einen POST-Request an den /upload-Endpoint gesendet.
   - Mock des Instagram-Clients: Die Methode photo_upload des Instagram-Clients (cl) wird gemockt, sodass kein tatsächlicher Upload stattfindet.
   - Überprüfung: Der Test stellt sicher, dass der    Response den HTTP-Status 200 liefert und die Erfolgsmeldung "Post uploaded successfully!" enthält. Außerdem wird geprüft, dass die Methode photo_upload genau einmal aufgerufen wurde.
- Fehlgeschlagener Upload bei ungültigem Format (test_image_upload_invalid_format):
   - Simulierter fehlerhafter Upload: Es wird ein POST-Request gesendet, der eine Datei in einem ungültigen Format (z.B. .txt) übergibt.
   - Erwartetes Verhalten: Der Endpoint soll in diesem Fall mit einem HTTP-Status 400 reagieren und eine Fehlermeldung, beispielsweise "Ungueltiges Format", zurückliefern.
   - Mock-Prüfung: Es wird überprüft, dass der Instagram-Client in diesem Szenario nicht zum Upload aufgerufen wird.
Zusätzliche Hinweise zum Setup:

- Temporärer Ordner: Vor den Tests wird in der setUpClass-Methode sichergestellt, dass ein Ordner ./temp existiert. Dieser wird für temporäre Dateien genutzt.
- Flask-Testclient: In der setUp-Methode wird ein Flask-Testclient erstellt, um HTTP-Requests an die Anwendung zu senden.
- Mocking: Mithilfe von unittest.mock.patch wird der globale Instagram-Client (cl in main.py) gemockt, um zu verhindern, dass echte Uploads stattfinden.

## Testanleitung: Integrationstest für /upload-Endpoint

### Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Backend-Verzeichnis des Projekts:**
   ```bash
   cd backend
   ```

2. **Führen Sie die Integrationstests aus:**
   ```bash
   python -m unittest discover backend/tests
   ```

### Ergebnis
- Wenn alles korrekt eingerichtet ist, sollten alle Tests erfolgreich ausgeführt werden.
- Beispielausgabe:
  ```
   Logged in successfully!
   Connected to the database successfully!
   Erstelle ./temp für Integrationstests (falls nicht vorhanden).
   ..
   ----------------------------------------------------------------------
   Ran 2 tests in 0.560s

   OK

  ```
# Automatischer Akzeptanztest mit Selenium 

Der Integrationstest überprüft den kompletten Upload-Prozess des /upload-Endpoints der Flask-Anwendung in unterschiedlichen Szenarien:

- Erfolgreicher Bild-Upload:
Ein gültiges Bild wird zusammen mit den erforderlichen Parametern (wie post_type, caption, hashtags und der Datei unter media) via POST-Request hochgeladen.

   Erwartungen:
   - HTTP-Status 200
   - Antwort enthält die Nachricht "Post uploaded successfully!"
   - Die Instagram-API-Methode (photo_upload) wird genau einmal aufgerufen (mittels Mocking).
- Upload mit ungültigem Dateiformat:
Wird ein Bild in einem nicht erlaubten Format (z.B. .txt) hochgeladen, soll der Endpoint den Upload ablehnen.
   Erwartungen:
   - HTTP-Status 400
   - Antwort enthält eine Fehlermeldung, z. B. "Ungueltiges Format"
   - Die Instagram-API wird in diesem Fall nicht aufgerufen.

## Testanleitung: Automatischer Akzeptanztest mit Selenium 

### Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Backend-Verzeichnis des Projekts:**
   ```bash
   cd backend
   ```

2. **Führen Sie die main.py aus:**
   ```bash
   python main.py
   ```

3. **Öffnen Sie ein weiteres Terminal und Sie in das Frontend-Verzeichnis:**
   ```bash
   cd frontend
   ```
4. **Starten Sie das Frontend:**
   ```bash
   npm install
   npm start
   ```

5. **Öffnen Sie ein drittes Terminal, wechseln Sie in das behave-Verzeichnis und Starten Sie die Selenium Tests:**
   ```bash
   cd backend/tests/behave
   behave
   ```

### Ergebnis
- Wenn alles korrekt eingerichtet ist, sollten alle Tests erfolgreich ausgeführt werden.
- Beispielausgabe:
  ```
   Temp folder created or already exists.
   Starting test suite...
   Feature: User Post Creation # features/login.feature:1

   Scenario: User uploads a post successfully      # features/login.feature:3
      Given I am on the post creation page          # features/steps/login_steps.py:12 35.437s
      When I select "image" as the post type        # features/steps/login_steps.py:17 0.213s
      And I enter "Test Caption" as the caption     # features/steps/login_steps.py:22 0.091s
      And I enter "#selenium #test" as the hashtags # features/steps/login_steps.py:27 0.070s
      And I upload a file "test_image.jpg"          # features/steps/login_steps.py:32 0.050s
      And I click the upload button                 # features/steps/login_steps.py:49 0.126s
      Then I should see a success message           # features/steps/login_steps.py:54 12.887s

   Test suite complete.
   1 feature passed, 0 failed, 0 skipped
   1 scenario passed, 0 failed, 0 skipped
   7 steps passed, 0 failed, 0 skipped, 0 undefined
   Took 0m48.874s

  ```
