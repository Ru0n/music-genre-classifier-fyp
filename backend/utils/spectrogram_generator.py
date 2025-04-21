import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
import os
import logging
from ..config import SAMPLE_RATE, N_MELS, N_FFT, HOP_LENGTH

logger = logging.getLogger(__name__)

def generate_spectrogram(audio_data, filename):
    """
    Generate Mel spectrogram from audio data and save as image
    
    Args:
        audio_data (numpy.ndarray): Processed audio signal
        filename (str): Original filename for naming the spectrogram
        
    Returns:
        str: Path to the saved spectrogram image
    """
    logger.info(f"Generating spectrogram for: {filename}")
    
    try:
        # Create spectrograms directory if it doesn't exist
        spectrogram_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads', 'spectrograms')
        os.makedirs(spectrogram_dir, exist_ok=True)
        
        # Generate Mel spectrogram
        mel_spectrogram = librosa.feature.melspectrogram(
            y=audio_data,
            sr=SAMPLE_RATE,
            n_fft=N_FFT,
            hop_length=HOP_LENGTH,
            n_mels=N_MELS
        )
        
        # Convert to dB scale
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
        
        # Create figure and plot spectrogram
        plt.figure(figsize=(10, 4))
        librosa.display.specshow(
            mel_spectrogram_db,
            sr=SAMPLE_RATE,
            hop_length=HOP_LENGTH,
            x_axis='time',
            y_axis='mel'
        )
        plt.colorbar(format='%+2.0f dB')
        plt.title('Mel Spectrogram')
        plt.tight_layout()
        
        # Save figure
        spectrogram_filename = os.path.splitext(filename)[0] + '_spectrogram.png'
        spectrogram_path = os.path.join(spectrogram_dir, spectrogram_filename)
        plt.savefig(spectrogram_path)
        plt.close()
        
        logger.info(f"Spectrogram generated successfully: {spectrogram_path}")
        return spectrogram_filename
        
    except Exception as e:
        logger.error(f"Error generating spectrogram: {e}")
        raise Exception(f"Error generating spectrogram: {e}")
        
def prepare_spectrogram_for_model(audio_data):
    """
    Prepare spectrogram for model input
    
    Args:
        audio_data (numpy.ndarray): Processed audio signal
        
    Returns:
        numpy.ndarray: Spectrogram prepared for model input
    """
    # Generate Mel spectrogram
    mel_spectrogram = librosa.feature.melspectrogram(
        y=audio_data,
        sr=SAMPLE_RATE,
        n_fft=N_FFT,
        hop_length=HOP_LENGTH,
        n_mels=N_MELS
    )
    
    # Convert to dB scale
    mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
    
    # Reshape for model input (add batch and channel dimensions)
    model_input = mel_spectrogram_db.reshape(1, mel_spectrogram_db.shape[0], mel_spectrogram_db.shape[1], 1)
    
    return model_input
