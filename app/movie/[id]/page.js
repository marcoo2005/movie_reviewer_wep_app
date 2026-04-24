"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMovie } from "../../../lib/api";
import ReviewForm from "../../../components/ReviewForm";
import ReviewList from "../../../components/ReviewList";

export default function MoviePage({ params }) {
  const [id, setId] = useState(null);
  const [movie, setMovie] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      getMovie(id).then(setMovie);
    }
  }, [id]);

  const handleReviewAdded = () => {
    setRefreshReviews(prev => prev + 1);
  };

  if (!movie) return <div style={{ padding: 30, textAlign: "center", backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}><p>Loading...</p></div>;

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: 30, color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link href="/">
          <button style={{ marginBottom: 20, padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: "bold" }}>
            ← Back to Search
          </button>
        </Link>

        <div style={{ display: "flex", gap: 30, marginBottom: 30 }}>
          <div style={{ border: "4px solid #22c55e", borderRadius: 8, padding: 8, backgroundColor: "#111" }}>
            <img 
              src={movie.Poster} 
              width="250" 
              style={{ borderRadius: 4, display: "block" }}
              alt={movie.Title}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: "0 0 10px 0", fontSize: 36, color: "#fff" }}>{movie.Title}</h1>
            <p style={{ color: "#aaa", marginBottom: 15 }}>
              <strong>Year:</strong> {movie.Year} | <strong>Rated:</strong> {movie.Rated} | <strong>Runtime:</strong> {movie.Runtime}
            </p>
            <p style={{ color: "#aaa", marginBottom: 15 }}>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p style={{ color: "#aaa", marginBottom: 15 }}>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p style={{ color: "#aaa", marginBottom: 15 }}>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <div style={{ backgroundColor: "#1a1a1a", padding: 15, borderRadius: 8, marginBottom: 15, border: "1px solid #333" }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#fff" }}>Plot</h3>
              <p style={{ margin: 0, lineHeight: 1.6, color: "#ccc" }}>{movie.Plot}</p>
            </div>
            {movie.imdbRating && (
              <p style={{ fontSize: 18, fontWeight: "bold", color: "#ff9800" }}>
                ⭐ IMDb Rating: {movie.imdbRating}/10
              </p>
            )}
          </div>
        </div>

        <ReviewForm movieId={id} onReviewAdded={handleReviewAdded} />
        <ReviewList movieId={id} refreshTrigger={refreshReviews} />
      </div>
    </div>
  );
}
