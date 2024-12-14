from flask import Flask, request, jsonify
from flask_cors import CORS
from loginAuthenticate import authenticate_instagram_user

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

if __name__ == '__main__':
    app.run(debug=True)
