# Instagrapi-Integration: Instagram Post Scheduler

## 1. Übersicht

Die Integration mit Instagram erfolgt über die Instagrapi-Bibliothek (Version 2.1.3), eine leistungsfähige, inoffizielle API für Instagram. Diese Bibliothek wurde gewählt aufgrund ihrer:

- Zuverlässigkeit und Stabilität
- Umfangreichen Funktionalität
- Aktiven Entwicklergemeinschaft
- Guten Dokumentation
- Fehlerbehandlungsmechanismen

## 2. Installation und Konfiguration

### 2.1 Installation

Die Installation erfolgt über pip:

```bash
pip install instagrapi==2.1.3
```

### 2.2 Grundkonfiguration

```python
from instagrapi import Client
from instagrapi.types import Media
import os
from dotenv import load_dotenv

# Laden der Umgebungsvariablen
load_dotenv()

class InstagramClient:
    def __init__(self):
        self.client = Client()
        self.configure_client()
    
    def configure_client(self):
        """Grundkonfiguration des Instagram-Clients"""
        self.client.delay_range = [1, 3]  # Verzögerung zwischen Anfragen
        self.client.request_timeout = 5    # Timeout für Anfragen
        self.client.logger.setLevel("INFO")
```

### 2.3 Authentifizierung

```python
def authenticate(self):
    """
    Authentifizierung mit Instagram
    Verwendet sichere Umgebungsvariablen
    """
    try:
        username = os.getenv("INSTAGRAM_USERNAME")
        password = os.getenv("INSTAGRAM_PASSWORD")
        
        # Zwei-Faktor-Authentifizierung
        if os.getenv("INSTAGRAM_2FA_ENABLED") == "true":
            verification_code = self.get_2fa_code()
            self.client.login(username, password, verification_code=verification_code)
        else:
            self.client.login(username, password)
            
        return True
    except Exception as e:
        self.logger.error(f"Authentifizierungsfehler: {str(e)}")
        return False
```

## 3. Medienverarbeitung

### 3.1 Bildverarbeitung

```python
def process_image(self, image_path: str) -> dict:
    """
    Verarbeitet und validiert Bilder für Instagram
    
    Args:
        image_path: Pfad zum Originalbild
        
    Returns:
        dict: Verarbeitete Bildinformationen
    """
    try:
        # Bildvalidierung
        if not self._validate_image(image_path):
            raise ValueError("Ungültiges Bildformat")
            
        # Bildoptimierung
        processed_image = self._optimize_image(image_path)
        
        return {
            "path": processed_image,
            "dimensions": self._get_image_dimensions(processed_image),
            "size": os.path.getsize(processed_image)
        }
    except Exception as e:
        self.logger.error(f"Bilderverarbeitungsfehler: {str(e)}")
        raise
```

### 3.2 Videoverarbeitung

```python
def process_video(self, video_path: str) -> dict:
    """
    Verarbeitet und validiert Videos für Instagram
    
    Args:
        video_path: Pfad zum Originalvideo
        
    Returns:
        dict: Verarbeitete Videoinformationen
    """
    try:
        # Videovalidierung
        if not self._validate_video(video_path):
            raise ValueError("Ungültiges Videoformat")
            
        # Videooptimierung
        processed_video = self._optimize_video(video_path)
        
        return {
            "path": processed_video,
            "duration": self._get_video_duration(processed_video),
            "dimensions": self._get_video_dimensions(processed_video),
            "size": os.path.getsize(processed_video)
        }
    except Exception as e:
        self.logger.error(f"Videoverarbeitungsfehler: {str(e)}")
        raise
```

## 4. Post-Management

### 4.1 Bild-Upload

```python
def upload_photo(self, photo_path: str, caption: str, hashtags: str = "") -> dict:
    """
    Lädt ein Bild auf Instagram hoch
    
    Args:
        photo_path: Pfad zum Bild
        caption: Bildunterschrift
        hashtags: Hashtags (optional)
        
    Returns:
        dict: Upload-Status und Media-ID
    """
    try:
        # Bildverarbeitung
        processed_photo = self.process_image(photo_path)
        
        # Caption mit Hashtags
        full_caption = f"{caption}\n\n{hashtags}" if hashtags else caption
        
        # Upload durchführen
        media = self.client.photo_upload(
            processed_photo["path"],
            full_caption
        )
        
        return {
            "status": "success",
            "media_id": media.id,
            "code": media.code
        }
    except Exception as e:
        self.logger.error(f"Foto-Upload-Fehler: {str(e)}")
        raise
```

### 4.2 Video-Upload

