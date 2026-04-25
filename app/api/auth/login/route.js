import bcrypt from "bcryptjs";
import { query } from "../../../../lib/db.js";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      const raw = await request.text().catch(() => "");
      console.error('LOGIN raw body (parse failed):', raw.slice ? raw.slice(0, 1000) : String(raw));
      return new Response(JSON.stringify({ message: "incorrect password Or user .please try agin." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    const { username, password } = body;
    console.log('LOGIN attempt for', username && String(username));
    if (!username || !password) {
      return new Response(JSON.stringify({ message: "incorrect password Or user .please try agin." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const rows = await query("SELECT id, password_hash FROM users WHERE username = ? LIMIT 1", [username]);
    const user = rows && rows[0];
    if (!user) return new Response(JSON.stringify({ message: "incorrect password Or user .please try agin." }), { status: 401, headers: { "Content-Type": "application/json" } });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return new Response(JSON.stringify({ message: "incorrect password Or user .please try agin." }), { status: 401, headers: { "Content-Type": "application/json" } });

    const { default: jwt } = await import("jsonwebtoken");
    const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET || "dev_jwt_secret", { expiresIn: "7d" });

    return new Response(JSON.stringify({ token, user: { id: user.id, username } }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error('LOGIN ERROR', err && err.stack ? err.stack : String(err));
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
