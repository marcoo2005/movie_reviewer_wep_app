"use client";

import { useState } from "react";
import { addReview } from "@/lib/reviewApi";

export default function ReviewForm({ movieId, onReviewAdded }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim() || !comment.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addReview(movieId, name, rating, comment);
      setName("");
      setRating(5);
      setComment("");
      setSuccess(true);
      onReviewAdded?.();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to submit review: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 30, padding: 20, backgroundColor: "#1a1a1a", borderRadius: 8, border: "1px solid #333" }}>
      <h2 style={{ color: "#fff" }}>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, color: "#fff" }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", backgroundColor: "#222", color: "#fff" }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, color: "#fff" }}>Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", backgroundColor: "#222", color: "#fff" }}
          >
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ display: "block", marginBottom: 5, color: "#fff" }}>Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this movie..."
            rows="4"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", backgroundColor: "#222", color: "#fff", fontFamily: "Arial" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            fontWeight: "bold"
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

        {error && <p style={{ color: "#ff6b6b", marginTop: 10 }}>{error}</p>}
        {success && <p style={{ color: "#51cf66", marginTop: 10 }}>Review submitted successfully!</p>}
      </form>
    </div>
  );
}