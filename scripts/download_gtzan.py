#!/usr/bin/env python3
"""
Script to download and extract the GTZAN dataset using Kaggle API
"""

import os
import sys
import subprocess
import zipfile
import tarfile
import shutil
from tqdm import tqdm

# Output directory
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "raw")
GTZAN_DIR = os.path.join(DATA_DIR, "gtzan")

def download_from_kaggle(dataset_name, output_dir):
    """
    Download a dataset from Kaggle

    Args:
        dataset_name (str): Name of the Kaggle dataset (format: username/dataset-name)
        output_dir (str): Directory to save the dataset

    Returns:
        bool: True if download was successful, False otherwise
    """
    try:
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)

        # Check if kaggle command is available
        try:
            subprocess.run(["kaggle", "--version"], check=True, capture_output=True)
        except (subprocess.SubprocessError, FileNotFoundError):
            print("Kaggle CLI not found. Installing...")
            subprocess.run([sys.executable, "-m", "pip", "install", "kaggle"], check=True)

        # Download dataset
        print(f"Downloading {dataset_name} from Kaggle...")
        subprocess.run(
            ["kaggle", "datasets", "download", dataset_name, "--path", output_dir, "--unzip"],
            check=True
        )

        return True
    except Exception as e:
        print(f"Error downloading from Kaggle: {e}")
        return False

def extract_tar(tar_path, output_dir):
    """
    Extract a tar.gz file

    Args:
        tar_path (str): Path to the tar.gz file
        output_dir (str): Directory to extract to
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)

    # Extract tar.gz file
    with tarfile.open(tar_path, 'r:gz') as tar:
        members = tar.getmembers()
        with tqdm(total=len(members), desc="Extracting") as pbar:
            for member in members:
                tar.extract(member, path=output_dir)
                pbar.update(1)

def setup_kaggle_credentials():
    """
    Set up Kaggle API credentials

    Returns:
        bool: True if credentials are set up, False otherwise
    """
    # Check if credentials already exist
    kaggle_dir = os.path.expanduser("~/.kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")

    if os.path.exists(kaggle_json):
        print("Kaggle credentials found.")
        return True

    # Prompt user for Kaggle credentials
    print("\nKaggle API credentials not found. You need to set them up:")
    print("1. Go to https://www.kaggle.com/account")
    print("2. Scroll down to the 'API' section and click 'Create New API Token'")
    print("3. This will download a kaggle.json file")
    print("4. Create a .kaggle directory in your home folder:")
    print(f"   mkdir -p {kaggle_dir}")
    print("5. Move the downloaded kaggle.json file to this directory:")
    print(f"   mv ~/Downloads/kaggle.json {kaggle_json}")
    print("6. Set the correct permissions:")
    print(f"   chmod 600 {kaggle_json}")
    print("\nAfter completing these steps, run this script again.")

    return False

def organize_gtzan_files(download_dir, target_dir):
    """
    Organize the downloaded GTZAN files into the expected structure

    Args:
        download_dir (str): Directory where files were downloaded
        target_dir (str): Directory to organize files into
    """
    # Create target directory if it doesn't exist
    os.makedirs(target_dir, exist_ok=True)

    # Check for the zip file
    zip_file = os.path.join(download_dir, "gtzan-dataset-music-genre-classification.zip")
    if os.path.exists(zip_file):
        print(f"Found downloaded zip file: {zip_file}")
        print("Extracting zip file...")
        extract_dir = os.path.join(download_dir, "extracted")
        os.makedirs(extract_dir, exist_ok=True)

        # Extract the zip file
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall(extract_dir)

        # Look for genres directory in various possible locations
        possible_paths = [
            os.path.join(extract_dir, "Data", "genres"),
            os.path.join(extract_dir, "genres"),
            os.path.join(extract_dir, "Data", "genres_original"),
            os.path.join(extract_dir, "genres_original")
        ]

        genres_dir = None
        for path in possible_paths:
            if os.path.exists(path):
                genres_dir = path
                break

        if genres_dir:
            print(f"Found genres directory at {genres_dir}")
            # Copy all genre folders to the target directory
            for genre in os.listdir(genres_dir):
                genre_path = os.path.join(genres_dir, genre)
                if os.path.isdir(genre_path):
                    target_genre_path = os.path.join(target_dir, genre)
                    if not os.path.exists(target_genre_path):
                        print(f"Copying {genre} files...")
                        shutil.copytree(genre_path, target_genre_path)
            return True
        else:
            print(f"Warning: Could not find genres directory in extracted files")

    # Check if the Data/genres directory exists (from Kaggle dataset)
    genres_dir = os.path.join(download_dir, "Data", "genres")
    if os.path.exists(genres_dir):
        # Copy all genre folders to the target directory
        for genre in os.listdir(genres_dir):
            genre_path = os.path.join(genres_dir, genre)
            if os.path.isdir(genre_path):
                target_genre_path = os.path.join(target_dir, genre)
                if not os.path.exists(target_genre_path):
                    print(f"Copying {genre} files...")
                    shutil.copytree(genre_path, target_genre_path)
        return True

    print(f"Warning: Expected directory structure not found in {download_dir}")
    print("Please organize the files manually.")
    return False

def main():
    """
    Main function
    """
    # Set up Kaggle credentials
    if not setup_kaggle_credentials():
        return

    print("Downloading GTZAN dataset from Kaggle...")

    # Download dataset from Kaggle
    kaggle_dataset = "andradaolteanu/gtzan-dataset-music-genre-classification"
    success = download_from_kaggle(kaggle_dataset, DATA_DIR)

    if not success:
        print("\nFailed to download the GTZAN dataset from Kaggle.")
        print("\nPlease download it manually:")
        print("1. Go to https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification")
        print("2. Click the 'Download' button")
        print("3. Extract the downloaded zip file")
        print("4. Copy the 'genres' folder to:")
        print(f"   {GTZAN_DIR}")
        return

    # Organize files into the expected structure
    print("Organizing files...")
    success = organize_gtzan_files(DATA_DIR, GTZAN_DIR)

    if success:
        print(f"\nGTZAN dataset downloaded and organized in {GTZAN_DIR}")
    else:
        print("\nManual steps to organize the dataset:")
        print("1. Navigate to the data/raw directory")
        print("2. Extract the gtzan-dataset-music-genre-classification.zip file")
        print("3. Look for a 'genres' or 'genres_original' folder in the extracted files")
        print("4. Copy that folder to data/raw/gtzan")
        print("\nAlternatively, you can download the dataset directly from:")
        print("https://www.kaggle.com/datasets/andradaolteanu/gtzan-dataset-music-genre-classification")

if __name__ == "__main__":
    main()
