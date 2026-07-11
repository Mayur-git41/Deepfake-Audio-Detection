from feature_extractor import extract_features

def predict_audio(audio_path):

    features = extract_features(audio_path)

    score = sum(features[:5])

    prediction = "REAL"
    confidence = 85

    if score < 0:
        prediction = "DEEPFAKE"
        confidence = 90

    return {
        "prediction": prediction,
        "confidence": confidence
    }