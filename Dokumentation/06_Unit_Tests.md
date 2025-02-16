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

## Ausführung der Tests
Um die Unit-Tests auszuführen, navigieren Sie in das Verzeichnis `backend/tests` und führen Sie folgenden Befehl aus:

```bash
python -m unittest discover
```

Für Behavior-Driven Tests (im Verzeichnis `behave`) verwenden Sie:

```bash
behave