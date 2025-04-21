import librosa
import numpy as np
import os
import logging
from ..config import SAMPLE_RATE, DURATION, MONO

logger = logging.getLogger(__name__)

def process_audio(file_path):
    """
    Process audio file: load, resample, and trim if necessary
    
    Args:
        file_path (str): Path to the audio file
        
    Returns:
        numpy.ndarray: Processed audio signal
    """
    logger.info(f"Processing audio file: {file_path}")
    
    try:
        # Load audio file
        y, sr = librosa.load(file_path, sr=SAMPLE_RATE, mono=MONO)
        
        # Check duration and trim or pad if necessary
        target_length = SAMPLE_RATE * DURATION
        
        if len(y) > target_length:
            # Trim to target length
            y = y[:target_length]
        elif len(y) < target_length:
            # Pad with zeros to target length
            padding = target_length - len(y)
            y = np.pad(y, (0, padding), 'constant')
        
        logger.info(f"Audio processed successfully: {file_path}")
        return y
        
    except Exception as e:
        logger.error(f"Error processing audio file: {e}")
        raise Exception(f"Error processing audio file: {e}")
        
def extract_features(audio_data):
    """
    Extract audio features for classification
    
    Args:
        audio_data (numpy.ndarray): Processed audio signal
        
    Returns:
        dict: Dictionary of extracted features
    """
    features = {}
    
    # Extract MFCCs
    mfccs = librosa.feature.mfcc(y=audio_data, sr=SAMPLE_RATE, n_mfcc=13)
    features['mfccs'] = np.mean(mfccs.T, axis=0)
    
    # Extract spectral centroid
    spectral_centroid = librosa.feature.spectral_centroid(y=audio_data, sr=SAMPLE_RATE)[0]
    features['spectral_centroid'] = np.mean(spectral_centroid)
    
    # Extract spectral bandwidth
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio_data, sr=SAMPLE_RATE)[0]
    features['spectral_bandwidth'] = np.mean(spectral_bandwidth)
    
    # Extract spectral rolloff
    spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_data, sr=SAMPLE_RATE)[0]
    features['spectral_rolloff'] = np.mean(spectral_rolloff)
    
    # Extract zero crossing rate
    zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_data)[0]
    features['zero_crossing_rate'] = np.mean(zero_crossing_rate)
    
    # Extract chroma features
    chroma = librosa.feature.chroma_stft(y=audio_data, sr=SAMPLE_RATE)
    features['chroma'] = np.mean(chroma.T, axis=0)
    
    return features
