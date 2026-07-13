import { useState } from "react";

function Register({ onRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {

    const response = await fetch(
      "http://127.0.0.1:8000/register",
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

    alert(data.message);

    if (
      data.message ===
      "Registration successful"
    ) {
      onRegister();
    }
  };

  return (
    <div className="container mt-5">

      <div className="card p-4">

        <h2>Register</h2>

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
          className="btn btn-success mt-3"
          onClick={register}
        >
          Register
        </button>

      </div>

    </div>
  );
}

export default Register;