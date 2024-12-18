import os
from flask import Flask, request, jsonify
from instagrapi import Client
from flask_cors import CORS 


app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"}})

# Instagram client setup
cl = Client()
cl.load_settings('./info.json')
USERNAME = "farm_projekt_DHBW"
PASSWORD = "farmProjekt121224"
cl.get_timeline_feed()

try:
    cl.login(USERNAME, PASSWORD)
    print("Logged in successfully!")
except Exception as e:
    print(f"Login failed: {e}")

UPLOAD_FOLDER = "./temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/upload", methods=["POST"])
def upload_post():
    try:
        post_type = request.form.get("post_type")
        caption = request.form.get("caption", "")
        hashtags = request.form.get("hashtags", "")
        file = request.files.get("media")

        if not file:
            return jsonify({"status": "error", "message": "No media file provided"}), 400

        media_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(media_path)

        final_caption = f"{caption}\n\n{hashtags}"

        # Upload based on post type
        if post_type == "image":
            cl.photo_upload(media_path, final_caption)
        elif post_type == "video":
            cl.video_upload(media_path, final_caption) #Moviepy must version 1.0.3 pip install moviepy==1.0.3?
        elif post_type == "image_with_text":
            cl.photo_upload(media_path, final_caption)
        else:
            return jsonify({"status": "error", "message": "Invalid post type"}), 400

        return jsonify({"status": "success", "message": "Post uploaded successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if os.path.exists(media_path):
            os.remove(media_path)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
