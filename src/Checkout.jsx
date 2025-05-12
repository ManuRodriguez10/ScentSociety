// src/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './checkout.css';
import backgroundImage from './skybg.png';

export default function Checkout() {
  const [menItems, setMenItems] = useState([]);
  const [womenItems, setWomenItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', email: '' });
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('access');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await fetch('/api/cart/', { headers });
        const data = await res.json();
        setMenItems(data.items || []);
        setWomenItems(data.women_items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  const subtotal = [...menItems, ...womenItems].reduce((sum, item) => {
    const price = item?.cologne?.price ?? item?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const discount = discountApplied ? subtotal * 0.2 : 0;
  const total = (subtotal - discount).toFixed(2);

  const handleCheckout = async () => {
    const token = localStorage.getItem('access');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch('/api/checkout/', {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        const orderDetails = {
          items: [...menItems, ...womenItems],
          shippingInfo,
          discountApplied,
          total,
        };

        localStorage.setItem('orderSummary', JSON.stringify(orderDetails));
        navigate('/order-confirmation');
      } else {
        console.error('Checkout failed.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px 0',
      }}
    >
      <div className="checkout-container">
        <h2>Checkout</h2>

        <div className="checkout-section">
          <h3>Shipping Information</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={shippingInfo.email}
            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
          />
        </div>

        <div className="checkout-section">
          <h3>Payment Info</h3>
          <input type="text" placeholder="Card Number (e.g., 4111 1111 1111 1111)" />
          <input type="text" placeholder="Expiration (MM/YY)" />
          <input type="text" placeholder="CVV" />
        </div>

        <div className="checkout-section">
          <h3>Order Summary</h3>
          <ul>
            {[...menItems, ...womenItems].map((item, index) => (
              <li key={index}>
                {item.cologne.name} x {item.quantity} — ${item.cologne.price}
              </li>
            ))}
          </ul>

          <div className="promo">
            <input
              type="text"
              placeholder="Promo Code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button
              onClick={() => {
                if (promoCode === 'FIRSTORDER20') setDiscountApplied(true);
              }}
            >
              Apply
            </button>
          </div>

          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          {discountApplied && <p>Discount: -${discount.toFixed(2)}</p>}
          <h4>Total: ${total}</h4>

          <button className="checkout-btn" onClick={handleCheckout}>
            Place Order
          </button>

          <button className="checkout-back-btn" onClick={() => navigate('/cart')}>
            ⬅️ Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
