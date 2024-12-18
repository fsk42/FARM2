from flask import Flask, request, jsonify
from flask_cors import CORS
from loginAuthenticate import authenticate_instagram_user
import os
from datetime import datetime
from instagrapi import Client

app = Flask(__name__)
CORS(app)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    cl = Client()
    try:
        cl.login(username, password)
        return jsonify({'authenticated': True, 'message': 'Login successful'})
    except Exception as e:
        # Check if it's a challenge-required error
        if 'challenge_required' in str(e):
            # Resolve the challenge
            challenge = cl.challenge_resolve()
            
            # Select email as the verification method
            if 'email' in challenge['step_data']:
                cl.challenge_select_verify_method('email')
                return jsonify({
                    'authenticated': False,
                    'message': 'Verification required',
                    'requiresCode': True,
                    'method': 'email'
                }), 401
            else:
                return jsonify({
                    'authenticated': False,
                    'message': 'Verification required, but email method not available',
                    'requiresCode': True,
                    'method': None
                }), 401
        else:
            return jsonify({'authenticated': False, 'message': str(e)}), 401

@app.route('/api/verify', methods=['POST'])
def verify():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    code = data.get('code')

    cl = Client()
    try:
        cl.login(username, password)
        cl.challenge_code(username, code)
        return jsonify({'authenticated': True, 'message': 'Verification successful'})
    except Exception as e:
        return jsonify({'authenticated': False, 'message': str(e)}), 401

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



