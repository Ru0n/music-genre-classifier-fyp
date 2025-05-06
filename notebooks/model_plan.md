# Documentation: Custom CNN for Music Genre Classification (GTZAN Spectrograms)

## 1. Overview

**Goal:** This document outlines the process implemented in the associated Jupyter Notebook for training and evaluating a custom Convolutional Neural Network (CNN) to classify music genres. The model utilizes Mel spectrogram representations derived from the GTZAN dataset.

**Objectives:**
* Process audio data into Mel spectrograms suitable for CNN input.
* Implement robust data preparation, including global normalization and train/validation/test splitting.
* Define and train a custom CNN architecture incorporating data augmentation and regularization techniques.
* Evaluate model performance using standard classification metrics.
* Provide a reproducible workflow for experimentation.

## 2. Dependencies

The workflow relies on the following core Python libraries:

* **Data Handling:** `numpy`, `pandas` (implied, though less direct usage in final modeling notebook)
* **Audio Processing:** `librosa`
* **Machine Learning:** `tensorflow` (including `keras`), `scikit-learn` (for splitting and scaling)
* **Visualization:** `matplotlib`, `seaborn`
* **Utilities:** `os`, `math`, `random`, `warnings`, `json` (optional, if saving metadata)

## 3. Configuration Parameters

Key parameters controlling the workflow are defined at the beginning of the notebook:

* **Paths:** `SPECTROGRAM_NPY_PATH` (input pre-processed spectrograms), `MODEL_SAVE_DIR`, `BEST_MODEL_PATH`.
* **Audio Settings:** `SAMPLE_RATE` (standardized sampling rate for consistency).
* **Spectrogram Settings:** `N_MELS`, `N_FFT`, `HOP_LENGTH` (defining the Mel spectrogram transformation), `EXPECTED_LENGTH` (target time dimension for padding/truncation).
* **Dataset:** `GENRES` (list of target classes), `NUM_GENRES`.
* **Augmentation:** `FREQ_MASK_PARAM`, `TIME_MASK_PARAM` (controlling the intensity of SpecAugment).
* **Training:** `EPOCHS`, `BATCH_SIZE`, `VALIDATION_SPLIT`, `LEARNING_RATE`.
* **Reproducibility:** `SEED` (for random operations in `random`, `numpy`, `tensorflow`).

## 4. Data Loading & Preprocessing

This phase assumes Mel spectrograms have been previously generated from the raw GTZAN `.wav` files (using parameters defined in Configuration) and saved as individual `.npy` files, organized into subdirectories named by genre within `SPECTROGRAM_NPY_PATH`.

* **Loading:** Iterates through `GENRES`, locating corresponding subdirectories. Loads each `.npy` file within a genre subdirectory.
* **Validation:** Basic checks are performed for file existence, expected 2D shape, and correct number of Mel bands (`N_MELS`). Files failing checks are skipped with warnings.
* **Resizing/Padding:** The `resize_spectrogram` function ensures all loaded spectrograms have a consistent time dimension (`EXPECTED_LENGTH`).
    * Spectrograms longer than `EXPECTED_LENGTH` are truncated.
    * Spectrograms shorter than `EXPECTED_LENGTH` are padded (using the minimum value of the spectrogram, often representing silence/low energy) to reach the target length. This standardization is essential for batch processing in the CNN.
* **Output:** Populates `spectrograms` (list of NumPy arrays) and `labels` (list of corresponding integer indices). These are converted to NumPy arrays.

## 5. Data Preparation for Training

Transforms the loaded data into the format required for TensorFlow/Keras model training:

* **Channel Dimension:** Adds a channel dimension (`np.newaxis`) to the spectrogram array (`X`), resulting in a shape like `(num_samples, N_MELS, EXPECTED_LENGTH, 1)`. This is standard for 2D CNNs processing grayscale-like images.
* **Label Encoding:** Converts integer labels to one-hot encoded vectors using `to_categorical`. The shape becomes `(num_samples, NUM_GENRES)`.
* **Data Splitting:**
    * Uses `train_test_split` from `scikit-learn`.
    * First splits into initial training (80%) and test (20%) sets.
    * Then splits the initial training set again into final training (64% of total) and validation (16% of total) sets.
    * `stratify` is used in both splits to maintain the proportional representation of each genre across the sets, crucial for reliable evaluation.
* **Global Normalization:**
    * Applies Min-Max scaling to bring spectrogram values (originally dB) into the [0, 1] range.
    * **Crucially, the `MinMaxScaler` is fitted *only* on the training data (`X_train`)**.
    * The *same fitted scaler* is then used to `transform` the training, validation, *and* test sets.
    * This prevents data leakage from the validation/test sets into the training process and ensures consistent scaling based on the training data's distribution. Data is temporarily reshaped for the scaler and then reshaped back.

## 6. Custom Augmentation Layers

To artificially expand the training dataset and improve model generalization, custom Keras layers implementing SpecAugment techniques are defined and integrated into the model:

