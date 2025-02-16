# Dokumentation zu Unit-Tests

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

## Überblick über die Unit-Tests
### `unittest_validateImage.py`
Diese Datei enthält Unit-Tests zur Validierung von Bildern. Sie stellt sicher, dass die Bildverarbeitungslogik den erwarteten Standards entspricht.

### `test_integration.py`
Diese Datei enthält Integrationstests, die die Interaktion zwischen verschiedenen Komponenten des Backends überprüfen.


# Testanleitung: Unit-Test für validateImage

## Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Hauptverzeichnis des Projekts (`FARM2`):**
   ```bash
   cd /FARM2
   ```

2. **Führen Sie den Test aus:**
   ```bash
   python -m unittest backend.tests.unittest_validateImage
   ```

## Ergebnis
- Wenn alles korrekt eingerichtet ist, sollten alle Tests erfolgreich ausgeführt werden.
- Beispielausgabe:
  ```plaintext
  Connected to the database successfully!
  ....
  ----------------------------------------------------------------------
  Ran 4 tests in 0.301s

  OK
  ```

# Testanleitung: Integrationstest für /upload-Endpoint

## Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Backend-Verzeichnis des Projekts:**
   ```bash
   cd /FARM2/backend
   ```

2. **Führen Sie die Integrationstests aus:**
   ```bash
   python -m unittest discover backend/tests
   ```

## Ergebnis
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

# Testanleitung: Selenium-Tests


Die Selenium-Tests in diesem Projekt basieren auf ***Behavior-Driven Development (BDD)*** und werden mit behave ausgeführt. Sie testen insbesondere das Frontend-Verhalten und stellen sicher, dass Benutzeraktionen wie das Erstellen eines Posts ordnungsgemäß funktionieren.


### Voraussetzungen


1. Google Chrome:

Da die Tests ```webdriver_manager``` verwenden, wird der ChromeDriver automatisch heruntergeladen. Dennoch muss lokal Google Chrome installiert sein.

2. Python-Abhängigkeiten

Stelle sicher, dass alle benötigten Bibliotheken installiert sind. Zum Beispiel:

```bash
pip install -r requirements.txt
```

3. Laufende Anwendung

Die Selenium-Tests greifen auf deine laufende Anwendung (z. B. http://localhost:3000) zu. Stelle sicher, dass der entsprechende Server/Service während der Tests gestartet ist.


### Schritt zum Ausführen der Tests

Für Behavior-Driven Tests (im Verzeichnis `behave`) verwenden Sie:

```bash
behave
````


