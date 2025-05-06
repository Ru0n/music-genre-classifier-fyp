# Model Files

This directory should contain the following model files:

- `best_chunked_custom_cnn_model.keras` - The best performing CNN model for music genre classification
- `scaler.joblib` - The scaler used for normalizing the input spectrograms

## Obtaining the Model Files

The model files are not included in this repository due to their large size. You can:

1. Train the model yourself using the notebooks in the `notebooks/` directory
2. Download the pre-trained models from [Google Drive](https://drive.google.com/drive/folders/your-folder-id) (replace with your actual link)

## Using the Model Files

Place the downloaded model files in this directory. The backend will automatically load them when you run the application.

## Model Architecture

The model is a Convolutional Neural Network (CNN) trained on mel spectrograms of audio files from the GTZAN dataset. It achieves approximately 70% accuracy on the test set.

For more details on the model architecture and training process, refer to the notebooks in the `notebooks/` directory.