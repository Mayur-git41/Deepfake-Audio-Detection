import { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(
        `Prediction: ${data.prediction} | Confidence: ${data.confidence}%`
      );
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadFile}>Upload</button>
      {result && <p>{result}</p>}
    </div>
  );
}