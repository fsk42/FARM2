from instagrapi import Client
from instagrapi.exceptions import LoginRequired, BadPassword, ChallengeRequired

def authenticate_instagram_user(username, password):
    """
    Authenticate an Instagram user using the instagrapi library.

    Parameters:
    - username: str, Instagram username
    - password: str, Instagram password

    Returns:
    - dict: The raw response from the Instagram API
    """
    client = Client()
    
    try:
        #Client login returns a boolean value, True if successful
        client.login(username, password)
        return {'success': True}
    except LoginRequired:
        return {'success': False, 'error': 'Login required'}
    except BadPassword:
        return {'success': False, 'error': 'Bad password'}
    except ChallengeRequired:
        return {'success': False, 'error': 'Challenge required'}
    except Exception as e:
        return {'success': False, 'error': str(e)}

