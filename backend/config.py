import os

# File upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'wav', 'mp3'}

# Model settings
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'best_chunked_custom_cnn_model.keras')

# No global scaler is used - instance-based normalization is applied instead

# Audio processing settings
SAMPLE_RATE = 22050  # Hz
DURATION = 30  # seconds
MONO = True

# Chunking parameters
CHUNK_DURATION_S = 4  # Duration of chunks in seconds
CHUNK_OVERLAP_S = 2   # Overlap duration in seconds
SAMPLES_PER_CHUNK = int(CHUNK_DURATION_S * SAMPLE_RATE)
HOP_SAMPLES_BETWEEN_CHUNKS = int((CHUNK_DURATION_S - CHUNK_OVERLAP_S) * SAMPLE_RATE)

# Spectrogram settings
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512

# Resizing parameters
RESIZE_DIM = 128  # Target height and width (128x128)
TARGET_SHAPE = (RESIZE_DIM, RESIZE_DIM)

# Genre classes (GTZAN dataset)
GENRES = [
    'blues',
    'classical',
    'country',
    'disco',
    'hiphop',
    'jazz',
    'metal',
    'pop',
    'reggae',
    'rock'
]
