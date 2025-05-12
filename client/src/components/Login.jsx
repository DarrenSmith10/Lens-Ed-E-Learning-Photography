import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import "./Login.css";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useSession();
  const navigate = useNavigate();

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const validatePassword = () => {
    if (password !== password2) {
      displayError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    try {
      const response = await api.post('/api/users', {
        name: userName,
        email,
        password,
      });
      const data = response.data;

      if (data.user) {
        setUser({
          username: data.user.username || data.user.name,
          id: data.user.id,
        });
        localStorage.setItem("authToken", data.token);
        navigate('/');
      } else {
        displayError("Signup failed: No user returned");
      }
    } catch (error) {
      console.error("Signup error:", error);
      displayError("Signup failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', {
        email,
        password,
      });
      const data = response.data;

      if (data.user) {
        setUser({
          username: data.user.username || data.user.name,
          id: data.user.id,
        });
        localStorage.setItem("authToken", data.token);
        navigate('/');
      } else {
        displayError("Login failed: No user returned");
      }
    } catch (error) {
      console.error("Login error:", error);
      displayError("Login failed. Please check your credentials.");
    }
  };

  const toggleForm = () => setIsSignUp((prev) => !prev);

  return (
    <div className={`auth-container ${isSignUp ? "sign-up-mode" : ""}`}>
      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p>{error}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUp}>
          <h1>Sign Up</h1>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          {error && <p>{error}</p>}
          <button type="submit">Sign Up</button>
        </form>
      </div>

      {/* Overlay Section */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>Already have an account? Sign in here.</p>
            <button className="ghost" onClick={toggleForm}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Don’t have an account? Sign up here.</p>
            <button className="ghost" onClick={toggleForm}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;