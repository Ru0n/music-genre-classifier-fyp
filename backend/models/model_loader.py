import tensorflow as tf
import numpy as np
import os
import logging
from tensorflow.keras import layers, models
from tensorflow.keras.regularizers import l2
from tensorflow.keras.saving import register_keras_serializable
from backend.config import GENRES, TARGET_SHAPE
from backend.utils.spectrogram_generator import prepare_spectrogram_for_model
from backend.utils.audio_processor import process_audio, create_audio_chunks

logger = logging.getLogger(__name__)

# Define custom layers for model loading
@register_keras_serializable(package="Custom", name="FrequencyMasking")
class FrequencyMasking(layers.Layer):
    """Applies Frequency Masking augmentation."""
    def __init__(self, freq_mask_param, name="frequency_masking", **kwargs):
        super().__init__(name=name, **kwargs)
        self.freq_mask_param = freq_mask_param

    def call(self, inputs, training=None):
        if training is None: training = False
        def apply_augmentation():
            n_mels = tf.shape(inputs)[1]
            f = tf.random.uniform(shape=(), minval=0, maxval=self.freq_mask_param + 1, dtype=tf.int32)
            def perform_mask():
                f0 = tf.random.uniform(shape=(), minval=0, maxval=n_mels - f, dtype=tf.int32)
                mask_value = 0.0
                mask = tf.concat([tf.ones(shape=(1, f0, 1, 1), dtype=inputs.dtype),
                                  tf.fill(dims=(1, f, 1, 1), value=mask_value),
                                  tf.ones(shape=(1, n_mels - f0 - f, 1, 1), dtype=inputs.dtype)], axis=1)
                batch_size = tf.shape(inputs)[0]
                mask_repeated = tf.tile(mask, [batch_size, 1, tf.shape(inputs)[2], 1])
                return inputs * mask_repeated
            return tf.cond(tf.greater(f, 0), true_fn=perform_mask, false_fn=lambda: inputs)
        return tf.cond(tf.cast(training, tf.bool), true_fn=apply_augmentation, false_fn=lambda: inputs)

    def get_config(self):
        config = super().get_config()
        config.update({"freq_mask_param": self.freq_mask_param})
        return config

@register_keras_serializable(package="Custom", name="TimeMasking")
class TimeMasking(layers.Layer):
    """Applies Time Masking augmentation."""
    def __init__(self, time_mask_param, name="time_masking", **kwargs):
        super().__init__(name=name, **kwargs)
        self.time_mask_param = time_mask_param

    def call(self, inputs, training=None):
        if training is None: training = False
        def apply_augmentation():
            time_steps = tf.shape(inputs)[2]
            t = tf.random.uniform(shape=(), minval=0, maxval=self.time_mask_param + 1, dtype=tf.int32)
            def perform_mask():
                t0 = tf.random.uniform(shape=(), minval=0, maxval=time_steps - t, dtype=tf.int32)
                mask_value = 0.0
                mask = tf.concat([tf.ones(shape=(1, 1, t0, 1), dtype=inputs.dtype),
                                  tf.fill(dims=(1, 1, t, 1), value=mask_value),
                                  tf.ones(shape=(1, 1, time_steps - t0 - t, 1), dtype=inputs.dtype)], axis=2)
                batch_size = tf.shape(inputs)[0]
                mask_repeated = tf.tile(mask, [batch_size, tf.shape(inputs)[1], 1, 1])
                return inputs * mask_repeated
            return tf.cond(tf.greater(t, 0), true_fn=perform_mask, false_fn=lambda: inputs)
        return tf.cond(tf.cast(training, tf.bool), true_fn=apply_augmentation, false_fn=lambda: inputs)

    def get_config(self):
        config = super().get_config()
        config.update({"time_mask_param": self.time_mask_param})
        return config

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

        # Load the model with custom objects for the augmentation layers
        custom_objects = {
            "FrequencyMasking": FrequencyMasking,
            "TimeMasking": TimeMasking
        }
        model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        logger.info(f"Model loaded successfully: {model_path}")

        # Log model summary and output layer shape
        model_summary = []
        model.summary(print_fn=lambda x: model_summary.append(x))
        logger.info("\n".join(model_summary))

        # Check output layer
        output_layer = model.layers[-1]
        logger.info(f"Output layer: {output_layer.name}, units: {output_layer.units}, activation: {output_layer.activation.__name__}")

        # Verify model output shape matches number of genres
        if output_layer.units != len(GENRES):
            logger.warning(f"Model output units ({output_layer.units}) doesn't match number of genres ({len(GENRES)})")

        # Test model with random input
        test_model_with_random_input(model)

        return model

    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise Exception(f"Error loading model: {e}")

