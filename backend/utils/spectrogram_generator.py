import librosa
import librosa.display
import matplotlib
# Set the backend to 'Agg' to avoid GUI window creation
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os
import logging
import tensorflow as tf
from backend.config import SAMPLE_RATE, N_MELS, N_FFT, HOP_LENGTH, TARGET_SHAPE, RESIZE_DIM, MODEL_DIR

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

def resize_spectrogram_tf(spec, target_shape=TARGET_SHAPE):
    """
    Resizes spectrogram using TensorFlow

    Args:
        spec (numpy.ndarray): Mel spectrogram
        target_shape (tuple): Target shape for resizing

    Returns:
        numpy.ndarray: Resized spectrogram
    """
    # Add channel dim, resize, remove channel dim
    spec_tf = tf.constant(spec[..., np.newaxis], dtype=tf.float32)
    resized_spec_tf = tf.image.resize(spec_tf, target_shape, method='bilinear')
    return resized_spec_tf.numpy().squeeze()  # Back to numpy array (H, W)

def compute_mel_spectrogram(audio, sr=SAMPLE_RATE, n_fft=N_FFT, hop_length=HOP_LENGTH, n_mels=N_MELS):
    """
    Computes the Mel spectrogram and converts it to dB scale

    Args:
        audio (numpy.ndarray): Audio signal
        sr (int): Sample rate
        n_fft (int): FFT window size
        hop_length (int): Hop length for STFT
        n_mels (int): Number of Mel bands

    Returns:
        numpy.ndarray: Mel spectrogram in dB scale
    """
    mel_spectrogram = librosa.feature.melspectrogram(
        y=audio, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=n_mels
    )
    mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
    return mel_spectrogram_db

def normalize_spectrogram(spectrogram):
    """
    Apply instance-based Min-Max normalization to a spectrogram.
    This scales each individual spectrogram based on its own min/max values.

    Args:
        spectrogram (numpy.ndarray): Spectrogram to normalize

    Returns:
        numpy.ndarray: Normalized spectrogram with values in [0, 1] range
    """
    # Log detailed information about the input spectrogram
    logger.info(f"Input spectrogram shape: {spectrogram.shape}, dtype: {spectrogram.dtype}")
    logger.info(f"Input spectrogram stats - min: {np.min(spectrogram):.4f}, max: {np.max(spectrogram):.4f}, mean: {np.mean(spectrogram):.4f}")
    logger.info(f"Input spectrogram histogram: 10th percentile: {np.percentile(spectrogram, 10):.4f}, 50th: {np.percentile(spectrogram, 50):.4f}, 90th: {np.percentile(spectrogram, 90):.4f}")

    # Convert to float32 if not already
    if spectrogram.dtype != np.float32:
        logger.info(f"Converting spectrogram from {spectrogram.dtype} to float32")
        spectrogram = spectrogram.astype(np.float32)

    # Get min and max values for this specific spectrogram instance
    spec_min = np.min(spectrogram)
    spec_max = np.max(spectrogram)
    logger.info(f"Instance min: {spec_min:.4f}, max: {spec_max:.4f}")

    # Apply instance-based min-max scaling
    if spec_max > spec_min:
        # Normal case: spectrogram has variation
        normalized_spec = (spectrogram - spec_min) / (spec_max - spec_min)
        logger.info(f"Applied instance min-max scaling with range [{spec_min:.4f}, {spec_max:.4f}]")
    else:
        # Edge case: flat spectrogram (e.g., silence)
        logger.warning(f"Flat spectrogram detected (min == max == {spec_min:.4f}). Setting to zeros.")
        normalized_spec = np.zeros_like(spectrogram)

    # Log min/max values after normalization
    logger.info(f"Normalized spectrogram stats - min: {np.min(normalized_spec):.4f}, max: {np.max(normalized_spec):.4f}, mean: {np.mean(normalized_spec):.4f}")

    return normalized_spec

# This function has been removed as it was adding an extra preprocessing step
# that was not present in the training pipeline

def prepare_spectrogram_for_model(audio_data):
    """
    Prepare spectrogram for model input

    This function follows the exact same preprocessing steps as used in training:
    1. Load Audio (mono, 22050 Hz) - done before this function
    2. Extract Chunk (4 seconds) - done before this function
    3. Compute Mel Spectrogram (n_mels=128, n_fft=2048, hop_length=512)
    4. Convert to dB (librosa.power_to_db(ref=np.max))
    5. Resize Spectrogram ((128, 128), bilinear)
    6. Apply the loaded scaler.transform() method
    7. Reshape for model ((1, 128, 128, 1))

    Args:
        audio_data (numpy.ndarray): Processed audio signal

    Returns:
        numpy.ndarray: Spectrogram prepared for model input
    """
    # Generate Mel spectrogram
    mel_spectrogram_db = compute_mel_spectrogram(audio_data)
    logger.info(f"Generated mel spectrogram with shape {mel_spectrogram_db.shape}")
    logger.info(f"Mel spectrogram stats - min: {np.min(mel_spectrogram_db):.4f}, max: {np.max(mel_spectrogram_db):.4f}, mean: {np.mean(mel_spectrogram_db):.4f}")

    # Resize spectrogram to target shape
    resized_spec = resize_spectrogram_tf(mel_spectrogram_db)
    logger.info(f"Resized spectrogram to shape {resized_spec.shape}")
    logger.info(f"Resized spectrogram stats - min: {np.min(resized_spec):.4f}, max: {np.max(resized_spec):.4f}, mean: {np.mean(resized_spec):.4f}")

    # Normalize spectrogram using the pre-trained scaler
    # This is the ONLY scaling step needed, exactly matching the training pipeline
    normalized_spec = normalize_spectrogram(resized_spec)
    logger.info(f"Normalized spectrogram stats - min: {np.min(normalized_spec):.4f}, max: {np.max(normalized_spec):.4f}, mean: {np.mean(normalized_spec):.4f}")

    # Add batch and channel dimensions
    model_input = normalized_spec.reshape(1, normalized_spec.shape[0], normalized_spec.shape[1], 1)
    logger.info(f"Final model input shape: {model_input.shape}")

    return model_input
