import joblib
from feature_extractor import extract_features

# Load trained model
model = joblib.load("deepfake_model.pkl")


def predict_audio(audio_path):

    features = extract_features(audio_path)

    prediction = model.predict([features])[0]

    probabilities = model.predict_proba([features])[0]

    confidence = round(max(probabilities) * 100, 2)

    if prediction == 0:
        label = "REAL"
    else:
        label = "DEEPFAKE"

    return {
        "prediction": label,
        "confidence": confidence
    }