def test_model_with_random_input(model):
    """
    Test the model with random input to verify it's working correctly

    Args:
        model (tf.keras.Model): The loaded model to test
    """
    try:
        # Create random input with the expected shape
        input_shape = model.input_shape
        random_input = np.random.random((1, input_shape[1], input_shape[2], input_shape[3]))

        # Make prediction
        logger.info("Testing model with random input...")
        prediction = model.predict(random_input, verbose=0)[0]

        # Log prediction results
        logger.info(f"Random input prediction: {prediction}")
        logger.info(f"Prediction values: {', '.join([f'{genre}: {score:.4f}' for genre, score in zip(GENRES, prediction)])}")
        predicted_index = np.argmax(prediction)
        logger.info(f"Predicted genre from random input: {GENRES[predicted_index]} (index {predicted_index}) with confidence: {prediction[predicted_index]:.4f}")

        # Check if all predictions are the same or very similar
        if np.std(prediction) < 0.01:
            logger.warning("All prediction values are very similar, model might not be discriminating between classes")

        # Check if one class is dominating predictions
        if prediction[predicted_index] > 0.9:
            logger.warning(f"One class ({GENRES[predicted_index]}) is dominating predictions with very high confidence")
            logger.warning(f"This indicates a potential issue with the model - it may be biased toward one class")

            # Test with a different random input to confirm bias
            logger.info("Testing with a second random input to confirm bias...")
            random_input2 = np.random.random((1, input_shape[1], input_shape[2], input_shape[3]))
            prediction2 = model.predict(random_input2, verbose=0)[0]
            predicted_index2 = np.argmax(prediction2)
            logger.info(f"Second random input prediction: {GENRES[predicted_index2]} with confidence: {prediction2[predicted_index2]:.4f}")

            if predicted_index == predicted_index2 and prediction2[predicted_index2] > 0.9:
                logger.error(f"MODEL BIAS CONFIRMED: Model consistently predicts {GENRES[predicted_index]} with high confidence")
                logger.error(f"This model may need to be retrained with better class balancing")

    except Exception as e:
        logger.error(f"Error testing model with random input: {e}")
        import traceback
        logger.error(traceback.format_exc())

