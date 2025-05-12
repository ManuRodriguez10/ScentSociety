// src/customer_home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./customer_home.css";
import menImage from "./mens_section.png";
import womenImage from "./womens_section.png";

export default function CustomerHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="customer-home-container">
      <nav className="customer-home-navbar">
        <div className="navbar-title">Scent Society</div>
        <div className="navbar-links">
          <button
            className="nav-button"
            onClick={() => navigate("/cart")}
          >
            My Cart
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </nav>

      <div className="grids-wrapper">
        <div className="gender-grid">
          <h2>Men</h2>
          <img
            src={menImage}
            alt="Men Fragrances"
            className="section-image"
          />
          <button className="shop-button" onClick={() => navigate("/mens")}>👜 Shop Now</button>
        </div>

        <div className="gender-grid">
          <h2>Women</h2>
          <img
            src={womenImage}
            alt="Women Fragrances"
            className="section-image"
          />
          <button className="shop-button" onClick={() => navigate("/womens")}>👜 Shop Now</button>
        </div>
      </div>
    </div>
  );
}
