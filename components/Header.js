"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, clearToken } from "@/lib/authClient";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div></div>
      <div>
        {user ? (
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ color: "#fff" }}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={{ background: "#ff6b6b", color: "#fff", border: "none", padding: "8px 12px", borderRadius: 6 }}>Logout</button>
          </div>
        ) : (
          <Link href="/login"><button style={{ background: "#22c55e", color: "#000", border: "none", padding: "8px 12px", borderRadius: 6 }}>Login / Register</button></Link>
        )}
      </div>
    </header>
  );
}
