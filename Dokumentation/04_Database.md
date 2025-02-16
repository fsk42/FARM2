# Datenbank-Dokumentation: Instagram Post Scheduler

## 1. Datenbankarchitektur

### 1.1 Übersicht

Die Anwendung nutzt PostgreSQL als Datenbankmanagementsystem. Eine Verbindung wird zu einer PostgreSQL-Datenbank hergestellt, in der alle anstehenden Instagram-Posts gespeichert werden. Die Wahl fiel auf PostgreSQL aufgrund folgender Vorteile:

- ACID-Konformität für Datenkonsistenz
- Robuste Transaktionsunterstützung
- Effiziente Handhabung großer Datenmengen
- Umfangreiche Indexierungsmöglichkeiten
- Native JSON-Unterstützung
- Erweiterbare Architektur

### 1.2 Systemanforderungen

- PostgreSQL Version: 14.0 oder höher
- Minimaler Speicherbedarf: 2GB RAM
- Empfohlener Speicherplatz: 10GB
- Backup-Speicher: Mindestens 20GB für Backups und Logs

## 2. Datenbankschema

### 2.1 Tabelle ```scheduled_posts```

Diese Tabelle speichert alle Informationen zu geplanten Posts:

*   id: Eindeutiger Identifikator (SERIAL PRIMARY KEY)
*   post_type: Typ des Posts (z. B. image oder video)
*   caption: Beschreibung bzw. Bildunterschrift des Posts
*   hashtags: Enthaltene Hashtags
*   media_path: Pfad zur hochzuladenden Mediendatei (wird beim Upload in einen temporären Ordner gespeichert)
*   scheduled_time: Geplanter Zeitpunkt für den Post (TIMESTAMP)
*   status: Status des Posts (pending oder uploaded)

### SQL zur Erstellung der Tabelle


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
    retry_count INTEGER DEFAULT 0,
    CONSTRAINT valid_post_type CHECK (post_type IN ('image', 'video')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'uploaded', 'failed'))
);
```
## 3. Wichtige Datenbankoperationen

### 3.1 Geplante Posts einfügen
Beim Upload über die API wird, sofern ein ```scheduled_time``` angegeben wird, ein neuer Eintrag in die Tabelle ```scheduled_posts``` eingefügt.

```python
cursor.execute(
    "INSERT INTO scheduled_posts (post_type, caption, hashtags, media_path, scheduled_time) VALUES (%s, %s, %s, %s, %s)",
    (post_type, caption, hashtags, media_path, scheduled_time)
)
```

### 3.2 Abrufen und Verarbeiten geplanter Posts
Der Scheduler führt regelmäßig eine Abfrage aus, um alle Posts abzurufen, bei denen der ```scheduled_time```-Wert erreicht oder überschritten wurde und der Status noch ```pending``` ist:

```sql
SELECT * FROM scheduled_posts 
WHERE scheduled_time <= NOW() AND status = 'pending';
```
Nach erfolgreichem Upload wird der Status des Posts auf ```uploaded``` gesetzt.

### 3.3 Löschen eines geplanten Posts
Über die API kann ein geplanter Post auch gelöscht werden. Dabei wird der Datenbankeintrag entfernt und die zugehörige Mediendatei gelöscht.

```python
cursor.execute("DELETE FROM scheduled_posts WHERE id = %s", (post_id,))
```