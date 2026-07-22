import { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import Analytics from "./Analytics";
import Profile from "./Profile";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(true);

  const [username, setUsername] = useState("");
  
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const login = localStorage.getItem("login");
    const user = localStorage.getItem("username");

    if (login === "true" && user) {
      setTimeout(() => {
        setLoggedIn(true);
        setUsername(user);
      }, 0);
  }
  }, []);

  const logout = () => {

    if (window.confirm("Are you sure you want to logout?")) {

      localStorage.clear();

      setLoggedIn(false);

      setUsername("");

      setResult(null);

      setHistory([]);

    }

  };

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

      loadHistory();

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

  const totalScans = history.length;

  const realCount = history.filter(
    item => item.prediction === "REAL"
  ).length;

  const fakeCount = history.filter(
    item => item.prediction === "DEEPFAKE"
  ).length;

  const filteredHistory = history.filter(item =>
    item.filename
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  if (!loggedIn) {
  return showRegister ? (
    <Register
      onRegister={() => setShowRegister(false)}
    />
  ) : (
    <Login
      onLogin={(user) => {
        setUsername(user);
        setLoggedIn(true);

        localStorage.setItem("username", user);
        localStorage.setItem("login", "true");
      }}
    />
  );
}

  return (

    <div className="container mt-5">

      <div className="card shadow-lg p-4">

        {/* Navbar */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2>
            Deepfake Audio Detection
          </h2>

          <div>

            <span className="me-3">

              Welcome,

              <strong> {username}</strong>

            </span>

            <button
              className="btn btn-danger"
              onClick={logout}
            >

              Logout

            </button>

          </div>

        </div>

        {/* Upload */}

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

        {/* Statistics */}

        <div className="row mt-4">

          <div className="col-md-4">

            <div className="card shadow border-primary text-center p-3">

              <h5>Total Scans</h5>

              <h2>{totalScans}</h2>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-success text-center p-3">

              <h5>REAL</h5>

              <h2 className="text-success">

                {realCount}

              </h2>

            </div>

          </div>

          <div className="col-md-4">

            <div className="card shadow border-danger text-center p-3">

              <h5>DEEPFAKE</h5>

              <h2 className="text-danger">

                {fakeCount}

              </h2>

            </div>

          </div>

        </div>

        {/* Prediction */}

        {result && (

          <div className="card mt-4 p-3">

            <h3>

              Prediction Result

            </h3>

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

            <a
              className="btn btn-success"
              href={`http://127.0.0.1:8000/report/${result.filename}`}
              target="_blank"
              rel="noreferrer"
            >

              Download PDF Report

            </a>

          </div>

        )}

        {/* History */}

        {history.length > 0 && (

          <div className="card mt-4 p-3">

            <h3>

              Prediction History

            </h3>

            <input

              className="form-control mb-3"

              placeholder="Search filename..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

            />

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

                {filteredHistory.map((item) => (

                <tr key={item.id}>

                <td>{item.id}</td>

                <td>{item.filename}</td>

                <td>{item.prediction}</td>

                <td>{item.confidence}%</td>

              </tr>

                ))}

            </tbody>

            </table>

          </div>

        )}

        {history.length > 0 && (

          <Analytics history={history} />

        )}

        <Profile username={username} />

      </div>

    </div>

  );

}

export default App;