from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

def get_browser():
    """Initialisiert und gibt eine WebDriver-Instanz zurück."""
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Headless-Browser für Tests ohne UI
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
