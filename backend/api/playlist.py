import os
import json
import logging

logger = logging.getLogger(__name__)

# Path to the playlists file
PLAYLISTS_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', 'playlists.json')

def _load_playlists():
    """
    Load playlists from file
    
    Returns:
        dict: Playlists data
    """
    # Create playlists directory if it doesn't exist
    os.makedirs(os.path.dirname(PLAYLISTS_FILE), exist_ok=True)
    
    # Create playlists file if it doesn't exist
    if not os.path.exists(PLAYLISTS_FILE):
        with open(PLAYLISTS_FILE, 'w') as f:
            json.dump({}, f)
        return {}
    
    # Load playlists from file
    try:
        with open(PLAYLISTS_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading playlists: {e}")
        return {}

def _save_playlists(playlists):
    """
    Save playlists to file
    
    Args:
        playlists (dict): Playlists data
    """
    try:
        with open(PLAYLISTS_FILE, 'w') as f:
            json.dump(playlists, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving playlists: {e}")

def add_to_playlist(file_path, genre):
    """
    Add a song to a playlist
    
    Args:
        file_path (str): Path to the audio file
        genre (str): Predicted genre
        
    Returns:
        str: Playlist ID (genre name)
    """
    # Load playlists
    playlists = _load_playlists()
    
    # Create playlist if it doesn't exist
    if genre not in playlists:
        playlists[genre] = []
    
    # Get filename from path
    filename = os.path.basename(file_path)
    
    # Add song to playlist if not already in it
    if filename not in playlists[genre]:
        playlists[genre].append(filename)
    
    # Save playlists
    _save_playlists(playlists)
    
    return genre

def get_playlists():
    """
    Get all playlists
    
    Returns:
        dict: Playlists data
    """
    return _load_playlists()

def get_playlist(playlist_id):
    """
    Get a specific playlist
    
    Args:
        playlist_id (str): Playlist ID (genre name)
        
    Returns:
        list: List of songs in the playlist
    """
    playlists = _load_playlists()
    return playlists.get(playlist_id, [])
