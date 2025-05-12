import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import background from "./about_section.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/accounts/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        navigate("/customer-home");
      } else {
        setPopup(data.error || "Login failed");
        setTimeout(() => setPopup(""), 3500);
      }
    } catch (err) {
      setPopup("Server error");
      setTimeout(() => setPopup(""), 3500);
    }
  };

  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-container">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Log In
        </button>
        {popup && <div className="popup-message">{popup}</div>}
        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
        <Link to="/" className="home-button">
          🏠 Home
        </Link>
      </div>
    </div>
  );
}
