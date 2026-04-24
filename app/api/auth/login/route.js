import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../../../../lib/db.js";

export async function POST(request) {
  const body = await request.json();
  const { username, password } = body;
  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
  }

  const rows = await query("SELECT id, password_hash FROM users WHERE username = ? LIMIT 1", [username]);
  const user = rows[0];
  if (!user) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

  const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || "dev_jwt_secret", { expiresIn: "7d" });

  return new Response(JSON.stringify({ token, user: { id: user.id, username } }), { headers: { "Content-Type": "application/json" } });
}
