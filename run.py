#!/usr/bin/env python3
"""
Consolidated run script for the music genre classifier backend.
This script replaces run.py, run_server.py, and backend/run_backend.py.

Make sure to activate the virtual environment before running:
    source venv/bin/activate  # On Windows: venv\Scripts\activate

Then run from the project root directory with optional arguments:
    python run.py --host 0.0.0.0 --port 5001 --debug
"""
import os
import sys
import argparse

# Set up argument parsing
parser = argparse.ArgumentParser(description='Run the music genre classifier backend server')
parser.add_argument('--host', default='127.0.0.1', 
                    help='Host to run the server on (default: 127.0.0.1, use 0.0.0.0 for network access)')
parser.add_argument('--port', type=int, default=5001, 
                    help='Port to run the server on (default: 5001)')
parser.add_argument('--debug', action='store_true', default=True,
                    help='Run in debug mode (default: True)')
args = parser.parse_args()

# Add the project root directory to the Python path
# This ensures imports work correctly regardless of where the script is run from
project_root = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, project_root)

# Now we can import from the backend package
from backend.app import app

if __name__ == '__main__':
    print(f"Starting server on {args.host}:{args.port} (debug: {args.debug})")
    app.run(debug=args.debug, host=args.host, port=args.port)