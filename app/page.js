"use client";

import Link from "next/link";
import { useState } from "react";
import { searchMovies as searchMoviesAPI } from "@/lib/api";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async () => {
    if (!query) {
      alert("Type something first");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const data = await searchMoviesAPI(query);
      if (data.Response === "False") {
        setError(data.Error || "No movies found");
        setMovies([]);
      } else {
        setMovies(data.Search || []);
      }
    } catch (err) {
      setError("Error searching movies. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
      color: "#fff"
    }}>
      <div style={{ padding: "40px 20px", maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#fff", marginBottom: 10, fontSize: 48, fontWeight: "bold", textShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}>🎬 CINEMA</h1>
        <p style={{ textAlign: "center", color: "#aaa", marginBottom: 30, fontSize: 16 }}>Discover movies and read community reviews</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 30 }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movie title..."
            onKeyPress={(e) => e.key === "Enter" && searchMovies()}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: 6,
              border: "2px solid #22c55e",
              fontSize: 16,
              backgroundColor: "#111",
              color: "#fff",
              transition: "all 0.3s",
              boxShadow: "0 0 10px rgba(34, 197, 94, 0.2)"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#22c55e";
              e.target.style.boxShadow = "0 0 20px rgba(34, 197, 94, 0.4)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#22c55e";
              e.target.style.boxShadow = "0 0 10px rgba(34, 197, 94, 0.2)";
            }}
          />

          <button 
            onClick={searchMovies} 
            disabled={loading}
            style={{
              padding: "14px 40px",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 16,
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.boxShadow = "0 6px 20px rgba(0, 123, 255, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.boxShadow = "0 4px 15px rgba(0, 123, 255, 0.3)";
              }
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <p style={{ color: "#ff6b6b", textAlign: "center", marginBottom: 30, fontSize: 16 }}>❌ {error}</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "25px" }}>
          {movies.map((movie) => (
            <Link key={movie.imdbID} href={`/movie/${movie.imdbID}`}>
              <div style={{ 
                cursor: "pointer", 
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#1a1a1a",
                transition: "all 0.3s ease",
                border: "2px solid transparent",
                boxShadow: "0 8px 20px rgba(0,0,0,0.4)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(34, 197, 94, 0.3)";
                e.currentTarget.style.borderColor = "#22c55e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
                e.currentTarget.style.borderColor = "transparent";
              }}
              >
                <div style={{ width: "100%", height: "240px", backgroundColor: "#333", overflow: "hidden", position: "relative" }}>
                  <img 
                    src={movie.Poster} 
                    width="100%" 
                    height="100%"
                    style={{ objectFit: "cover", display: "block" }} 
                    alt={movie.Title}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#666;font-size:12px;text-align:center;padding:8px;">No Image Available</div>';
                    }}
                  />
                </div>
                <div style={{ padding: "14px" }}>
                  <p style={{ padding: 0, margin: "0 0 8px 0", fontWeight: "bold", fontSize: "13px", color: "#fff", minHeight: "36px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{movie.Title}</p>
                  <p style={{ padding: 0, margin: "0", fontSize: "12px", color: "#22c55e", fontWeight: "bold" }}>{movie.Year}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {movies.length === 0 && !loading && !error && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <p style={{ fontSize: 20, color: "#666" }}>🔍 Search for a movie to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}