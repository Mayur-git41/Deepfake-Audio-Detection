import librosa
import numpy as np
import joblib

model = joblib.load("deepfake_model.pkl")


def extract_features(audio_path):

    audio, sr = librosa.load(audio_path, sr=None)

    mfccs = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=40
    )

    return np.mean(mfccs.T, axis=0)


def predict_audio(audio_path):

    features = extract_features(audio_path)

    prediction = model.predict([features])[0]

    if prediction == 0:
        label = "REAL"
    else:
        label = "DEEPFAKE"

    return {
        "prediction": label,
        "confidence": 95
    }