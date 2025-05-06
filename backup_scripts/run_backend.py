#!/usr/bin/env python3
"""
Run script for the music genre classifier backend (run from backend directory)
"""
import os
import sys

# Add the parent directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(os.path.dirname(__file__))))

# Import the app
from backend.app import app

if __name__ == '__main__':
    app.run(debug=True)
