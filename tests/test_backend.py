#!/usr/bin/env python3
"""
Test script for the backend API endpoints.
This script tests the playlists endpoint of the music genre classifier backend.
"""
import requests
import sys

def test_playlists():
    """
    Test the playlists endpoint.
    Sends a GET request to the /api/playlists endpoint and prints the response.
    """
    try:
        response = requests.get('http://localhost:5001/api/playlists')
        print(f"Status code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == '__main__':
    success = test_playlists()
    if not success:
        print("Test failed")
        sys.exit(1)
    print("Test passed")
