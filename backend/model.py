import librosa
import numpy as np

def predict_audio(audio_path):
    y, sr = librosa.load(audio_path, sr=None)

    duration = librosa.get_duration(y=y, sr=sr)

    prediction = "Real"
    confidence = 80

    if duration < 2:
        prediction = "Fake"
        confidence = 90

    return {
        "prediction": prediction,
        "confidence": confidence
    }