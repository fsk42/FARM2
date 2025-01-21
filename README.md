# Software Engineering

Raka Adita, Abdulaziz al-Surabi, Felix Hartmann, Niklas Denz, Mehmet Karaca

## Projektübersicht

Dieses Projekt besteht aus einem Backend und einem Frontend, die zusammenarbeiten, um Instagram-Posts zu planen und hochzuladen.

## Backend

Das Backend ist in Python mit Flask und verwendet PostgreSQL als Datenbank.

### Installation

1. Erstelle und aktiviere eine virtuelle Umgebung:
    ```sh
    python -m venv venv
    source venv/bin/activate  # Auf Windows: venv\Scripts\activate
    ```

2. Installiere die Abhängigkeiten:
    ```sh
    pip install -r requirements.txt
    ```

3. Erstelle die Datenbank und die Tabelle:
    ```sql
    CREATE TABLE scheduled_posts (
        id SERIAL PRIMARY KEY,
        post_type VARCHAR(50) NOT NULL,
        caption TEXT NOT NULL,
        hashtags TEXT NOT NULL,
        media_path TEXT NOT NULL,
        scheduled_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'pending'
    );
    ```

4. Starte den Flask-Server:
    ```sh
    python main.py
    ```

### Endpunkte

- `POST /upload`: Hochladen eines neuen Posts.
- `GET /scheduled_posts`: Abrufen aller geplanten Posts.
- `DELETE /delete_scheduled_post/<int:post_id>`: Löschen eines geplanten Posts.

### Beispielanfragen

#### Hochladen eines neuen Posts
```sh
curl -X POST -F "post_type=image" -F "caption=Test Caption" -F "hashtags=#test" -F "media=@/path/to/image.jpg" http://127.0.0.1:5000/upload
```

## Frontend

Das Frontend ist mit React erstellt.

### Installation

1. Navigiere in das [frontend](http://_vscodecontentref_/0) Verzeichnis:
    ```sh
    cd frontend
    ```

2. Installiere die Abhängigkeiten:
    ```sh
    npm install
    ```

3. Starte die Entwicklungsumgebung:
    ```sh
    npm start
    ```

### Verfügbare Skripte

- [npm start](http://_vscodecontentref_/1): Startet die Entwicklungsumgebung.
- [npm test](http://_vscodecontentref_/2): Führt die Tests aus.
- `npm run build`: Erstellt das Produktions-Build.
- `npm run eject`: Ejects the Create React App configuration.

## Nutzung

1. Öffne das Frontend im Browser unter [http://localhost:3000](http://localhost:3000).
2. Lade einen neuen Post hoch oder plane einen Post für die Zukunft.
3. Verwalte geplante Posts über die Kalenderansicht.

## Weitere Informationen

- [Create React App Dokumentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Dokumentation](https://reactjs.org/)
- [Flask Dokumentation](https://flask.palletsprojects.com/)
- [FastAPI Dokumentation](https://fastapi.tiangolo.com/)