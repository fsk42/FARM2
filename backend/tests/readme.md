# Testanleitung: Unit-Test für validateImage

## Schritte zum Ausführen der Tests

1. **Wechseln Sie in das Hauptverzeichnis des Projekts (INSTA_PROGRAM):**
   ```bash
   cd /Users/student/Documents/Repos/Insta_Program
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
   cd /Users/student/Documents/Repos/Insta_Program/backend
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

