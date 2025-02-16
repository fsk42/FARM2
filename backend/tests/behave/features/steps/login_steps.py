from behave import given, when, then
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
import os

@given("I am on the post creation page")
def step_go_to_post_creation(context):
    context.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
    context.driver.get("http://localhost:3000")  # Deine App-URL

@when('I select "{post_type}" as the post type')
def step_select_post_type(context, post_type):
    dropdown = context.driver.find_element(By.ID, "postType")  # Verwendet die ID "postType"
    dropdown.send_keys(post_type)

@when('I enter "{caption}" as the caption')
def step_enter_caption(context, caption):
    caption_input = context.driver.find_element(By.ID, "caption")  # Verwendet die ID "caption"
    caption_input.send_keys(caption)

@when('I enter "{hashtags}" as the hashtags')
def step_enter_hashtags(context, hashtags):
    hashtags_input = context.driver.find_element(By.ID, "hashtags")  # Verwendet die ID "hashtags"
    hashtags_input.send_keys(hashtags)

@when('I upload a file "{file_name}"')
def step_upload_file(context, file_name):
    # Verzeichnis korrekt zusammensetzen
    test_file_path = os.path.abspath(
        os.path.join("test_files", "test_image.jpg")
    )
    print(f"Attempting to upload file at path: {test_file_path}")

    # Datei ins <input>-Element laden
    file_input = context.driver.find_element(By.ID, "media")
    file_input.send_keys(test_file_path)




from selenium.webdriver.common.by import By

@when("I click the upload button")
def step_click_upload_button(context):
    upload_button = context.driver.find_element(By.CSS_SELECTOR, "[data-test-id='upload-post-button']")
    upload_button.click()

@then("I should see a success message")
def step_verify_success_message(context):
    wait = WebDriverWait(context.driver, 20)  # Warte bis zu 10 Sekunden
    success_message = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "[data-test-id='success-message']"))
    )
    assert "Post uploaded successfully" in success_message.text


