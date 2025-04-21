#!/bin/bash

# Setup script for Interactive Music Genre Classifier

# Create virtual environment
echo "Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p backend/uploads/spectrograms
mkdir -p data/raw data/processed model

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Setup complete!"
echo ""
echo "To start the backend server:"
echo "  source venv/bin/activate  # If not already activated"
echo "  cd backend"
echo "  python app.py"
echo ""
echo "To start the frontend development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "To download the GTZAN dataset:"
echo "  source venv/bin/activate  # If not already activated"
echo "  python scripts/download_gtzan.py"
