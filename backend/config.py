import os

# File upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'wav', 'mp3'}

# Model settings
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'model', 'genre_classifier_model.h5')

# Audio processing settings
SAMPLE_RATE = 22050  # Hz
DURATION = 30  # seconds
MONO = True

# Spectrogram settings
N_MELS = 128
N_FFT = 2048
HOP_LENGTH = 512

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