def create_placeholder_model():
    """
    Create a placeholder model for development that matches the architecture of the trained model

    Returns:
        tf.keras.Model: Placeholder model
    """
    # Define input shape (mel spectrogram dimensions)
    input_shape = (TARGET_SHAPE[0], TARGET_SHAPE[1], 1)  # (height, width, channels)

    # Create a model with the same architecture as the trained model
    model = models.Sequential(name="Refined_CNN_Genre_Classifier")
    model.add(layers.Input(shape=input_shape, name="Input_Spectrogram"))

    # Augmentation layers
    model.add(FrequencyMasking(25, name="FreqMask"))
    model.add(TimeMasking(30, name="TimeMask"))

    # Block 1
    model.add(layers.Conv2D(32, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv1_1"))
    model.add(layers.BatchNormalization(name="BN1_1"))
    model.add(layers.Activation('relu', name="Relu1_1"))
    model.add(layers.Conv2D(32, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv1_2"))
    model.add(layers.BatchNormalization(name="BN1_2"))
    model.add(layers.Activation('relu', name="Relu1_2"))
    model.add(layers.MaxPooling2D((2, 2), strides=(2, 2), name="Pool1"))
    model.add(layers.Dropout(0.25, name="Drop1"))

    # Block 2
    model.add(layers.Conv2D(64, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv2_1"))
    model.add(layers.BatchNormalization(name="BN2_1"))
    model.add(layers.Activation('relu', name="Relu2_1"))
    model.add(layers.Conv2D(64, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv2_2"))
    model.add(layers.BatchNormalization(name="BN2_2"))
    model.add(layers.Activation('relu', name="Relu2_2"))
    model.add(layers.MaxPooling2D((2, 2), strides=(2, 2), name="Pool2"))
    model.add(layers.Dropout(0.25, name="Drop2"))

    # Block 3
    model.add(layers.Conv2D(128, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv3_1"))
    model.add(layers.BatchNormalization(name="BN3_1"))
    model.add(layers.Activation('relu', name="Relu3_1"))
    model.add(layers.Conv2D(128, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv3_2"))
    model.add(layers.BatchNormalization(name="BN3_2"))
    model.add(layers.Activation('relu', name="Relu3_2"))
    model.add(layers.MaxPooling2D((2, 2), strides=(2, 2), name="Pool3"))
    model.add(layers.Dropout(0.3, name="Drop3"))

    # Block 4
    model.add(layers.Conv2D(256, (3, 3), padding='same', kernel_regularizer=l2(0.001), name="Conv4_1"))
    model.add(layers.BatchNormalization(name="BN4_1"))
    model.add(layers.Activation('relu', name="Relu4_1"))
    model.add(layers.MaxPooling2D((2, 2), strides=(2, 2), name="Pool4"))
    model.add(layers.Dropout(0.3, name="Drop4"))

    # Classification Head
    model.add(layers.GlobalAveragePooling2D(name="GAP"))
    model.add(layers.Dense(128, activation='relu', kernel_regularizer=l2(0.001), name="Dense1"))
    model.add(layers.Dropout(0.5, name="Drop_Dense"))
    model.add(layers.Dense(len(GENRES), activation='softmax', name="Output_Softmax"))

    # Compile the model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
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
        tuple: (predicted_genre, confidence_scores)
    """
    try:
        logger.info(f"Starting genre prediction. Spectrogram path: {spectrogram_path is not None}, Audio data shape: {audio_data.shape if audio_data is not None else None}")
        logger.info(f"Model input shape: {model.input_shape}, output shape: {model.output_shape}")

        # No scaler verification needed - using instance-based normalization

        # If spectrogram path is provided, load and process the audio
        if spectrogram_path is not None:
            logger.info(f"Using spectrogram path for prediction: {spectrogram_path}")
            # For now, we'll just use a random prediction since we can't directly use the image
            # In a real implementation, you would either:
            # 1. Load the audio file again and process it
            # 2. Load the spectrogram image and convert it to the right format

            # Simulate a prediction
            prediction = np.random.rand(1, len(GENRES))
            prediction = prediction / np.sum(prediction)  # Normalize to sum to 1

            # Get predicted genre and confidence
            predicted_index = np.argmax(prediction[0])
            predicted_genre = GENRES[predicted_index]

            # Get confidence scores for all genres
            confidence_scores = {genre: float(score) for genre, score in zip(GENRES, prediction[0])}

            logger.info(f"Prediction from spectrogram complete. Predicted genre: {predicted_genre}")
            return predicted_genre, confidence_scores

        # If audio data is provided, process it
        elif audio_data is not None:
            logger.info(f"Using audio data for prediction. Audio data length: {len(audio_data)}")
            logger.info(f"Audio data stats - min: {np.min(audio_data):.4f}, max: {np.max(audio_data):.4f}, mean: {np.mean(audio_data):.4f}")

            # Create chunks from the audio data
            chunks = create_audio_chunks(audio_data)
            logger.info(f"Created {len(chunks)} audio chunks for prediction")

            if not chunks:
                logger.error("No valid audio chunks could be created")
                raise ValueError("No valid audio chunks could be created")

            # Process each chunk and get predictions
            all_predictions = []
            for i, chunk in enumerate(chunks):
                logger.info(f"Processing chunk {i+1}/{len(chunks)}. Chunk length: {len(chunk)}")
                logger.info(f"Chunk {i+1} stats - min: {np.min(chunk):.4f}, max: {np.max(chunk):.4f}, mean: {np.mean(chunk):.4f}")

                try:
                    # Prepare spectrogram for model input
                    chunk_input = prepare_spectrogram_for_model(chunk)
                    logger.info(f"Prepared spectrogram for chunk {i+1}. Shape: {chunk_input.shape}")
                    logger.info(f"Model input stats - min: {np.min(chunk_input):.4f}, max: {np.max(chunk_input):.4f}, mean: {np.mean(chunk_input):.4f}")

                    # Make prediction
                    logger.info(f"Making prediction for chunk {i+1}")
                    chunk_prediction = model.predict(chunk_input, verbose=0)[0]
                    logger.info(f"Prediction for chunk {i+1} complete. Raw prediction: {chunk_prediction}")
                    logger.info(f"Prediction values: {', '.join([f'{genre}: {score:.4f}' for genre, score in zip(GENRES, chunk_prediction)])}")

                    # Check if prediction is heavily biased toward one class
                    max_prob = np.max(chunk_prediction)
                    if max_prob > 0.9:
                        logger.warning(f"Chunk {i+1} prediction is heavily biased toward {GENRES[np.argmax(chunk_prediction)]} with probability {max_prob:.4f}")

                    # Check if prediction is uniform (model not discriminating)
                    if np.std(chunk_prediction) < 0.05:
                        logger.warning(f"Chunk {i+1} prediction has low standard deviation ({np.std(chunk_prediction):.4f}), model may not be discriminating between classes")

                    all_predictions.append(chunk_prediction)
                except Exception as chunk_error:
                    logger.error(f"Error processing chunk {i+1}: {chunk_error}")
                    import traceback
                    logger.error(traceback.format_exc())
                    # Continue with other chunks instead of failing completely
                    continue

            if not all_predictions:
                logger.error("No valid predictions could be made from any chunks")
                raise ValueError("No valid predictions could be made from any chunks")

            # Average predictions across all chunks
            avg_prediction = np.mean(all_predictions, axis=0)
            logger.info(f"Averaged predictions across {len(all_predictions)} chunks")
            logger.info(f"Average prediction values: {', '.join([f'{genre}: {score:.4f}' for genre, score in zip(GENRES, avg_prediction)])}")

            # Check if predictions are heavily biased toward one class
            max_prob = np.max(avg_prediction)
            predicted_index = np.argmax(avg_prediction)  # Get predicted index first

            if max_prob > 0.95:
                logger.warning(f"Prediction is heavily biased toward one class with probability {max_prob:.4f}")
                logger.warning(f"This indicates a potential issue with the model or preprocessing")

                # Log the issue but don't modify the predictions
                if max_prob > 0.99:
                    logger.warning(f"Model is showing extreme bias toward {GENRES[predicted_index]}")
                    logger.warning(f"This may indicate a preprocessing mismatch between training and inference")

            # Get predicted genre and confidence
            # predicted_index already calculated above
            predicted_genre = GENRES[predicted_index]
            logger.info(f"Predicted index: {predicted_index}, genre: {predicted_genre}")

            # Get confidence scores for all genres
            confidence_scores = {genre: float(score) for genre, score in zip(GENRES, avg_prediction)}

            logger.info(f"Prediction complete. Predicted genre: {predicted_genre} with confidence: {avg_prediction[predicted_index]:.4f}")
            return predicted_genre, confidence_scores

        else:
            logger.error("Neither spectrogram_path nor audio_data was provided")
            raise ValueError("Either spectrogram_path or audio_data must be provided")

    except Exception as e:
        logger.error(f"Error predicting genre: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise Exception(f"Error predicting genre: {e}")
