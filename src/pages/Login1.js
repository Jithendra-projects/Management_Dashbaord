import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { login } from "../utils/mockApi";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);

      dispatch(
        setCredentials({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })
      );
      // navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form">
      <h2>Sign in to SubManager</h2>

      <input
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {error && (
        <div style={{ marginTop: 12, color: "var(--danger)" }}>{error}</div>
      )}

      <div style={{ marginTop: 12 }} className="small">
        Hint: use <strong>admin@example.com</strong> to login as admin (mock)
      </div>
    </div>
  );
}
