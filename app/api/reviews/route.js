import jwt from "jsonwebtoken";
import { query, execute } from "../../../lib/db.js";

function verifyTokenFromHeader(request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
    return payload;
  } catch (err) {
    return null;
  }
}

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
  const user = verifyTokenFromHeader(request);
  if (!user) {
    return new Response(JSON.stringify({ message: "Authentication required" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const result = await execute(
    "INSERT INTO reviews (movie_id, user_id, name, rating, comment) VALUES (?, ?, ?, ?, ?)",
    [body.movieId, user.id, user.username, Number(body.rating), body.comment]
  );

  const inserted = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE id = ? LIMIT 1",
    [result.insertId]
  );
  return new Response(JSON.stringify(inserted[0] || {}), { headers: { "Content-Type": "application/json" } });
}