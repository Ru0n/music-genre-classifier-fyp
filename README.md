# Interactive Music Genre Classifier

An interactive web application that classifies the genre of user-uploaded audio snippets using a Convolutional Neural Network (CNN) trained on audio spectrograms.

## Features

- Upload audio files (WAV, MP3)
- Process audio and generate spectrograms
- Classify music genre using a CNN model
- Display classification results with confidence scores
- Integrated music player
- Automatic playlist generation based on classified genres

## Tech Stack

- **Backend**: Python, Flask
- **Frontend**: React.js
- **ML/DL**: TensorFlow / Keras
- **Audio Processing**: Librosa
- **Dataset**: GTZAN

## Project Structure

```
.
├── backend/                # Flask backend
│   ├── app.py              # Main application file
│   ├── config.py           # Configuration settings
│   ├── api/                # API endpoints
│   ├── models/             # Model loading utilities
│   └── utils/              # Utility functions
├── frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
├── notebooks/              # Jupyter notebooks
│   ├── data_exploration.ipynb
│   ├── spectrogram_generation.ipynb
│   └── model_training.ipynb
├── scripts/                # Utility scripts
│   └── generate_spectrograms.py  # Script to generate Mel spectrograms
├── tests/                  # Test files
│   ├── test_backend.py     # Backend API tests
│   └── test_model.py       # Model functionality tests
├── data/                   # Data directory
│   ├── raw/                # Raw audio files
│   └── processed/          # Processed spectrograms
├── model/                  # Saved models
├── run.py                  # Consolidated server run script
├── requirements.txt        # Python dependencies
└── README.md               # Project documentation
```

## Setup and Installation

### Backend

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the Flask application:
   ```
   # Make sure the virtual environment is activated
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Run the server with default settings (localhost:5001)
   python run.py
   ```
   
   Optional arguments:
   ```
   # Run with network access on port 5001
   python run.py --host 0.0.0.0 --port 5001
   
   # Run on a different port
   python run.py --port 5002
   ```

### Frontend

1. Install dependencies:
   ```
   cd frontend
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

## Spectrogram Generation

The model uses Mel spectrograms generated from audio files for training and prediction. To generate spectrograms:

```bash
cd scripts
python generate_spectrograms.py
```

This script processes audio files from the GTZAN dataset and saves Mel spectrograms as NumPy arrays for model training.

## Usage

1. Upload an audio file (WAV or MP3 format)
2. Wait for processing and classification
3. View the predicted genre and confidence scores
4. Play the audio using the integrated player
5. Explore automatically generated playlists

## Running Tests

To run the tests, make sure the virtual environment is activated:

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Testing the Model

```bash
python tests/test_model.py
```

You can also specify custom paths for the model and scaler:

```bash
python tests/test_model.py path/to/model.keras path/to/scaler.joblib
```

### Testing the Backend API

First, make sure the backend server is running:

```bash
python run.py
```

Then, in a separate terminal:

```bash
python tests/test_backend.py
```

## Model Training

The CNN model is trained on the GTZAN dataset, which contains 1000 audio tracks each 30 seconds long, with 10 genres (100 tracks per genre).

For details on model training, refer to the Jupyter notebooks in the `notebooks/` directory.

## GitHub Repository

Project source code is available at: [https://github.com/Ru0n/music-genre-classifier-fyp](https://github.com/Ru0n/music-genre-classifier-fyp)
