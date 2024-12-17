from flask import Flask, request, jsonify
from flask_cors import CORS
from loginAuthenticate import authenticate_instagram_user
import time
from datetime import datetime, timedelta
from threading import Timer
from instagrapi import Client
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Use the imported function to authenticate
    result = authenticate_instagram_user(username, password)
    # Return the result as JSON
    if result['success']:
        return jsonify({'authenticated': True, 'message': 'Login successful'})
    else:
        return jsonify({'authenticated': False, 'message': result['error']}), 401

@app.route('/api/uploadnow', methods=['POST'])
def upload_now():
    username = request.form.get('username')
    password = request.form.get('password')
    caption = request.form.get('caption')
    photo = request.files.get('photo')

    if not photo:
        return jsonify({'uploaded': False, 'message': 'No photo provided'}), 400

    photo_path = os.path.join('uploads', photo.filename)
    photo.save(photo_path)

    cl = Client()
    cl.login(username, password)

    try:
        media = cl.photo_upload(photo_path, caption)
        print(f"[{datetime.now()}] Photo uploaded successfully: {media.dict()}")
        return jsonify({'uploaded': True, 'message': 'Photo uploaded successfully'})
    except Exception as e:
        print(f"[{datetime.now()}] An error occurred: {e}")
        return jsonify({'uploaded': False, 'message': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
