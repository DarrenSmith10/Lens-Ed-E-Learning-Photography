import React, { useState } from "react";
import axios from "../api";
import "../components/Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post("/api/users/login", formData);

      const user = response?.data?.user;
      if (user) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("username", user.name || "Guest");
        setSuccess(true);
        setError(null);
      } else {
        throw new Error("Login response did not include user.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Login failed. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">Login successful!</p>}
      </form>
    </div>
  );
};

export default Login;