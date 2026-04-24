"use client";

import { useState } from "react";
import { saveToken } from "@/lib/authClient";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({}));
        throw new Error(message || "Registration failed");
      }
      const data = await res.json();
      saveToken(data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ color: "#fff" }}>Register</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div style={{ marginBottom: 12 }}>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" style={{ width: "100%", padding: 10 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" style={{ width: "100%", padding: 10 }} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 16px", background: "#22c55e", border: "none", color: "#000" }}>{loading ? "Creating..." : "Create account"}</button>
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}
      </form>
    </div>
  );
}
