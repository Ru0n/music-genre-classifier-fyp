#!/usr/bin/env python
"""
Script to test the model with a known good input.
This script loads the model and tests it with a sample input that should produce a valid prediction.
"""

import os
import sys
import numpy as np
import tensorflow as tf
import joblib
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_model(model_path, scaler_path):
    """
    Test the model with a known good input.
    
    Args:
        model_path (str): Path to the model file
        scaler_path (str): Path to the scaler.joblib file
    """
    logger.info(f"Testing model: {model_path}")
    logger.info(f"Using scaler: {scaler_path}")
    
    try:
        # Load the model
        model = tf.keras.models.load_model(model_path, compile=False)
        logger.info(f"Model loaded successfully")
        
        # Print model summary
        model.summary(print_fn=logger.info)
        
        # Load the scaler
        scaler = joblib.load(scaler_path)
        logger.info(f"Scaler loaded successfully")
        
        # Create a test input
        # First, create a random input with the expected shape
        input_shape = model.input_shape
        logger.info(f"Model input shape: {input_shape}")
        
        # Create a random spectrogram-like input
        # Use values that are typical for mel spectrograms (e.g., -80 to 0 dB)
        random_input = np.random.uniform(low=-80, high=0, size=(128, 128))
        logger.info(f"Random input shape: {random_input.shape}")
        logger.info(f"Random input min: {np.min(random_input)}, max: {np.max(random_input)}, mean: {np.mean(random_input)}")
        
        # Normalize the input using the scaler
        reshaped_input = random_input.reshape(1, -1)
        normalized_input = scaler.transform(reshaped_input).reshape(random_input.shape)
        logger.info(f"Normalized input min: {np.min(normalized_input)}, max: {np.max(normalized_input)}, mean: {np.mean(normalized_input)}")
        
        # Add batch and channel dimensions
        model_input = normalized_input.reshape(1, normalized_input.shape[0], normalized_input.shape[1], 1)
        logger.info(f"Model input shape: {model_input.shape}")
        
        # Make a prediction
        prediction = model.predict(model_input, verbose=0)[0]
        logger.info(f"Prediction shape: {prediction.shape}")
        logger.info(f"Prediction: {prediction}")
        
        # Get the predicted class
        predicted_class = np.argmax(prediction)
        confidence = prediction[predicted_class]
        logger.info(f"Predicted class: {predicted_class}, confidence: {confidence:.4f}")
        
        # Check if the prediction is reasonable
        if confidence > 0.9:
            logger.warning(f"Prediction confidence is very high ({confidence:.4f}). This might indicate a bias in the model.")
        
        # Check if all predictions are similar
        if np.std(prediction) < 0.1:
            logger.warning(f"Prediction standard deviation is low ({np.std(prediction):.4f}). The model might not be discriminating between classes.")
        
        return True
    
    except Exception as e:
        logger.error(f"Error testing model: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    # Get paths from command line arguments or use defaults
    if len(sys.argv) > 2:
        model_path = sys.argv[1]
        scaler_path = sys.argv[2]
    else:
        # Default paths
        model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'best_chunked_custom_cnn_model.keras')
        scaler_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'scaler.joblib')
    
    success = test_model(model_path, scaler_path)
    if success:
        logger.info("Model testing completed successfully")
    else:
        logger.error("Model testing failed")
        sys.exit(1)
