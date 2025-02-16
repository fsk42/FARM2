# Backend-Dokumentation: Instagram Post Scheduler

Die Backend-Implementierung des Instagram Post Schedulers bildet das Fundament der Anwendung und ist verantwortlich für die Verarbeitung von Medieninhalten, die Kommunikation mit der Instagram-API sowie die zuverlässige Planung und Ausführung von Posts. Im Folgenden wird die technische Umsetzung des Backends detailliert beschrieben.

## Technologische Grundlagen

Das Backend basiert auf einer modernen Python-Stack-Architektur mit folgenden Hauptkomponenten:

- Flask als Web-Framework für die API-Implementierung
- PostgreSQL als robuste, relationale Datenbank
- SQLAlchemy als Object-Relational Mapper (ORM)
- APScheduler für die zeitgesteuerte Ausführung von Posts
- Instagrapi für die Instagram-API-Integration

Diese Technologien wurden gewählt, da sie eine optimale Balance zwischen Entwicklungsgeschwindigkeit, Wartbarkeit und Skalierbarkeit bieten.

## Systemarchitektur

### API-Layer

Das Backend exponiert mehrere RESTful Endpunkte:

1. Upload-Endpunkt (/upload):
   - Verarbeitet POST-Anfragen mit Multipart-Formulardaten
   - Validiert eingehende Mediendateien
   - Speichert Medien temporär und plant Posts

2. Scheduling-Endpunkt (/scheduled_posts):
   - Liefert eine Liste aller geplanten Posts
   - Ermöglicht die Verwaltung des Posting-Zeitplans

3. Lösch-Endpunkt (/delete_scheduled_post/<id>):
   - Ermöglicht das Entfernen geplanter Posts
   - Bereinigt zugehörige Mediendateien

### Datenbank-Layer

Die PostgreSQL-Datenbank speichert alle relevanten Informationen zu geplanten Posts:

```sql
CREATE TABLE scheduled_posts (
    id SERIAL PRIMARY KEY,
    post_type VARCHAR(50) NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT NOT NULL,
    media_path TEXT NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
);
```

Die Tabellenstruktur wurde so konzipiert, dass sie:
- Alle notwendigen Metadaten für Posts speichert
- Den Status der Verarbeitung nachverfolgt
- Fehlerinformationen protokolliert

### Scheduler-Komponente

Der APScheduler übernimmt die zeitgesteuerte Ausführung von Posts:

- Regelmäßige Überprüfung anstehender Posts (alle 2 Minuten)
- Automatische Veröffentlichung zum geplanten Zeitpunkt
- Fehlerbehandlung und Statusaktualisierung
- Cleanup von temporären Dateien

## Implementierungsdetails

### Medienverarbeitung

Die Verarbeitung von Mediendateien erfolgt in mehreren Schritten:

1. Validierung:
   - Überprüfung der Dateitypen (JPEG, PNG, WEBP für Bilder; MP4 für Videos)
   - Größenvalidierung
   - Formatüberprüfung

2. Speicherung:
   - Generierung eindeutiger Dateinamen
   - Temporäre Speicherung im filesystem
   - Automatische Bereinigung nach Verarbeitung

### Instagram-Integration

Die Integration mit Instagram erfolgt über die Instagrapi-Bibliothek:

- Sichere Authentifizierung über Zugangsdaten
- Unterstützung verschiedener Medientypen
- Fehlerbehandlung bei API-Limits
- Automatische Wiederholung bei temporären Fehlern

### Fehlerbehandlung

Das Backend implementiert eine mehrschichtige Fehlerbehandlung:

1. API-Ebene:
   - Validierung von Eingabedaten
   - HTTP-Statuscode-basierte Fehlerrückmeldungen
   - Detaillierte Fehlermeldungen für Frontend-Integration

2. Verarbeitungsebene:
   - Try-Catch-Blöcke für kritische Operationen
   - Logging von Fehlern
   - Statusaktualisierung in der Datenbank

3. Scheduler-Ebene:
   - Überwachung der Post-Ausführung
   - Fehlerprotokollierung
   - Automatische Wiederholungsversuche

