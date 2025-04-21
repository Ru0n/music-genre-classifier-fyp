import librosa
import librosa.display
import numpy as np
import matplotlib.pyplot as plt
import os
from pathlib import Path
import tqdm  # For progress bar
import argparse

# --- Configuration Defaults ---
# These can be overridden by command-line arguments
DEFAULT_DATASET_PATH = Path("../data/raw/GTZAN/genres_original")
DEFAULT_OUTPUT_PATH_NPY = Path("../data/processed/spectrograms_npy")
# DEFAULT_OUTPUT_PATH_IMG = Path("../data/processed/spectrograms_img") # Uncomment if saving images

# Spectrogram parameters
DEFAULT_SAMPLE_RATE = 22050
DEFAULT_N_FFT = 2048
DEFAULT_HOP_LENGTH = 512
DEFAULT_N_MELS = 128
DEFAULT_FMIN = 0
DEFAULT_FMAX = None # Use Nyquist frequency

def compute_and_save_spectrogram(audio_path, output_path_npy, sample_rate, n_fft, hop_length, n_mels, fmin, fmax):
    """Computes and saves the Mel spectrogram for a single audio file."""
    try:
        # Load audio file - Convert Path to string for wider compatibility
        y, sr = librosa.load(str(audio_path), sr=sample_rate)

        # Compute Mel spectrogram
        mel_spec = librosa.feature.melspectrogram(
            y=y,
            sr=sr,
            n_fft=n_fft,
            hop_length=hop_length,
            n_mels=n_mels,
            fmin=fmin,
            fmax=fmax
        )

        # Convert to decibels (log scale)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)

        # Save as NumPy array
        np.save(output_path_npy, mel_spec_db)

        # --- Optional: Save as Image ---
        # output_path_img = Path(str(output_path_npy).replace("spectrograms_npy", "spectrograms_img").replace(".npy", ".png"))
        # output_path_img.parent.mkdir(parents=True, exist_ok=True)
        # plt.figure(figsize=(10, 4))
        # librosa.display.specshow(mel_spec_db, sr=sr, hop_length=hop_length, x_axis='time', y_axis='mel')
        # plt.colorbar(format='%+2.0f dB')
        # plt.title(f'Mel spectrogram ({audio_path.stem})')
        # plt.tight_layout()
        # plt.savefig(output_path_img, bbox_inches='tight', pad_inches=0)
        # plt.close() # Close the figure to free memory
        # --------------------------------

        return True

    except Exception as e:
        print(f"Error processing {audio_path}: {e}")
        return False

def main(args):
    """Main function to process all audio files."""
    dataset_path = args.dataset_dir
    output_path_npy_base = args.output_dir_npy

    # Ensure output directory exists
    output_path_npy_base.mkdir(parents=True, exist_ok=True)

    # Iterate through genres and audio files
    print(f"Starting spectrogram generation from: {dataset_path}")
    print(f"Saving NumPy arrays to: {output_path_npy_base}")

    if not dataset_path.exists():
        print(f"ERROR: Dataset path does not exist: {dataset_path}")
        return

    genres = [d for d in dataset_path.iterdir() if d.is_dir()]
    if not genres:
        print(f"ERROR: No genre subdirectories found in {dataset_path}")
        return
    print(f"Found genres: {[g.name for g in genres]}")

    total_files = sum(len(list(g.glob('*.wav'))) for g in genres)
    if total_files == 0:
        print("ERROR: No .wav files found in the genre subdirectories.")
        return

    processed_count = 0
    error_count = 0

    with tqdm.tqdm(total=total_files, desc="Processing files", unit="file") as pbar:
        for genre_path in genres:
            genre_name = genre_path.name
            output_genre_path_npy = output_path_npy_base / genre_name
            output_genre_path_npy.mkdir(parents=True, exist_ok=True)

            for audio_file in genre_path.glob('*.wav'):
                output_filename_npy = output_genre_path_npy / f"{audio_file.stem}.npy"

                if compute_and_save_spectrogram(
                    audio_file,
                    output_filename_npy,
                    args.sample_rate,
                    args.n_fft,
                    args.hop_length,
                    args.n_mels,
                    args.fmin,
                    args.fmax):
                    processed_count += 1
                else:
                    error_count += 1
                pbar.update(1)

    print(f"\nFinished processing.")
    print(f"Successfully processed: {processed_count} files.")
    print(f"Errors encountered: {error_count} files.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Mel spectrograms from audio files.")
    parser.add_argument("--dataset-dir", type=Path, default=DEFAULT_DATASET_PATH,
                        help=f"Path to the root GTZAN directory (containing genre subfolders). Default: {DEFAULT_DATASET_PATH}")
    parser.add_argument("--output-dir-npy", type=Path, default=DEFAULT_OUTPUT_PATH_NPY,
                        help=f"Path to save the output NumPy arrays. Default: {DEFAULT_OUTPUT_PATH_NPY}")
    parser.add_argument("--sample-rate", type=int, default=DEFAULT_SAMPLE_RATE, help=f"Target sample rate. Default: {DEFAULT_SAMPLE_RATE}")
    parser.add_argument("--n-fft", type=int, default=DEFAULT_N_FFT, help=f"FFT window size. Default: {DEFAULT_N_FFT}")
    parser.add_argument("--hop-length", type=int, default=DEFAULT_HOP_LENGTH, help=f"Hop length for STFT. Default: {DEFAULT_HOP_LENGTH}")
    parser.add_argument("--n-mels", type=int, default=DEFAULT_N_MELS, help=f"Number of Mel bands. Default: {DEFAULT_N_MELS}")
    parser.add_argument("--fmin", type=int, default=DEFAULT_FMIN, help=f"Minimum frequency for Mel bands. Default: {DEFAULT_FMIN}")
    parser.add_argument("--fmax", type=int, default=DEFAULT_FMAX, help="Maximum frequency for Mel bands. Default: Nyquist")

    args = parser.parse_args()
    main(args)