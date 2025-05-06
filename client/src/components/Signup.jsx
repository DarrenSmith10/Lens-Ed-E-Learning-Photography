import React, { useState } from "react";
import axios from "../api";
import "../Login.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users", formData);

      const user = response?.data?.user;
      if (user) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", user.name || "Guest");
        setSuccess(true);
        setError(null);
      } else {
        throw new Error("Signup response did not include user.");
      }
    } catch (err) {
      console.error("Signup error:", err.message);
      setError("Signup failed. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">Signup successful!</p>}
      </form>
    </div>
  );
};

export default Signup;