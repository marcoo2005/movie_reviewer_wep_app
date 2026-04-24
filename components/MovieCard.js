"use client";

import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <div style={{ margin: 10 }}>
      <img src={movie.Poster} width="150" />
      <h3>{movie.Title}</h3>

      <Link href={`/movie/${movie.imdbID}`}>
        View Details
      </Link>
    </div>
  );
}