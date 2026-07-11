import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

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

  const loadHistory = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/history"
      );

      const data = await response.json();
      setHistory(data);

    } catch (error) {
      console.error(error);
      alert("Failed to load history");
    }
  };

  return (
    <div className="container mt-5">

      <div className="card shadow p-4">

        <h1 className="text-center mb-4">
          Deepfake Audio Detection
        </h1>

        <input
          className="form-control"
          type="file"
          accept=".wav,.mp3"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <div className="mt-3">
          <button
            className="btn btn-primary"
            onClick={uploadFile}
          >
            Analyze Audio
          </button>

          <button
            className="btn btn-secondary ms-2"
            onClick={loadHistory}
          >
            View History
          </button>
        </div>

        {result && (

          <div className="card mt-4 p-3">

            <h3>Prediction Result</h3>

            <p>
              <strong>File:</strong> {result.filename}
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

            <a
              className="btn btn-success mt-2"
              href={`http://127.0.0.1:8000/report/${result.filename}`}
              target="_blank"
              rel="noreferrer"
            >
              Download PDF Report
            </a>

          </div>

        )}

        {history.length > 0 && (

          <div className="card mt-4 p-3">

            <h3>Prediction History</h3>

            <table className="table table-bordered">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>File</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>

              <tbody>

                {history.map((item) => (

                  <tr key={item[0]}>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                    <td>{item[2]}</td>
                    <td>{item[3]}%</td>
                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;