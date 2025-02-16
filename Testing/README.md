# Einheitstests

Dieses Verzeichnis enthält Unit-Tests für Frontend- und Backend-Komponenten des FARM2-Projekts.

## Backend-Tests

Um die Backend-Tests auszuführen, müssen Sie zunächst die erforderlichen Abhängigkeiten installieren:
```bash
pip install pytest fastapi pytest-asyncio httpx
```

Führen Sie die Tests dann mit folgendem Befehl aus:
```bash
python -m pytest test_backend.py -v
```

## Frontend-Tests

Um die Frontend-Tests auszuführen, stellen Sie sicher, dass alle Abhängigkeiten installiert sind:
```bash
cd ../frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

Führen Sie die Tests dann mit:
```bash
npm test
```

## Testabdeckung

- Backend-Tests decken ab:
  - Root-Endpunkt
  - Login-Funktionalität
  - Dateiupload-Funktionalität

- Frontend-Tests decken ab:
  - Rendering der Haupt-App-Komponente
  - Funktionalität des Login-Formulars
  - API-Integration
