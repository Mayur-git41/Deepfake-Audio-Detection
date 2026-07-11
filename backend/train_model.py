import os
import numpy as np
import librosa
import joblib

from sklearn.ensemble import RandomForestClassifier

X = []
y = []

def extract_features(audio_path):
    audio, sr = librosa.load(audio_path, sr=None)

    mfccs = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=40
    )

    return np.mean(mfccs.T, axis=0)

for folder, label in [
    ("dataset/real", 0),
    ("dataset/fake", 1)
]:
    for file in os.listdir(folder):
        if file.endswith(".mp3") or file.endswith(".wav"):
            path = os.path.join(folder, file)

            features = extract_features(path)

            X.append(features)
            y.append(label)

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "deepfake_model.pkl")

print("Model Saved")