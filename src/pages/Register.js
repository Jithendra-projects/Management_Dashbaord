import React, { useState } from "react";
import { register } from "../utils/mockApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      await register(form);
      setMsg("Registered successfully. You can now login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form">
      <h2>Create an account</h2>

      <input
        className="input"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="input"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create account"}
      </button>

      {msg && (
        <div style={{ marginTop: 12 }} className="small">
          {msg}
        </div>
      )}
    </div>
  );
}
