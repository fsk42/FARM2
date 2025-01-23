# Datenbank-Dokumentation: Instagram Post Scheduler

## 1. Datenbankarchitektur

### 1.1 Übersicht

Die Datenbank des Instagram Post Schedulers basiert auf PostgreSQL, einem robusten, objektrelationalen Datenbankmanagementsystem. Die Wahl fiel auf PostgreSQL aufgrund folgender Vorteile:

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

### 2.1 Haupttabellen

#### scheduled_posts
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

#### media_metadata
```sql
CREATE TABLE media_metadata (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES scheduled_posts(id) ON DELETE CASCADE,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    dimensions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_file_type CHECK (file_type IN ('image/jpeg', 'image/png', 'image/webp', 'video/mp4'))
);
```

#### post_analytics
```sql
CREATE TABLE post_analytics (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES scheduled_posts(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Indizes

```sql
-- Optimierung der Scheduling-Abfragen
CREATE INDEX idx_scheduled_posts_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_time_status ON scheduled_posts(scheduled_time, status);

-- Optimierung der Analytics-Abfragen
CREATE INDEX idx_post_analytics_engagement ON post_analytics(engagement_rate DESC);
CREATE INDEX idx_post_analytics_post_id ON post_analytics(post_id);

-- Optimierung der Medien-Abfragen
CREATE INDEX idx_media_metadata_post_id ON media_metadata(post_id);
```

### 2.3 Constraints und Trigger

#### Automatische Aktualisierung des updated_at Timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scheduled_posts_updated_at
    BEFORE UPDATE ON scheduled_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

#### Validierung der Scheduling-Zeit
```sql
CREATE OR REPLACE FUNCTION validate_schedule_time()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.scheduled_time <= CURRENT_TIMESTAMP THEN
        RAISE EXCEPTION 'Scheduled time must be in the future';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_schedule_time
    BEFORE INSERT OR UPDATE ON scheduled_posts
    FOR EACH ROW
    EXECUTE FUNCTION validate_schedule_time();
```

## 3. Datenbankoperationen

### 3.1 Häufige Abfragen

#### Abrufen anstehender Posts
```sql
SELECT *
FROM scheduled_posts
WHERE status = 'pending'
AND scheduled_time <= CURRENT_TIMESTAMP
ORDER BY scheduled_time ASC
LIMIT 10;
```

#### Statistiken abrufen
```sql
SELECT 
    sp.post_type,
    COUNT(*) as total_posts,
    AVG(pa.engagement_rate) as avg_engagement,
    AVG(pa.likes_count) as avg_likes
FROM scheduled_posts sp
JOIN post_analytics pa ON sp.id = pa.post_id
WHERE sp.status = 'uploaded'
GROUP BY sp.post_type;
```

### 3.2 Wartungsabfragen

#### Bereinigung alter Einträge
```sql
DELETE FROM scheduled_posts
WHERE status = 'uploaded'
AND scheduled_time < CURRENT_TIMESTAMP - INTERVAL '30 days';
```

#### Aktualisierung der Engagement-Raten
```sql
UPDATE post_analytics
SET engagement_rate = 
    ((likes_count + comments_count * 2 + shares_count * 3)::DECIMAL / 
    NULLIF(views_count, 0) * 100)
WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL '1 hour';
```

## 4. Datenbankadministration

### 4.1 Backup-Strategie

#### Tägliches Backup
```bash
pg_dump -Fc instagram_scheduler > /backup/daily/instagram_scheduler_$(date +%Y%m%d).dump
```

#### Backup-Rotation
- Tägliche Backups: 7 Tage Aufbewahrung
- Wöchentliche Backups: 4 Wochen Aufbewahrung
- Monatliche Backups: 12 Monate Aufbewahrung

### 4.2 Monitoring

#### Performance-Monitoring
```sql
-- Langlaufende Abfragen identifizieren
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE pg_stat_activity.query != '<IDLE>'
AND pg_stat_activity.query NOT ILIKE '%pg_stat_activity%'
ORDER BY duration DESC;
```

#### Tabellengröße und Indexnutzung
```sql
SELECT
    schemaname || '.' || relname as table_name,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as data_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as external_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### 4.3 Optimierung

#### Vacuum und Analyze
```sql
-- Regelmäßige Wartung
VACUUM ANALYZE scheduled_posts;
VACUUM ANALYZE post_analytics;
VACUUM ANALYZE media_metadata;
```

#### Index-Wartung
```sql
-- Reindexierung
REINDEX TABLE scheduled_posts;
REINDEX TABLE post_analytics;
REINDEX TABLE media_metadata;
```

## 5. Sicherheit

### 5.1 Zugriffsrechte

```sql
-- Anwendungsbenutzer erstellen
CREATE USER app_user WITH PASSWORD 'secure_password';

-- Minimale Rechte vergeben
GRANT SELECT, INSERT, UPDATE ON scheduled_posts TO app_user;
GRANT SELECT, INSERT, UPDATE ON post_analytics TO app_user;
GRANT SELECT, INSERT ON media_metadata TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### 5.2 Verbindungssicherheit

- SSL/TLS-Verschlüsselung für alle Datenbankverbindungen
- Firewall-Konfiguration für eingeschränkten Datenbankzugriff
- Regelmäßige Sicherheitsaudits

## 6. Skalierung und Performance

### 6.1 Partitionierung

```sql
-- Partitionierung nach Datum
CREATE TABLE scheduled_posts_partitioned (
    LIKE scheduled_posts INCLUDING ALL
) PARTITION BY RANGE (scheduled_time);

-- Monatliche Partitionen
CREATE TABLE scheduled_posts_y2024m01 PARTITION OF scheduled_posts_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 6.2 Materialized Views

```sql
-- Materialisierte Ansicht für Analytics
CREATE MATERIALIZED VIEW mv_post_statistics AS
SELECT 
    post_type,
    DATE_TRUNC('day', scheduled_time) as post_date,
    COUNT(*) as post_count,
    AVG(engagement_rate) as avg_engagement
FROM scheduled_posts sp
JOIN post_analytics pa ON sp.id = pa.post_id
GROUP BY post_type, DATE_TRUNC('day', scheduled_time)
WITH DATA;

-- Aktualisierung der materialisierten Ansicht
REFRESH MATERIALIZED VIEW mv_post_statistics;
```

## 7. Fehlerbehandlung und Recovery

### 7.1 Transaktionsmanagement

```sql
-- Beispiel einer robusten Transaktion
BEGIN;
    INSERT INTO scheduled_posts (post_type, caption, hashtags, media_path, scheduled_time)
    VALUES ('image', 'New post', '#test', '/path/to/image.jpg', '2024-02-01 12:00:00')
    RETURNING id INTO post_id;

    INSERT INTO media_metadata (post_id, file_size, file_type, dimensions)
    VALUES (post_id, 1024000, 'image/jpeg', '{"width": 1080, "height": 1080}');

    INSERT INTO post_analytics (post_id)
    VALUES (post_id);
COMMIT;
```

### 7.2 Recovery-Prozeduren

```sql
-- Point-in-Time Recovery
RESTORE DATABASE instagram_scheduler
FROM '/backup/daily/instagram_scheduler_20240123.dump'
WITH RECOVERY_TARGET_TIME = '2024-01-23 10:00:00';
```

## 8. Entwicklungsrichtlinien

### 8.1 Coding Standards

- Alle Tabellennamen in Snake_Case
- Primärschlüssel immer als 'id'
- Fremdschlüssel als 'tabelle_id'
- Timestamps für created_at und updated_at
- Dokumentation aller Constraints und Trigger