## Sicherheitsaspekte

Die Implementierung berücksichtigt verschiedene Sicherheitsaspekte:

1. Datensicherheit:
   - Sichere Speicherung von Zugangsdaten
   - Verschlüsselte Datenbankverbindung
   - Validierung aller Eingaben

2. Zugriffskontrolle:
   - CORS-Konfiguration
   - Rate-Limiting
   - Dateityp-Beschränkungen

3. Fehlerprävention:
   - Transaktionsmanagement
   - Atomare Operationen
   - Ressourcen-Cleanup

## Performance-Optimierung

Zur Optimierung der Performance wurden verschiedene Maßnahmen implementiert:

1. Datenbankoptimierung:
   - Indexierung häufig abgefragter Felder
   - Prepared Statements
   - Connection Pooling

2. Ressourcenmanagement:
   - Effiziente Medienverarbeitung
   - Automatische Bereinigung temporärer Dateien
   - Optimierte Scheduler-Intervalle

3. Caching:
   - In-Memory-Caching häufiger Abfragen
   - Optimierte Datenbankabfragen
   - Effiziente Statusverwaltung

## Wartung und Monitoring

Das Backend bietet verschiedene Mechanismen zur Überwachung und Wartung:

1. Logging:
   - Detaillierte Fehlerprotokolle
   - Aktivitätsüberwachung
   - Performance-Metriken

2. Monitoring:
   - Status der Scheduler-Prozesse
   - Datenbankauslastung
   - API-Performance

3. Wartungsroutinen:
   - Automatische Bereinigung alter Daten
   - Regelmäßige Statusüberprüfungen
   - Systemgesundheitschecks

## Erweiterbarkeit

Die Backend-Architektur wurde mit Blick auf zukünftige Erweiterungen entwickelt:

1. Neue Funktionen:
   - Einfache Integration weiterer Social-Media-Plattformen
   - Erweiterung um Analytics-Funktionen
   - Implementierung von Benutzerrollen

2. Skalierung:
   - Horizontale Skalierbarkeit
   - Lastverteilung
   - Microservices-Vorbereitung

3. Integration:
   - Standardisierte API-Schnittstellen
   - Modulare Komponenten
   - Erweiterbare Datenmodelle

## 1. Systemarchitektur und Technologie-Stack

### 1.1 Technologische Grundlagen

Das Backend basiert auf einer modernen Python-Stack-Architektur und verwendet folgende Technologien:

#### Core-Technologien:
- Python 3.9+ als Programmiersprache
- Flask 3.1.0 als Web-Framework
- PostgreSQL als Datenbanksystem
- APScheduler 3.11.0 für Task-Scheduling
- Instagrapi 2.1.3 für Instagram-Integration

#### Zusätzliche Bibliotheken:
- Flask-CORS 5.0.0 für Cross-Origin Resource Sharing
- Psycopg2-binary 2.9.10 für PostgreSQL-Verbindungen
- Python-dotenv 1.0.1 für Umgebungsvariablen
- Pillow 10.4.0 für Bildverarbeitung
- Moviepy 1.0.3 für Videobearbeitung

Die Wahl dieser Technologien basiert auf folgenden Überlegungen:
- Flask bietet eine leichtgewichtige, aber leistungsfähige Basis für REST-APIs
- PostgreSQL gewährleistet ACID-Konformität und robuste Datenpersistenz
- APScheduler ermöglicht flexibles und zuverlässiges Task-Scheduling
- Instagrapi bietet eine stabile und gut dokumentierte Instagram-API-Integration

### 1.2 Systemkomponenten

Das Backend gliedert sich in folgende Hauptkomponenten:

1. **API-Server**:
   - RESTful Endpunkte für Client-Kommunikation
   - Request/Response-Handling
   - Validierung und Fehlerbehandlung

2. **Medienverarbeitung**:
   - Upload-Handler für Bilder und Videos
   - Format-Konvertierung und Optimierung
   - Temporäre Dateiverwaltung

3. **Scheduler-System**:
   - Job-Verwaltung für geplante Posts
   - Ausführungsüberwachung
   - Fehlerbehandlung und Wiederholungslogik