```python
def upload_video(self, video_path: str, caption: str, hashtags: str = "") -> dict:
    """
    Lädt ein Video auf Instagram hoch
    
    Args:
        video_path: Pfad zum Video
        caption: Videobeschreibung
        hashtags: Hashtags (optional)
        
    Returns:
        dict: Upload-Status und Media-ID
    """
    try:
        # Videoverarbeitung
        processed_video = self.process_video(video_path)
        
        # Caption mit Hashtags
        full_caption = f"{caption}\n\n{hashtags}" if hashtags else caption
        
        # Upload durchführen
        media = self.client.video_upload(
            processed_video["path"],
            full_caption
        )
        
        return {
            "status": "success",
            "media_id": media.id,
            "code": media.code
        }
    except Exception as e:
        self.logger.error(f"Video-Upload-Fehler: {str(e)}")
        raise
```

## 5. Fehlerbehandlung

### 5.1 Wiederholungslogik

```python
from functools import wraps
import time

def retry_on_failure(max_attempts=3, delay=5):
    """
    Decorator für automatische Wiederholungsversuche
    
    Args:
        max_attempts: Maximale Anzahl der Versuche
        delay: Verzögerung zwischen Versuchen in Sekunden
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise
                    time.sleep(delay)
            return None
        return wrapper
    return decorator
```

### 5.2 Fehlertypen und Behandlung

```python
class InstagramAPIError(Exception):
    """Basisklasse für Instagram-API-Fehler"""
    pass

class RateLimitError(InstagramAPIError):
    """Rate Limit erreicht"""
    pass

class MediaValidationError(InstagramAPIError):
    """Medienvalidierungsfehler"""
    pass

def handle_api_error(self, error: Exception) -> dict:
    """
    Zentrale Fehlerbehandlung für API-Fehler
    
    Args:
        error: Aufgetretener Fehler
        
    Returns:
        dict: Fehlerinformationen
    """
    if "rate limit" in str(error).lower():
        return {
            "error_type": "rate_limit",
            "message": "Rate Limit erreicht",
            "retry_after": 3600  # 1 Stunde warten
        }
    elif "media" in str(error).lower():
        return {
            "error_type": "media_error",
            "message": "Mediendatei ungültig",
            "details": str(error)
        }
    else:
        return {
            "error_type": "unknown",
            "message": "Unbekannter Fehler",
            "details": str(error)
        }
```

## 6. Sicherheit

### 6.1 Zugangsdatenverwaltung

```python
from cryptography.fernet import Fernet

class CredentialManager:
    def __init__(self):
        self.key = os.getenv("ENCRYPTION_KEY")
        self.cipher_suite = Fernet(self.key)
        
    def encrypt_credentials(self, username: str, password: str) -> tuple:
        """
        Verschlüsselt Instagram-Zugangsdaten
        
        Returns:
            tuple: (verschlüsselter Username, verschlüsseltes Passwort)
        """
        encrypted_username = self.cipher_suite.encrypt(username.encode())
        encrypted_password = self.cipher_suite.encrypt(password.encode())
        return encrypted_username, encrypted_password
    
    def decrypt_credentials(self, encrypted_username: bytes, 
                          encrypted_password: bytes) -> tuple:
        """
        Entschlüsselt Instagram-Zugangsdaten
        
        Returns:
            tuple: (Username, Passwort)
        """
        username = self.cipher_suite.decrypt(encrypted_username).decode()
        password = self.cipher_suite.decrypt(encrypted_password).decode()
        return username, password
```

## 7. Monitoring und Logging

### 7.1 Logging-Konfiguration

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logging(self):
    """Konfiguriert das Logging-System"""
    logger = logging.getLogger("instagram_client")
    logger.setLevel(logging.INFO)
    
    # Datei-Handler
    file_handler = RotatingFileHandler(
        "instagram_client.log",
        maxBytes=1024 * 1024,  # 1MB
        backupCount=5
    )
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    
    logger.addHandler(file_handler)
    return logger
```

### 7.2 Performance-Monitoring

```python
def monitor_api_performance(self):
    """
    Überwacht die API-Performance
    
    Returns:
        dict: Performance-Metriken
    """
    return {
        "rate_limit_remaining": self.client.get_request_limit(),
        "average_response_time": self._calculate_avg_response_time(),
        "success_rate": self._calculate_success_rate(),
        "error_count": self._get_error_count()
    }
```

## 8. Best Practices

### 8.1 Content-Richtlinien

- Bildgrößen: 1080x1080px (quadratisch), 1080x1350px (Portrait)
- Videoformate: MP4, maximale Länge 60 Sekunden
- Maximale Dateigröße: 100MB für Videos, 8MB für Bilder
- Unterstützte Bildformate: JPEG, PNG
- Empfohlene Hashtag-Anzahl: 20-30 pro Post

### 8.2 Rate Limiting

- Maximale Posts pro Tag: 25-30
- Minimale Zeit zwischen Posts: 2 Stunden
- Maximale Hashtags pro Post: 30
- Maximale Bildunterschriftenlänge: 2200 Zeichen