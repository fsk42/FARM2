from instagrapi import Client

ACCOUNT_USERNAME ="farm_projekt_DHBW"
ACCOUNT_PASSWORD = "farmProjekt121224"

cl = Client()
cl.login(ACCOUNT_USERNAME, ACCOUNT_PASSWORD)

photo_path = "./nasi_padang.jpg"  
caption = "This is Nasi Padang! #Nasi"

try:
    media = cl.photo_upload(photo_path, caption)
    print(f"Photo uploaded successfully: {media.dict()}")
except Exception as e:
    print(f"An error occurred: {e}")
