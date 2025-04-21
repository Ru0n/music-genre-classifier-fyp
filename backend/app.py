from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import logging

# Import utility modules
from utils.audio_processor import process_audio
from utils.spectrogram_generator import generate_spectrogram
from models.model_loader import load_model, predict_genre
from api.playlist import add_to_playlist, get_playlists

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import configuration
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, MODEL_PATH

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the model
model = None
try:
    model = load_model(MODEL_PATH)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {e}")

# Helper function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """
    API endpoint for uploading audio files
    """
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Process audio file
            processed_audio = process_audio(filepath)
            
            # Generate spectrogram
            spectrogram_path = generate_spectrogram(processed_audio, filename)
            
            # Predict genre
            if model is not None:
                genre, confidence = predict_genre(model, spectrogram_path)
                
                # Add to playlist
                playlist_id = add_to_playlist(filepath, genre)
                
                return jsonify({
                    'filename': filename,
                    'genre': genre,
                    'confidence': confidence,
                    'spectrogram': spectrogram_path,
                    'playlist_id': playlist_id
                }), 200
            else:
                return jsonify({'error': 'Model not loaded'}), 500
                
        except Exception as e:
            logger.error(f"Error processing file: {e}")
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/audio/<filename>', methods=['GET'])
def get_audio(filename):
    """
    API endpoint for retrieving uploaded audio files
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/spectrogram/<filename>', methods=['GET'])
def get_spectrogram(filename):
    """
    API endpoint for retrieving generated spectrograms
    """
    spectrogram_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'spectrograms')
    return send_from_directory(spectrogram_dir, filename)

@app.route('/api/playlists', methods=['GET'])
def get_all_playlists():
    """
    API endpoint for retrieving all playlists
    """
    playlists = get_playlists()
    return jsonify(playlists), 200

if __name__ == '__main__':
    app.run(debug=True)
