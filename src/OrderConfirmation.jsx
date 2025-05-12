// src/pages/OrderConfirmation.jsx
import React from 'react';

export default function OrderConfirmation() {
  const order = JSON.parse(localStorage.getItem('orderSummary'));

  if (!order) {
    return <h2>No order found.</h2>;
  }

  return (
    <div className="checkout-container">
      <h2>Your order is being processed</h2>
      <h3>Summary</h3>
      <p><strong>Name:</strong> {order.shippingInfo.name}</p>
      <p><strong>Address:</strong> {order.shippingInfo.address}</p>
      <p><strong>Email:</strong> {order.shippingInfo.email}</p>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      {order.discountApplied && <p><strong>Discount:</strong> 20% applied</p>}
      <h4>Total Paid: ${order.total}</h4>
    </div>
  );
}