4. **Datenbank-Layer**:
   - Datenpersistenz
   - Transaktionsmanagement
   - Status-Tracking

## 2. API-Implementierung

### 2.1 Endpunkt-Spezifikationen

#### Upload-Endpunkt (/upload)
```python
@app.route("/upload", methods=["POST"])
def upload_post():
    """
    Verarbeitet POST-Anfragen für neue Posts.
    
    Request-Format:
    - multipart/form-data
    - Felder: post_type, caption, hashtags, media, scheduled_time
    
    Response:
    - 200: Erfolgreicher Upload
    - 400: Ungültige Eingabedaten
    - 500: Serverfehler
    """
```

#### Scheduling-Endpunkt (/scheduled_posts)
```python
@app.route("/scheduled_posts", methods=["GET"])
def get_scheduled_posts():
    """
    Liefert alle geplanten Posts.
    
    Response-Format:
    {
        "id": int,
        "post_type": str,
        "caption": str,
        "hashtags": str,
        "media_path": str,
        "scheduled_time": datetime,
        "status": str
    }
    """
```

#### Lösch-Endpunkt (/delete_scheduled_post/<id>)
```python
@app.route("/delete_scheduled_post/<int:post_id>", methods=["DELETE"])
def delete_scheduled_post(post_id):
    """
    Löscht einen geplanten Post.
    
    Parameter:
    - post_id: ID des zu löschenden Posts
    
    Response:
    - 200: Erfolgreich gelöscht
    - 404: Post nicht gefunden
    - 500: Serverfehler
    """
```

### 2.2 Datenvalidierung

Die Eingabevalidierung erfolgt in mehreren Schichten:

1. **Request-Validierung**:
```python
def validate_post_request(request):
    required_fields = ['post_type', 'caption', 'hashtags']
    for field in required_fields:
        if field not in request.form:
            raise ValidationError(f"Missing required field: {field}")
```

2. **Medienvalidierung**:
```python
def validate_media_file(file):
    allowed_image_types = {'image/jpeg', 'image/png', 'image/webp'}
    allowed_video_types = {'video/mp4'}
    if file.content_type not in (allowed_image_types | allowed_video_types):
        raise ValidationError("Unsupported media type")
```

3. **Zeitplan-Validierung**:
```python
def validate_schedule_time(scheduled_time):
    if scheduled_time:
        scheduled_dt = datetime.fromisoformat(scheduled_time)
        if scheduled_dt <= datetime.now():
            raise ValidationError("Scheduled time must be in the future")
```

## 3. Datenbankdesign und Implementierung

### 3.1 Datenbankschema

```sql
CREATE TABLE scheduled_posts (
    id SERIAL PRIMARY KEY,
    post_type VARCHAR(50) NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT NOT NULL,
    media_path TEXT NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    retry_count INTEGER DEFAULT 0
);

CREATE INDEX idx_scheduled_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_status ON scheduled_posts(status);
```

### 3.2 Datenbankoperationen

#### Post-Erstellung:
```python
def create_scheduled_post(post_data):
    with db_connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO scheduled_posts 
            (post_type, caption, hashtags, media_path, scheduled_time)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            post_data['post_type'],
            post_data['caption'],
            post_data['hashtags'],
            post_data['media_path'],
            post_data['scheduled_time']
        ))
        db_connection.commit()
        return cursor.fetchone()[0]
```

#### Status-Aktualisierung:
```python
def update_post_status(post_id, status, error_message=None):
    with db_connection.cursor() as cursor:
        cursor.execute("""
            UPDATE scheduled_posts 
            SET status = %s, 
                error_message = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
        """, (status, error_message, post_id))
        db_connection.commit()
```

## 4. Scheduler-Implementierung

### 4.1 Job-Konfiguration

```python
scheduler = BackgroundScheduler()
scheduler.add_job(
    upload_scheduled_posts,
    'interval',
    minutes=2,
    id='post_scheduler',
    replace_existing=True
)
```

### 4.2 Post-Verarbeitung

