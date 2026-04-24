import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dbFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../data/db.json");

async function readDb() {
  const file = await readFile(dbFile, "utf8");
  return JSON.parse(file);
}

async function writeDb(data) {
  await writeFile(dbFile, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  const db = await readDb();
  const reviews = Array.isArray(db.reviews) ? db.reviews : [];

  const filtered = movieId
    ? reviews.filter((review) => review.movieId === movieId)
    : reviews;

  return new Response(JSON.stringify(filtered), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const reviews = Array.isArray(db.reviews) ? db.reviews : [];

  const newReview = {
    id: Date.now().toString(),
    movieId: body.movieId,
    name: body.name,
    rating: Number(body.rating),
    comment: body.comment,
    createdAt: new Date().toISOString(),
  };

  reviews.push(newReview);
  await writeDb({ ...db, reviews });

  return new Response(JSON.stringify(newReview), {
    headers: { "Content-Type": "application/json" },
  });
}