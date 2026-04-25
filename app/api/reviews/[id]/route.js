import { query, execute } from "../../../../lib/db.js";

async function verifyTokenFromHeader(request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return null;
    const { default: jwt } = await import("jsonwebtoken");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_jwt_secret");
    return payload;
  } catch (err) {
    return null;
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const requestId = decodeURIComponent(String(id ?? "")).trim();
  const body = await request.json();

  const rows = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE id = ? LIMIT 1",
    [requestId]
  );
  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ message: "Review not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const review = rows[0];
  const user = await verifyTokenFromHeader(request);
  if (!user) return new Response(JSON.stringify({ message: "Authentication required" }), { status: 401 });
  if (String(review.userId) !== String(user.id)) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }

  await execute("UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE id = ?", [Number(body.rating ?? review.rating), body.comment ?? review.comment, requestId]);

  const updated = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE id = ? LIMIT 1",
    [requestId]
  );
  return new Response(JSON.stringify(updated[0] || {}), { headers: { "Content-Type": "application/json" } });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const requestId = decodeURIComponent(String(id ?? "")).trim();

  const rows = await query(
    "SELECT id, movie_id AS movieId, user_id AS userId, name, rating, comment, created_at AS createdAt, updated_at AS updatedAt FROM reviews WHERE id = ? LIMIT 1",
    [requestId]
  );
  if (!rows || rows.length === 0) {
    return new Response(JSON.stringify({ message: "Review not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const review = rows[0];
  const user = await verifyTokenFromHeader(request);
  if (!user) return new Response(JSON.stringify({ message: "Authentication required" }), { status: 401 });
  if (String(review.userId) !== String(user.id)) {
    return new Response(JSON.stringify({ message: "Forbidden" }), { status: 403 });
  }

  await execute("DELETE FROM reviews WHERE id = ?", [requestId]);

  return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
}
