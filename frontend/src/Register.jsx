import { useState } from "react";

function Register({ onRegister }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async () => {

    if (
      username.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {

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

      if (data.success) {

        setUsername("");
        setPassword("");
        setConfirmPassword("");

        onRegister();

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

          Create Account

        </h2>

        <input
          className="form-control mb-3"
          type="text"
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

        <input
          className="form-control mb-3"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <button
          className="btn btn-success w-100"
          onClick={register}
        >

          Register

        </button>
        
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?
        <button
            onClick={onRegister}
            style={{ border: "none",
              background: "none",
              color: "black",
              cursor: "pointer",
              marginLeft: "5px"
            }}
            >
              Login
            </button>
        </p>
      </div>

    </div>

  );

}

export default Register;