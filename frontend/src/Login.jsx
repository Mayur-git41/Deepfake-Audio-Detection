import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    if (username.trim() === "" || password.trim() === "") {
      alert("Please enter username and password.");
      return;
    }

    try {

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

        localStorage.setItem(
          "username",
          username
        );

        localStorage.setItem(
          "login",
          "true"
        );

        onLogin(username);

      } else {

        alert("Invalid username or password");

      }

    } catch (error) {

      console.error(error);

      alert("Unable to connect to the backend.");

    }

  };

  return (

    <div className="container mt-5">

      <div
        className="card shadow-lg p-4 mx-auto"
        style={{ maxWidth: "500px" }}
      >

        <h2 className="text-center mb-4">

          Login

        </h2>

        <input
          className="form-control mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="btn btn-primary w-100"
          onClick={login}
        >

          Login

        </button>

      </div>

    </div>

  );

}

export default Login;