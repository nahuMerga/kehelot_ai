import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api_f/kehelot_ai_f"; // Ensure correct path

const Auth = ({ mode }) => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    username: mode === "register" ? "" : "", // Ensure proper default
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (mode === "login") {
        // Login user
        response = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        if (response?.error) {
          setError(response.error);
        } else if (response?.access && response?.user_id) {
          // Store the received token and user ID
          localStorage.setItem("jwt_token", response.access);
          localStorage.setItem("user_id", response.user_id);

          // console.log("Login successful!");
          // console.log("Stored user_id:", localStorage.getItem("user_id"));

          navigate("/chat"); // Redirect to chat after login
        } else {
          setError("Invalid response from server.");
        }
      } else {
        // Register user
        response = await registerUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (response?.error) {
          setError(response.error);
        } else {
          // console.log("Registration successful! Now, you can log in.");
          navigate("/login"); // Redirect to login page after registration
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      // console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kihelot-dark p-4">
      <div className="glass-card w-full max-w-md p-8 animate-fade-up">
        <h2 className="text-3xl font-bold text-center mb-8">
          <span className="text-primary">
            {mode === "login" ? "Login" : "Register"}
          </span>
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                className="w-full px-4 py-2 rounded-lg glass"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg glass"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 rounded-lg glass"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-kihelot-dark rounded-lg font-semibold hover-glow"
            disabled={loading}
          >
            {loading ? "Processing..." : mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-6">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;
