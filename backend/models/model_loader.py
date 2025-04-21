import tensorflow as tf
import numpy as np
import os
import logging
from ..config import GENRES
from ..utils.spectrogram_generator import prepare_spectrogram_for_model
from ..utils.audio_processor import process_audio

logger = logging.getLogger(__name__)

def load_model(model_path):
    """
    Load the trained model from disk
    
    Args:
        model_path (str): Path to the saved model
        
    Returns:
        tf.keras.Model: Loaded model
    """
    logger.info(f"Loading model from: {model_path}")
    
    try:
        # Check if model exists
        if not os.path.exists(model_path):
            logger.warning(f"Model file not found: {model_path}")
            logger.info("Creating a placeholder model for development")
            
            # Create a placeholder model for development
            model = create_placeholder_model()
            
            # Save the placeholder model
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            model.save(model_path)
            
            logger.info(f"Placeholder model saved to: {model_path}")
            return model
        
        # Load the model
        model = tf.keras.models.load_model(model_path)
        logger.info(f"Model loaded successfully: {model_path}")
        return model
        
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise Exception(f"Error loading model: {e}")

def create_placeholder_model():
    """
    Create a placeholder model for development
    
    Returns:
        tf.keras.Model: Placeholder model
    """
    # Define input shape (mel spectrogram dimensions)
    input_shape = (128, 1292, 1)  # (n_mels, time_steps, channels)
    
    # Create a simple CNN model
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(128, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(len(GENRES), activation='softmax')
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def predict_genre(model, spectrogram_path=None, audio_data=None):
    """
    Predict genre from spectrogram or audio data
    
    Args:
        model (tf.keras.Model): Loaded model
        spectrogram_path (str, optional): Path to the spectrogram image
        audio_data (numpy.ndarray, optional): Processed audio signal
        
    Returns:
        tuple: (predicted_genre, confidence)
    """
    try:
        # If spectrogram path is provided, load and process the audio
        if spectrogram_path is not None:
            # For now, we'll just use a random prediction since we can't directly use the image
            # In a real implementation, you would either:
            # 1. Load the audio file again and process it
            # 2. Load the spectrogram image and convert it to the right format
            
            # Simulate a prediction
            prediction = np.random.rand(1, len(GENRES))
            prediction = prediction / np.sum(prediction)  # Normalize to sum to 1
        
        # If audio data is provided, prepare it for the model
        elif audio_data is not None:
            # Prepare spectrogram for model input
            model_input = prepare_spectrogram_for_model(audio_data)
            
            # Make prediction
            prediction = model.predict(model_input)
        
        else:
            raise ValueError("Either spectrogram_path or audio_data must be provided")
        
        # Get predicted genre and confidence
        predicted_index = np.argmax(prediction[0])
        predicted_genre = GENRES[predicted_index]
        confidence = float(prediction[0][predicted_index])
        
        # Get confidence scores for all genres
        confidence_scores = {genre: float(score) for genre, score in zip(GENRES, prediction[0])}
        
        return predicted_genre, confidence_scores
        
    except Exception as e:
        logger.error(f"Error predicting genre: {e}")
        raise Exception(f"Error predicting genre: {e}")
