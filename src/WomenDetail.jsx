// src/WomenDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CologneDetail.css";

export default function WomenDetail() {
  const { id } = useParams();
  const [cologne, setCologne] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/accounts/womenscolognes/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setCologne(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!cologne) {
    return <div className="loading">Loading…</div>;
  }

  const allImages = [cologne.image, ...(cologne.additional_images || [])];

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + allImages.length) % allImages.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % allImages.length
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/accounts/women-cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cologne_id: cologne.id, quantity: 1 }),
      });

      if (response.ok) {
        setPopupMessage("✅ Added to cart!");
        setTimeout(() => setPopupMessage(""), 2000);
      } else {
        const errData = await response.json();
        console.error("Add to cart failed:", errData);
        setPopupMessage("❌ Failed to add to cart.");
        setTimeout(() => setPopupMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setPopupMessage("❌ Error occurred.");
      setTimeout(() => setPopupMessage(""), 2000);
    }
  };

  return (
    <div className="detail-container">
      <Link to="/womens" className="back-link">← Back to Women’s</Link>

      <div className="detail-grid">
        <div className="image-wrapper">
          <img
            src={allImages[currentImageIndex]}
            alt={cologne.name}
            className="detail-image"
          />
          {allImages.length > 1 && (
            <>
              <button onClick={handlePrev} className="carousel-button left">←</button>
              <button onClick={handleNext} className="carousel-button right">→</button>
            </>
          )}
          <div className="thumbnail-row">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`thumbnail-image ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(idx)}
              />
            ))}
          </div>
        </div>

        <div className="info-wrapper">
          <h1 className="detail-title">{cologne.name}</h1>
          <p className="detail-price">${cologne.price}</p>

          {cologne.top_notes && cologne.top_notes.length > 0 && (
            <div className="detail-notes">
              {cologne.top_notes.map((note, index) => (
                <span key={index} className="note-tag">
                  {note}
                </span>
              ))}
            </div>
          )}

          {cologne.description && (
            <p className="detail-description">{cologne.description}</p>
          )}

          <button className="add-button" onClick={handleAddToCart}>Add to Cart</button>
          {popupMessage && <div className="popup-message">{popupMessage}</div>}
        </div>
      </div>
    </div>
  );
}
