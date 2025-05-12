// src/myprofile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./myprofile.css";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/api/accounts/user/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user data");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div className="myprofile-container">
      <h1>My Profile</h1>
      <div className="profile-info">
        <label>Username:</label>
        <span>{user.username}</span>
      </div>
      <div className="profile-info">
        <label>Email:</label>
        <span>{user.email}</span>
      </div>
      <div className="profile-info">
        <label>Date Joined:</label>
        <span>{new Date(user.date_joined).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