* **`FrequencyMasking`:** Randomly masks out a contiguous range of Mel frequency bands during training.
* **`TimeMasking`:** Randomly masks out a contiguous range of time steps during training.
* **Implementation:**
    * Defined as subclasses of `tf.keras.layers.Layer`.
    * Use `tf.cond` to apply augmentation *only* when `training=True` is passed to the layer's `call` method (i.e., during `model.fit`, not `model.evaluate` or `model.predict`).
    * Include `get_config` method and the `@register_keras_serializable` decorator to ensure models using these layers can be saved and loaded correctly.

## 7. Model Architecture (Custom CNN)

A sequential Keras model (`build_custom_cnn_model`) is defined with the following structure:

* **Input Layer:** Explicitly defined using `layers.Input` with the shape derived from the processed data (`N_MELS, EXPECTED_LENGTH, 1`).
* **Augmentation Layers:** `FrequencyMasking` and `TimeMasking` layers are placed immediately after the input layer.
* **Convolutional Blocks (3 Blocks):**
    * Each block typically contains:
        * Two `Conv2D` layers with (3, 3) kernels, 'same' padding, ReLU activation (via `layers.Activation`), and L2 kernel regularization. Using two Conv layers before pooling increases representational capacity compared to one.
        * `BatchNormalization` after each Conv layer (before activation) to stabilize training.
        * `MaxPooling2D` layer ((2, 2) or (3, 3) pool size, strides=(2, 2)) to reduce spatial dimensions.
        * `Dropout` layer (e.g., 0.25-0.3) after pooling for regularization within the convolutional base.
* **Global Average Pooling (GAP):** `layers.GlobalAveragePooling2D` layer replaces a traditional `Flatten` layer. It averages feature maps spatially, significantly reducing parameters and often improving robustness.
* **Classification Head:**
    * A `Dense` layer (e.g., 128 units) with ReLU activation and L2 kernel regularization.
    * A final `Dropout` layer (e.g., 0.5) for regularization before the output.
    * The output `Dense` layer with `NUM_GENRES` units and `softmax` activation for multi-class probability outputs.

## 8. Model Compilation

The model is compiled using `model.compile` with:

* **Optimizer:** `tf.keras.optimizers.Adam` with a specified initial `LEARNING_RATE`. Adam is a common and effective adaptive learning rate optimizer.
* **Loss Function:** `categorical_crossentropy`, standard for multi-class classification with one-hot encoded labels.
* **Metrics:** `['accuracy']` to monitor classification accuracy during training and evaluation.

## 9. Training Process

The model is trained using `model.fit`:

* **Data:** Uses the scaled training data (`X_train`, `y_train`) and validation data (`X_val`, `y_val`).
* **Epochs & Batch Size:** Trains for a maximum of `EPOCHS`, processing data in batches of `BATCH_SIZE`.
* **Callbacks:** Utilizes several callbacks to manage the training process:
    * `ModelCheckpoint`: Saves the model weights (`.keras` format) only when validation accuracy improves, ensuring the best model is preserved. Monitors `val_accuracy`.
    * `ReduceLROnPlateau`: Reduces the learning rate automatically if the validation loss stagnates, helping the model fine-tune in later stages. Monitors `val_loss`.
    * `EarlyStopping`: Stops training prematurely if the validation loss does not improve for a defined `patience` number of epochs, preventing severe overfitting and saving time. Restores the best weights found during training (`restore_best_weights=True`). Monitors `val_loss`.

## 10. Evaluation

Model performance is assessed after training:

* **Training History:** The `history` object returned by `model.fit` is used to plot accuracy and loss curves for both training and validation sets over epochs. This helps visualize learning progress and diagnose issues like overfitting.
* **Best Model Loading:** The best model saved by `ModelCheckpoint` (based on `val_accuracy`) is loaded using `models.load_model`, ensuring evaluation uses the optimal weights found during training. Requires providing `custom_objects` argument for the custom augmentation layers.
* **Test Set Evaluation:** The loaded best model is evaluated on the unseen test set (`X_test`, `y_test`) using `model.evaluate` to get final test loss and accuracy metrics.
* **Confusion Matrix:** Generated using `sklearn.metrics.confusion_matrix` and visualized with `seaborn.heatmap`. Shows correct and incorrect classifications for each genre, highlighting which genres are often confused.
* **Classification Report:** Generated using `sklearn.metrics.classification_report`. Provides per-class precision, recall, F1-score, and support, along with overall accuracy and averages.

## 11. Prediction on Sample

Demonstrates how to use the trained model for inference on a single spectrogram instance:

* Loads the best saved model (if not already loaded).
* Selects a sample from the *scaled* test set.
* Ensures the sample has the correct shape (including batch and channel dimensions).
* Uses `model.predict` to get probability scores for each genre.
* Determines the predicted genre using `np.argmax`.
* Displays the true genre, predicted genre, and confidence scores.
* Plots the (normalized) input spectrogram for visual inspection.