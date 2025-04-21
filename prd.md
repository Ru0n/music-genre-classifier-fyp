# Product Requirements Document: Interactive Music Genre Classifier

**Version:** 1.0
**Date:** 2025-04-21

## 1. Introduction

This document outlines the requirements for the "Interactive Music Genre Classifier" project. The primary goal is to develop a web application that accurately classifies the genre of user-uploaded audio snippets using a Convolutional Neural Network (CNN) trained on audio spectrograms[cite: 13]. Key priorities are achieving high classification accuracy and providing an intuitive, engaging user experience (UX)[cite: 10, 41, 57, 61]. A secondary goal is to explore automatic playlist generation based on classified genres. This project serves as a final year learning experience.

## 2. Goals

* Develop an accurate CNN model for music genre classification using spectrograms derived from the GTZAN dataset[cite: 13, 30, 31, 32, 33].
* Create a user-friendly web application for uploading audio, viewing classification results, and interacting with the audio data[cite: 10, 21, 22].
* Provide clear visualizations, including spectrograms and confidence scores, to enhance UX[cite: 23, 37, 43, 60].
* Implement a functional music player for uploaded audio[cite: 15, 24, 39, 42].
* Demonstrate a proof-of-concept for automatic playlist generation based on predicted genres.
* Prioritize learning ML/DL concepts, audio processing, and model deployment within a web framework.

## 3. User Profile

* **Primary Users**: Music enthusiasts, students, researchers interested in music information retrieval or machine learning applications[cite: 10, 21].
* **Assumed Knowledge**: Users may not have technical expertise in ML or audio processing[cite: 21, 22].

## 4. Functional Requirements

| ID  | Requirement                                                                 | Priority | Details                                                                                                    | Status    |
| :-- | :-------------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------- | :-------- |
| FR1 | **Audio Upload** [cite: 34]                                                   | Must-Have  | Users shall be able to upload audio files (supported formats: WAV, MP3).                                     | Not Started |
| FR2 | **Audio Processing & Spectrogram Generation** [cite: 13, 35]                   | Must-Have  | System shall preprocess uploaded audio (resample, segment if necessary) and generate Mel spectrograms. | Not Started |
| FR3 | **Genre Classification (CNN Model)** [cite: 13, 36]                           | Must-Have  | System shall use a trained 2D CNN model to classify the genre based on the generated spectrogram.       | Not Started |
| FR4 | **Display Results** [cite: 23, 36, 37]                                          | Must-Have  | Display predicted genre, confidence score/probabilities for top genres, and the generated spectrogram.       | Not Started |
| FR5 | **Integrated Music Player** [cite: 15, 24, 39]                                | Must-Have  | Allow users to play the originally uploaded audio file within the application interface.                   | Not Started |
| FR6 | **Automatic Playlist Generation (Proof-of-Concept)** | Should-Have| Group uploaded/classified songs based on their predicted genre into simple playlists.                     | Not Started |
| FR7 | **Backend API** | Must-Have  | Develop a backend (Flask/FastAPI) to handle uploads, processing, prediction, and serving results.        | Not Started |
| FR8 | **Frontend Interface** [cite: 14]                                           | Must-Have  | Develop a frontend (React) to provide the user interface for interaction (upload, playback, viewing).    | Not Started |

## 5. Non-Functional Requirements

| ID   | Requirement        | Priority | Details                                                                                         |
| :--- | :----------------- | :------- | :---------------------------------------------------------------------------------------------- |
| NFR1 | **Accuracy** [cite: 57]      | High     | The classification model should strive for high accuracy on the GTZAN dataset test set.         |
| NFR2 | **Usability / UX** [cite: 41, 61] | High     | The interface must be intuitive, visually appealing, and easy to use for non-technical users. |
| NFR3 | **Performance** [cite: 40, 61]   | Medium   | Classification response time should be reasonably fast for a good user experience.          |
| NFR4 | **Compatibility** [cite: 42] | Medium   | Support common audio formats (WAV, MP3).                                                    |

## 6. Technical Stack

* **Backend**: Python, Flask / FastAPI [cite: 14, 44]
* **Frontend**: React.js [cite: 14, 44]
* **ML/DL**: TensorFlow / Keras [cite: 45]
* **Audio Processing**: Librosa [cite: 45]
* **Dataset**: GTZAN [cite: 29, 30, 31, 32, 33]

## 7. Out of Scope

* Production-level deployment and scaling.
* Real-time model retraining based on user feedback[cite: 25, 38].
* Support for a wide array of obscure audio formats.
* Advanced user account management or persistent storage beyond basic playlist grouping.

## 8. Open Questions

* Specific CNN architecture to start with? (Suggest starting simple: 2-3 Conv layers).
* Exact format for storing/displaying confidence scores?
* Detailed UI flow for playlist generation?