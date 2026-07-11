import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

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

      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h1 className="text-center">
          Deepfake Audio Detection
        </h1>

        <input
          className="form-control mt-3"
          type="file"
          accept=".wav,.mp3"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={uploadFile}
        >
          Analyze Audio
        </button>

        {result && (

          <div className="card mt-4 p-3">

            <h3>Prediction Result</h3>

            <p>
              <strong>File:</strong>
              {" "}
              {result.filename}
            </p>

            <p>
              <strong>Prediction:</strong>

              <span
                style={{
                  color:
                    result.prediction === "DEEPFAKE"
                      ? "red"
                      : "green",
                  fontWeight: "bold",
                  fontSize: "24px",
                  marginLeft: "10px"
                }}
              >
                {result.prediction}
              </span>

            </p>

            <p>
              <strong>Confidence:</strong>
              {" "}
              {result.confidence}%
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;