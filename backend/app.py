from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import configuration
from backend.config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, MODEL_PATH

# Import utility modules
from backend.utils.audio_processor import process_audio
from backend.utils.spectrogram_generator import generate_spectrogram
from backend.models.model_loader import load_model, predict_genre
from backend.api.playlist import add_to_playlist, get_playlists

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type", "Authorization"]}})

# Configure app
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Create upload folder and spectrograms folder if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(os.path.join(UPLOAD_FOLDER, 'spectrograms'), exist_ok=True)

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
    logger.info(f"Received upload request: {request.files}")

    # Check if the post request has the file part
    if 'file' not in request.files:
        logger.error("No file part in the request")
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    logger.info(f"File received: {file.filename}")

    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        logger.error("Empty filename")
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        logger.info(f"Saving file to: {filepath}")
        file.save(filepath)

        try:
            # Process audio file
            logger.info(f"Processing audio file: {filepath}")
            processed_audio = process_audio(filepath)

            # Generate spectrogram
            logger.info(f"Generating spectrogram for: {filename}")
            spectrogram_path = generate_spectrogram(processed_audio, filename)

            # Predict genre
            if model is not None:
                logger.info(f"Predicting genre for: {filename}")
                genre, confidence = predict_genre(model, audio_data=processed_audio)

                # Add to playlist
                logger.info(f"Adding to playlist: {genre}")
                playlist_id = add_to_playlist(filepath, genre)

                logger.info(f"Successfully processed file: {filename}, genre: {genre}")
                return jsonify({
                    'filename': filename,
                    'genre': genre,
                    'confidence': confidence,
                    'spectrogram': spectrogram_path,
                    'playlist_id': playlist_id
                }), 200
            else:
                logger.error("Model not loaded")
                return jsonify({'error': 'Model not loaded'}), 500

        except Exception as e:
            logger.error(f"Error processing file: {e}")
            import traceback
            logger.error(traceback.format_exc())
            return jsonify({'error': str(e)}), 500

    logger.error(f"File type not allowed: {file.filename}")
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

@app.route('/test', methods=['GET'])
def test():
    """
    Test endpoint
    """
    return jsonify({'message': 'Backend is working!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5002)
