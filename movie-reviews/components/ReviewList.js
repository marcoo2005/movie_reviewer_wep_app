"use client";

import { useEffect, useState } from "react";
import { getReviews, updateReview, deleteReview } from "@/lib/reviewApi";

export default function ReviewList({ movieId, refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getReviews(movieId);
        const reviewsArray = Array.isArray(data) ? data : [];
        const sorted = reviewsArray.sort((a, b) => b.rating - a.rating);
        setReviews(sorted);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(`Unable to load reviews: ${message}`);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, refreshTrigger]);

  const handleEdit = (review) => {
    setEditingId(String(review.id ?? ""));
    setEditName(review.name);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setActionError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setActionError("");
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editName.trim() || !editComment.trim()) {
      setActionError("Please fill in all edit fields.");
      return;
    }
    setSaving(true);
    setActionError("");
    try {
      await updateReview(reviewId, editName, editRating, editComment);
      setEditingId(null);
      setActionError("");
      const data = await getReviews(movieId);
      const reviewsArray = Array.isArray(data) ? data : [];
      setReviews(reviewsArray.sort((a, b) => b.rating - a.rating));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setActionError(`Could not update review: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    setActionError("");
    try {
      await deleteReview(reviewId);
      setReviews((current) => current.filter((review) => String(review.id) !== String(reviewId)));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setActionError(`Could not delete review: ${message}`);
    }
  };

  if (loading) return <p style={{ color: "#fff" }}>Loading reviews...</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h2 style={{ color: "#fff" }}>Reviews ({reviews.length})</h2>
      {error ? (
        <p style={{ color: "#ff6b6b", marginTop: 10 }}>{error}</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "#888" }}>No reviews yet. Be the first to review!</p>
      ) : (
        <div>
          {actionError && <p style={{ color: "#ff6b6b", marginTop: 10 }}>{actionError}</p>}
          {reviews.map((review) => {
            const reviewId = String(review.id ?? "");
            return (
              <div
                key={reviewId}
                style={{
                  padding: 15,
                  marginBottom: 15,
                  backgroundColor: "#1a1a1a",
                  borderRadius: 8,
                  borderLeft: "4px solid #22c55e",
                  border: "1px solid #333"
                }}
              >
                {editingId === reviewId ? (
                  <div style={{ display: "grid", gap: 12 }}>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
                    />
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
                    >
                      {[1, 2, 3, 4, 5].map((value) => (
                        <option key={value} value={value}>{`${value} - ${value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Good" : value === 4 ? "Very Good" : "Excellent"}`}</option>
                      ))}
                    </select>
                    <textarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={4}
                      style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #444", backgroundColor: "#111", color: "#fff" }}
                    />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(reviewId)}
                        disabled={saving}
                        style={{ padding: "10px 14px", borderRadius: 6, border: "none", backgroundColor: "#22c55e", color: "#000", fontWeight: "bold", cursor: saving ? "not-allowed" : "pointer" }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #444", backgroundColor: "transparent", color: "#fff", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <strong style={{ color: "#fff" }}>{review.name}</strong>
                      <span style={{ color: "#ff9800", fontSize: 16 }}>{"⭐".repeat(review.rating)}</span>
                    </div>
                    <p style={{ margin: "8px 0", color: "#ccc" }}>{review.comment}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <small style={{ color: "#666" }}>{new Date(review.createdAt).toLocaleDateString()}</small>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #444", backgroundColor: "#111", color: "#fff", cursor: "pointer" }}
                        >Edit</button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ff6b6b", backgroundColor: "#111", color: "#ff6b6b", cursor: "pointer" }}
                        >Delete</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}