```python
def upload_scheduled_posts():
    """
    Hauptfunktion für die Verarbeitung geplanter Posts.
    - Lädt fällige Posts
    - Verarbeitet jeden Post
    - Aktualisiert Status
    - Behandelt Fehler
    """
    try:
        with db_connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM scheduled_posts 
                WHERE scheduled_time <= NOW() 
                AND status = 'pending'
                FOR UPDATE SKIP LOCKED
            """)
            posts = cursor.fetchall()

        for post in posts:
            process_scheduled_post(post)
    except Exception as e:
        logger.error(f"Error in scheduler: {str(e)}")
```

## 5. Fehlerbehandlung und Logging

### 5.1 Logging-Konfiguration

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)
```

### 5.2 Fehlerbehandlungsstrategien

1. **API-Fehler**:
```python
@app.errorhandler(Exception)
def handle_error(error):
    logger.error(f"Unhandled error: {str(error)}")
    return jsonify({
        "status": "error",
        "message": "An internal error occurred"
    }), 500
```

2. **Instagram-API-Fehler**:
```python
def handle_instagram_upload(post):
    try:
        if post["post_type"] == "image":
            cl.photo_upload(post["media_path"], post["caption"])
        elif post["post_type"] == "video":
            cl.video_upload(post["media_path"], post["caption"])
    except Exception as e:
        logger.error(f"Instagram upload failed: {str(e)}")
        raise InstagramUploadError(str(e))
```

## 6. Sicherheitsimplementierung

### 6.1 CORS-Konfiguration

```python
CORS(app, resources={
    r"/*": {
        "origins": os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
        "methods": ["GET", "POST", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### 6.2 Dateisystem-Sicherheit

```python
def secure_filename(filename):
    """Generiert einen sicheren Dateinamen"""
    base = uuid.uuid4().hex
    ext = os.path.splitext(filename)[1].lower()
    return f"{base}{ext}"

def validate_file_path(path):
    """Überprüft Pfade auf Directory Traversal"""
    return os.path.abspath(path).startswith(
        os.path.abspath(app.config["UPLOAD_FOLDER"])
    )
```

## 7. Performance-Optimierung

### 7.1 Datenbankoptimierung

```sql
-- Indexe für häufige Abfragen
CREATE INDEX idx_scheduled_time_status ON scheduled_posts(scheduled_time, status);
CREATE INDEX idx_status_updated_at ON scheduled_posts(status, updated_at);

-- Partitionierung für große Datenmengen
CREATE TABLE scheduled_posts_partition OF scheduled_posts
PARTITION BY RANGE (scheduled_time);
```

### 7.2 Caching-Strategien

```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_post_metadata(post_id):
    """Cached Abruf von Post-Metadaten"""
    with db_connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM scheduled_posts WHERE id = %s",
            (post_id,)
        )
        return cursor.fetchone()
```

## 8. Monitoring und Wartung

### 8.1 Health-Check-Endpunkt

```python
@app.route("/health", methods=["GET"])
def health_check():
    """
    Überprüft den Systemstatus
    - Datenbankverbindung
    - Instagram-API-Verbindung
    - Scheduler-Status
    """
    try:
        # Datenbankcheck
        with db_connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        
        # Instagram-Check
        cl.get_timeline_feed()
        
        # Scheduler-Check
        scheduler_status = scheduler.state

        return jsonify({
            "status": "healthy",
            "database": "connected",
            "instagram_api": "connected",
            "scheduler": scheduler_status
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500
```

### 8.2 Wartungsroutinen

```python
def cleanup_old_files():
    """Bereinigt alte temporäre Dateien"""
    cutoff = datetime.now() - timedelta(days=7)
    with db_connection.cursor() as cursor:
        cursor.execute("""
            SELECT media_path FROM scheduled_posts
            WHERE status IN ('uploaded', 'failed')
            AND updated_at < %s
        """, (cutoff,))
        old_files = cursor.fetchall()
        
    for file_path in old_files:
        try:
            if os.path.exists(file_path[0]):
                os.remove(file_path[0])
        except Exception as e:
            logger.error(f"File cleanup failed: {str(e)}")