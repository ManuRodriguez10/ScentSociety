// src/Mens.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Mens.css";

export default function Mens() {
  const [colognes, setColognes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/accounts/menscolognes/")
      .then((res) => res.json())
      .then((data) => setColognes(data))
      .catch((err) => console.error("Failed to fetch colognes", err));
  }, []);

  return (
    <div className="mens-container">
      <h1 className="mens-title">Men's Colognes</h1>

      <div className="mens-grid">
        {colognes.map((cologne) => (
          <Link
            to={`/mens/${cologne.id}`}
            className="cologne-card"
            key={cologne.id}
          >
            {cologne.image && (
              <img
                src={cologne.image} // ✅ Already an absolute URL from backend
                alt={cologne.name}
                className="cologne-image"
              />
            )}
            <div className="cologne-info">
              <h3>{cologne.name}</h3>
              <p>${cologne.price}</p>
              <span className="cologne-tag">{cologne.scent_type}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Home Button */}
      <div className="home-button-wrapper">
        <Link to="/customer-home" className="home-button">
          🏠 Home
        </Link>
      </div>
    </div>
  );
}
