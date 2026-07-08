import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setResult(
      `Prediction: ${data.prediction} | Confidence: ${data.confidence}%`
    );
  };

  return (
    <div>
      <h1>Deepfake Audio Detection</h1>

      <input
        type="file"
        accept=".wav,.mp3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={uploadFile}>
        Upload Audio
      </button>

      <h2>{result}</h2>
    </div>
  );
}

export default App;