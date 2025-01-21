import os
from flask import Flask, request, jsonify
from instagrapi import Client
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid


app = Flask(__name__)
CORS(app)

#resources={r"/upload": {"origins": "http://localhost:3000"}}


# PostgreSQL database connection
DB_HOST = "localhost"        
DB_PORT = 5432            
DB_NAME = "postgres" 
DB_USER = "postgres"    
DB_PASSWORD = "insta_db"


# Establish a database connection
try:
    db_connection = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=RealDictCursor
    )
    print("Connected to the database successfully!")
except Exception as e:
    print(f"Database connection failed: {e}")


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
        scheduled_time = request.form.get("scheduled_time")

        if not file:
            return jsonify({"status": "error", "message": "No media file provided"}), 400

        # Generate a unique filename
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        media_path = os.path.join(app.config["UPLOAD_FOLDER"], unique_filename)
        print(f"Saving file to: {media_path}")
        file.save(media_path)

        if scheduled_time:  # Schedule the post
            # Save to the database
            with db_connection.cursor() as cursor:
                cursor.execute(
                "INSERT INTO scheduled_posts (post_type, caption, hashtags, media_path, scheduled_time) "
                "VALUES (%s, %s, %s, %s, %s)",
                (post_type, caption, hashtags, media_path, scheduled_time)  # Save only the unique filename
                )
                db_connection.commit()
            return jsonify({"status": "success", "message": "Post scheduled successfully!"})


        final_caption = f"{caption}\n\n{hashtags}"

        # Upload based on post type
        if post_type == "image":
            cl.photo_upload(media_path, final_caption)
        elif post_type == "video":
            cl.video_upload(media_path, final_caption) 
            #Moviepy must version 1.0.3 pip install moviepy==1.0.3, 
            # If the Resulation of the Video passt nicht wie normale Auflösung (1280x720,640x360) wird Upload failed
        else:
            return jsonify({"status": "error", "message": "Invalid post type"}), 400

        return jsonify({"status": "success", "message": "Post uploaded successfully!"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        if not scheduled_time and os.path.exists(media_path):  # Delete file only if not scheduled
            os.remove(media_path)

        # Cleanup additional unnecessary files with *.mp4.jpg
        temp_thumbnail_path = media_path + ".jpg"
        if os.path.exists(temp_thumbnail_path):
            os.remove(temp_thumbnail_path)


def upload_scheduled_posts():
    with db_connection.cursor() as cursor:
        cursor.execute(
            "SELECT * FROM scheduled_posts WHERE scheduled_time <= %s AND status = 'pending'",
            (datetime.datetime.now(),)
        )
        posts = cursor.fetchall()

    for post in posts:
        media_path = post["media_path"]
        final_caption = f"{post['caption']}\n{post['hashtags']}"
        try:
            if post["post_type"] == "image":
                cl.photo_upload(media_path, final_caption)
            elif post["post_type"] == "video":
                cl.video_upload(media_path, final_caption)
            # Mark as uploaded
            with db_connection.cursor() as cursor:
                cursor.execute(
                    "UPDATE scheduled_posts SET status = 'uploaded' WHERE id = %s",
                    (post["id"],)
                )
                db_connection.commit()
        finally:
            if os.path.exists(media_path):
                os.remove(media_path)

            # Cleanup additional unnecessary files with *.mp4.jpg
            temp_thumbnail_path = media_path + ".jpg"
            if os.path.exists(temp_thumbnail_path):
                os.remove(temp_thumbnail_path)

scheduler = BackgroundScheduler()
if not scheduler.get_jobs():
    scheduler.add_job(upload_scheduled_posts, "interval", minutes=2) #minutes=1 #To prevent overlapping set interval 2 minutes
scheduler.start()


@app.route("/scheduled_posts", methods=["GET"])
def get_scheduled_posts():
    try:
        with db_connection.cursor() as cursor:
            # Convert scheduled_time to ISO 8601 format
            cursor.execute(
                """
                SELECT id, post_type, caption, hashtags, media_path, 
                to_char(scheduled_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as scheduled_time, status
                FROM scheduled_posts WHERE status = 'pending'
                """
            )
            posts = cursor.fetchall()
        return jsonify(posts)  # Return posts as a JSON response
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    

@app.route("/delete_scheduled_post/<int:post_id>", methods=["DELETE"])
def delete_scheduled_post(post_id):
    try:
        # Fetch the post from the database to get the media file path
        with db_connection.cursor() as cursor:
            cursor.execute("SELECT media_path FROM scheduled_posts WHERE id = %s", (post_id,))
            post = cursor.fetchone()

        if post:
            media_path = os.path.join(app.config["UPLOAD_FOLDER"], post["media_path"])
            # Delete the post from the database
            with db_connection.cursor() as cursor:
                cursor.execute("DELETE FROM scheduled_posts WHERE id = %s", (post_id,))
                db_connection.commit()

            # Delete the associated media file if it exists
            if os.path.exists(media_path):
                os.remove(media_path)
                
            # Cleanup additional unnecessary files
            temp_thumbnail_path = media_path + ".jpg"
            if os.path.exists(temp_thumbnail_path):
                os.remove(temp_thumbnail_path)

            return jsonify({"status": "success", "message": "Post deleted successfully!"}), 200
        else:
            return jsonify({"status": "error", "message": "Post not found"}), 404
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000) #host="0.0.0.0"
