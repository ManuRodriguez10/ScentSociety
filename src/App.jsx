// src/App.jsx
import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import About from "./about";
import LoginSignup from "./login";
import Signup from "./signup";
import CustomerHome from "./customer_home";
import PrivateRoute from "./PrivateRoute";
import Mens from "./Mens";
import CologneDetail from "./CologneDetail";
import Womens from "./Womens";
import WomenDetail from "./WomenDetail";
import CartPage from "./Cart";
import Checkout from "./Checkout"; // ✅ correct
import LandingBackground from "./Landing_page.png";

function Home() {
  return (
    <>
      <header className="navbar">
        <div className="navbar-container center">
          <div className="navbar-logo">Scent Society</div>
        </div>
      </header>

      <section className="hero-section">
        <img src={LandingBackground} alt="Hero" className="hero-image" />
        <div className="hero-overlay left">
          <h1>Where Every Scent Tells a Story</h1>
          <p>
            Discover a curated collection of premium colognes designed to
            elevate your presence. Whether you're chasing bold intensity,
            subtle elegance, or something uniquely you — your signature
            scent starts here.
          </p>
          <div className="cta-buttons">
            <a href="/login" className="cta-button">👜 Shop Now</a>
            <a href="/about" className="cta-button">📖 About Us</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          path="/customer-home"
          element={
            <PrivateRoute>
              <CustomerHome />
            </PrivateRoute>
          }
        />
        <Route path="/mens" element={<Mens />} />
        <Route path="/mens/:id" element={<CologneDetail />} />
        <Route path="/womens" element={<Womens />} />
        <Route path="/womens/:id" element={<WomenDetail />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        {/* ✅ Checkout Route */}
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
