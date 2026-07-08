import random

def predict_audio():
    result = random.choice(["REAL", "DEEPFAKE"])
    confidence = round(random.uniform(80, 99), 2)

    return {
        "prediction": result,
        "confidence": confidence
    }