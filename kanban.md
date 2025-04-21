# Project Kanban Board: Interactive Music Genre Classifier

## Backlog

* **EPIC: Data Acquisition & Preprocessing**
    * Download/access GTZAN dataset [cite: 29, 30, 31, 32, 33]
    * Develop script/notebook to load audio files
    * Save processed spectrograms and labels for training

* **EPIC: Model Development & Training**
    * Design initial 2D CNN architecture [cite: 13]
    * Implement CNN model using Keras/TensorFlow [cite: 45]
    * Set up training pipeline (data loading, training loop, evaluation)
    * Train initial model on spectrograms
    * Evaluate initial model performance (accuracy, loss)
    * Iterate on model architecture/hyperparameters (if needed)
    * Save trained model weights
* **EPIC: Backend Development (API)**
    * Set up Flask/FastAPI application [cite: 14, 44]
    * Create API endpoint for audio file upload [cite: 34]
    * Integrate audio processing (spectrogram generation) into API [cite: 35]
    * Load trained model in the backend
    * Create API endpoint for prediction (takes spectrogram/audio -> returns genre, confidence) [cite: 36]
    * Develop logic to serve audio file for playback [cite: 39]
* **EPIC: Frontend Development (UI)**
    * Set up basic React application [cite: 14, 44]
    * Create UI component for file upload
    * Create UI component to display results (genre, confidence, spectrogram image) [cite: 23, 36, 37]
    * Integrate API calls for upload and prediction
    * Create UI component for audio playback (using HTML5 audio or a library) [cite: 24]
    * Integrate API call to fetch audio for playback
* **EPIC: Playlist Generation Feature**
    * Design simple data structure to store classified songs and genres
    * Implement backend logic to group songs by predicted genre
    * Develop frontend UI to display genre-based playlists
* **EPIC: Documentation & Reporting**
    * Write final project report
    * Prepare project presentation/demo
    * Clean up code and add comments

## To Do

*(Move tasks from Backlog here when ready to start)*

* Develop script/notebook to load audio files
* Train initial model on spectrograms

## In Progress

*(Move tasks from To Do here when actively working on them)*

## Done

*(Move tasks from In Progress here upon completion)*

* **EPIC: Environment Setup**
    * Install necessary libraries (Python, TensorFlow, Keras, Librosa, Flask/FastAPI, Node.js, React)
    * Set up project structure (folders for backend, frontend, data, notebooks)
* **EPIC: Data Acquisition & Preprocessing**
    * Download/access GTZAN dataset [cite: 29, 30, 31, 32, 33]
    * Develop script/notebook to generate Mel spectrograms from audio [cite: 13, 35]
* **EPIC: Backend Development (API)**
    * Set up Flask/FastAPI application [cite: 14, 44]
    * Create API endpoint for audio file upload [cite: 34]
    * Integrate audio processing (spectrogram generation) into API [cite: 35]
    * Load trained model in the backend
    * Create API endpoint for prediction (takes spectrogram/audio -> returns genre, confidence) [cite: 36]
    * Develop logic to serve audio file for playback [cite: 39]
* **EPIC: Frontend Development (UI)**
    * Set up basic React application [cite: 14, 44]
    * Create UI component for file upload
    * Create UI component to display results (genre, confidence, spectrogram image) [cite: 23, 36, 37]
    * Integrate API calls for upload and prediction
    * Create UI component for audio playback (using HTML5 audio or a library) [cite: 24]
    * Integrate API call to fetch audio for playback
* **EPIC: Playlist Generation Feature**
    * Design simple data structure to store classified songs and genres
    * Implement backend logic to group songs by predicted genre
    * Develop frontend UI to display genre-based playlists
* **EPIC: Model Development & Training**
    * Design initial 2D CNN architecture [cite: 13]
    * Implement CNN model using Keras/TensorFlow [cite: 45]
    * Set up training pipeline (data loading, training loop, evaluation)