import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import backgroundImage from "./about_section.jpg";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup]       = useState("");
  const [activationLink, setActivationLink] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/accounts/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setPopup(data.message);
        setActivationLink(data.activation_link);
      } else {
        setPopup(data.error || JSON.stringify(data));
      }
    } catch {
      setPopup("Server error");
    }
    setTimeout(() => setPopup(""), 8000);
  };

  return (
    <div
      className="signup-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {popup && <div className="popup-message">{popup}</div>}

        {activationLink && (
          <div className="popup-message" style={{ marginTop: "1rem" }}>
            <a href={activationLink} target="_blank" rel="noreferrer">
              Click here to verify your email
            </a>
          </div>
        )}

        <p>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
        <Link to="/" className="home-button">
          🏠 Home
        </Link>
      </div>
    </div>
  );
}
