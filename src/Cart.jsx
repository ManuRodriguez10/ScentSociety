// src/Cart.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";
import backgroundImage from "./skybg.png";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch("http://localhost:8000/api/accounts/cart/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRemove = async (itemId, isWomenItem = false) => {
    const token = localStorage.getItem("token");
    const url = isWomenItem
      ? `http://localhost:8000/api/accounts/women-cart/remove/${itemId}/`
      : `http://localhost:8000/api/accounts/cart/remove/${itemId}/`;

    try {
      await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <div className="loading">Loading cart...</div>;

  const menItems = cart.items || [];
  const womenItems = cart.women_items || [];

  const total = [...menItems, ...womenItems].reduce((sum, item) => {
    return sum + item.cologne.price * item.quantity;
  }, 0);

  return (
    <div
      className="cart-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="cart-wrapper">
        <div className="cart-header">
          <span role="img" aria-label="cart">🛒</span> My Cart
        </div>

        <div className="cart-box">
          {[...menItems, ...womenItems].map((item) => (
            <div className="cart-item" key={`item-${item.id}`}>
              <img src={item.cologne.image} alt="Cologne" className="item-thumbnail" />
              <div className="item-info">
                <strong>{item.cologne.name}</strong>
                <div>Quantity: {item.quantity}</div>
                <div>Price: ${item.cologne.price}</div>
              </div>
              <button
                className="remove-button"
                onClick={() =>
                  handleRemove(
                    item.id,
                    womenItems.some(w => w.id === item.id)
                  )
                }
              >
                🗑️ Remove
              </button>
            </div>
          ))}

          <div className="cart-total-row">
            <div className="cart-total">Total: ${total.toFixed(2)}</div>
            <div className="cart-buttons">
              <button className="home-button" onClick={() => navigate("/customer-home")}>
                ⬅️ Home
              </button>
              <button className="checkout-button" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
