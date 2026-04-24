"use client";

export function saveToken(token) {
  if (typeof window === "undefined") return;
  localStorage.setItem("mr_token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mr_token");
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("mr_token");
}

export function parseToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (err) {
    return null;
  }
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;
  return parseToken(token);
}
