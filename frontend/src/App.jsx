/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const loadHistory = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  // 2. Load history automatically on mount if logged in
  useEffect(() => {
    const login = localStorage.getItem("login");
    const user = localStorage.getItem("username");

    if (login === "true" && user) {
      setLoggedIn(true);
      setUsername(user);
      loadHistory();
    }
  }, []);

  // 1. Updated uploadFile with response validation & logging
  const uploadFile = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("Prediction Response:", data);

      if (!response.ok || data.success === false) {
        alert(data.message || "Prediction failed");
        return;
      }

      setResult(data);
      await loadHistory();
    } catch (error) {
      console.error(error);
      alert("Backend connection failed");
    }
  };

  // 3. Improved history filtering with fallback for null filenames
  const filteredHistory = history.filter((item) =>
    (item.filename || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container my-4">
      {/* Header bar showing logged-in user state */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Audio Classification Dashboard</h2>
        {loggedIn && (
          <span className="badge bg-secondary p-2">
            Logged in as: <strong>{username}</strong>
          </span>
        )}
      </div>

      {/* Upload Section */}
      <div className="card p-3 my-3">
        <h4>Upload Audio File</h4>
        <input
          type="file"
          accept="audio/*"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn btn-primary" onClick={uploadFile}>
          Predict
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="card p-3 my-3">
          <h4>Latest Prediction</h4>
          <p>
            <strong>Filename:</strong> {result.filename}
          </p>
          <p>
            <strong>Prediction:</strong>{" "}
            <span
              className={
                result.prediction === "REAL"
                  ? "text-success fw-bold"
                  : "text-danger fw-bold"
              }
            >
              {result.prediction}
            </span>
          </p>
          <p>
            {/* 5. Show confidence with two decimal places */}
            <strong>Confidence:</strong>{" "}
            {Number(result.confidence).toFixed(2)}%
          </p>
        </div>
      )}

      {/* History Table */}
      <div className="card p-3 my-3">
        <h4>History</h4>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Prediction</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.filename}</td>
                {/* 4. Color the prediction in History table */}
                <td>
                  <span
                    className={
                      item.prediction === "REAL"
                        ? "text-success fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {item.prediction}
                  </span>
                </td>
                {/* 5. Show confidence with two decimal places */}
                <td>{Number(item.confidence).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}