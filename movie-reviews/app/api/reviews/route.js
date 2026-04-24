import jwt from "jsonwebtoken";
import { query, execute } from "../../../../lib/db.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  if (movieId) {
    const rows = await query(
      "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE movie_id = ? ORDER BY created_at DESC",
      [movieId]
    );
    return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
  }

  const rows = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews ORDER BY created_at DESC",
    []
  );
  return new Response(JSON.stringify(rows), { headers: { "Content-Type": "application/json" } });
}

export async function POST(request) {
  const body = await request.json();
  const result = await execute(
    "INSERT INTO reviews (movie_id, user_id, name, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [body.movieId, null, body.name, Number(body.rating), body.comment]
  );

  const inserted = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return new Response(JSON.stringify(inserted[0] || {}), { headers: { "Content-Type": "application/json" } });
}