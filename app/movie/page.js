"use client";

import { useEffect, useState } from "react";
import { getMovie } from "../../lib/api";
import ReviewForm from "../../components/ReviewForm";
import ReviewList from "../../components/ReviewList";

export default function MoviePage({ params }) {
  const { id } = params;
  const [movie, setMovie] = useState(null);
  const [refreshReviews, setRefreshReviews] = useState(0);

  useEffect(() => {
    getMovie(id).then(setMovie);
  }, [id]);

  const handleReviewAdded = () => {
    setRefreshReviews(prev => prev + 1);
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30, maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 30, marginBottom: 30 }}>
        <div>
          <img 
            src={movie.Poster} 
            width="250" 
            style={{ borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}
            alt={movie.Title}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: "0 0 10px 0" }}>{movie.Title}</h1>
          <p style={{ color: "#666", marginBottom: 15 }}>
            <strong>Year:</strong> {movie.Year} | <strong>Rated:</strong> {movie.Rated} | <strong>Runtime:</strong> {movie.Runtime}
          </p>
          <p style={{ color: "#666", marginBottom: 15 }}>
            <strong>Genre:</strong> {movie.Genre}
          </p>
          <p style={{ color: "#666", marginBottom: 15 }}>
            <strong>Director:</strong> {movie.Director}
          </p>
          <p style={{ color: "#666", marginBottom: 15 }}>
            <strong>Actors:</strong> {movie.Actors}
          </p>
          <div style={{ backgroundColor: "#f5f5f5", padding: 15, borderRadius: 8, marginBottom: 15 }}>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{movie.Plot}</p>
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
  );
}