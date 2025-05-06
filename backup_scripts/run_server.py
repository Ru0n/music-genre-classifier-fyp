#!/usr/bin/env python3
"""
Run script for the music genre classifier backend on port 5001
"""
import os
import sys

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Now we can import from the backend package
from backend.app import app

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
