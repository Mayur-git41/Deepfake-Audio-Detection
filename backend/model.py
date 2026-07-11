import joblib
from feature_extractor import extract_features

model = joblib.load("deepfake_model.pkl")

def predict_audio(audio_path):

    features = extract_features(audio_path)

    prediction = model.predict([features])[0]

    if prediction == 0:
        return {
            "prediction": "REAL",
            "confidence": 92
        }

    return {
        "prediction": "DEEPFAKE",
        "confidence": 95
    }