import bcrypt from "bcryptjs";
import { execute, query } from "../../../../lib/db.js";

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;
  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
  }

  // check existing
  const existing = await query("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);
  if (existing.length > 0) {
    return new Response(JSON.stringify({ message: "Username already taken" }), { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 8);
  const result = await execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, hashed]);
  const insertId = result.insertId;

  const { default: jwt } = await import("jsonwebtoken");
  const token = jwt.sign({ id: insertId, username }, process.env.JWT_SECRET || "dev_jwt_secret", { expiresIn: "7d" });

  return new Response(JSON.stringify({ token, user: { id: insertId, username } }), { headers: { "Content-Type": "application/json" } });
}
