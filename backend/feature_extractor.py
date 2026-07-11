import librosa
import numpy as np

def extract_features(audio_path):

    audio, sample_rate = librosa.load(audio_path, sr=None)

    mfccs = librosa.feature.mfcc(
        y=audio,
        sr=sample_rate,
        n_mfcc=40
    )

    mfccs_mean = np.mean(mfccs.T, axis=0)

    return mfccs_mean