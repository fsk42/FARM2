import time
from datetime import datetime, timedelta
from threading import Timer
from instagrapi import Client


ACCOUNT_USERNAME ="farm_projekt_DHBW"
ACCOUNT_PASSWORD = "farmProjekt121224"

cl = Client()
cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)

photo_path = "./auto.jpg"  
caption = "This is deutsches Auto! #Porsche"
upload_datetime = datetime(2024, 12, 13, 14, 40)


def upload_photo(photo_path, caption):
    try:
        media = cl.photo_upload(photo_path, caption)
        print(f"[{datetime.now()}] Photo uploaded successfully: {media.dict()}")
    except Exception as e:
        print(f"[{datetime.now()}] An error occurred: {e}")


def schedule_upload(photo_path, caption, upload_datetime):
    now = datetime.now()
    delay = (upload_datetime - now).total_seconds() 

    if delay <= 0:
        print(f"[{datetime.now()}] The specified time {upload_datetime} has already passed!")
        return

    print(f"[{datetime.now()}] Upload scheduled for {upload_datetime}")
    Timer(delay, upload_photo, [photo_path, caption]).start()


schedule_upload(photo_path, caption, upload_datetime)


print("Waiting for the scheduled upload...")
while True:
    time.sleep(1)

