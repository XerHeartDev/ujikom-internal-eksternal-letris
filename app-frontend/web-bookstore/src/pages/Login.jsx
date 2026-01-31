import { useState } from "react";
import { useNavigate, useLocation, Link, Navigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  // STATE FORM
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // AUTH & ROUTER
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // PREVENT RE-LOGIN
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ORIGIN PAGE (BEFORE LOGIN)
  const from = location.state?.from?.pathname || "/";

  // HANDLE SUBMIT LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Request to backend
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // Save token & user to AuthContext
      login({
        token: res.data.token,
        user: res.data.user,
      });

      // Redirect to the initial landing page
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  // RENDER UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
