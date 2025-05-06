import librosa
import numpy as np
import os
import logging
from backend.config import SAMPLE_RATE, DURATION, MONO, CHUNK_DURATION_S, SAMPLES_PER_CHUNK, HOP_SAMPLES_BETWEEN_CHUNKS

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

def create_audio_chunks(audio_data, chunk_samples=SAMPLES_PER_CHUNK, hop_samples=HOP_SAMPLES_BETWEEN_CHUNKS):
    """
    Create overlapping chunks from audio data

    Args:
        audio_data (numpy.ndarray): Processed audio signal
        chunk_samples (int): Number of samples per chunk
        hop_samples (int): Number of samples between chunk starts

    Returns:
        list: List of audio chunks
    """
    chunks = []

    # Calculate number of chunks
    num_chunks = int(np.floor((len(audio_data) - chunk_samples) / hop_samples)) + 1

    # Generate chunks
    for i in range(num_chunks):
        start_sample = i * hop_samples
        end_sample = start_sample + chunk_samples
        chunk = audio_data[start_sample:end_sample]

        # Ensure chunk is exactly chunk_samples long
        if len(chunk) == chunk_samples:
            chunks.append(chunk)

    # If no chunks were created (audio too short), use the original audio
    if not chunks and len(audio_data) > 0:
        # Pad if necessary
        if len(audio_data) < chunk_samples:
            padding = chunk_samples - len(audio_data)
            padded_audio = np.pad(audio_data, (0, padding), 'constant')
            chunks.append(padded_audio)
        else:
            # Just take the first chunk_samples
            chunks.append(audio_data[:chunk_samples])

    return chunks

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
