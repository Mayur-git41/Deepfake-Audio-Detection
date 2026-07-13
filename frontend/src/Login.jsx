import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await response.json();

    if (data.success) {
      onLogin();
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5">

      <div className="card p-4">

        <h2>Login</h2>

        <input
          className="form-control mt-3"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="form-control mt-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="btn btn-primary mt-3"
          onClick={login}
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;