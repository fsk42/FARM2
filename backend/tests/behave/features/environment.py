import os

def before_all(context):
    """Initialisiert Ressourcen für alle Tests."""
    # Sicherstellen, dass der Temp-Ordner existiert
    UPLOAD_FOLDER = "./temp"
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    print("Temp folder created or already exists.")
    print("Starting test suite...")



def after_all(context):
    """Freigeben der Ressourcen nach allen Tests."""
    if hasattr(context, "driver"):
        context.driver.quit()
    print("Test suite complete.")
