import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const dbFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../data/db.json");

async function readDb() {
  const file = await readFile(dbFile, "utf8");
  return JSON.parse(file);
}

async function writeDb(data) {
  await writeFile(dbFile, JSON.stringify(data, null, 2), "utf8");
}

export async function PUT(request, { params }) {
  const { id } = params;
  const requestId = decodeURIComponent(String(id ?? "")).trim();
  const body = await request.json();
  const db = await readDb();
  const reviews = Array.isArray(db.reviews) ? db.reviews : [];
  const index = reviews.findIndex((review) => {
    const storedId = String(review.id ?? "").trim();
    return storedId === requestId || storedId === String(Number(requestId));
  });

  if (index === -1 || !requestId) {
    return new Response(JSON.stringify({ message: "Review not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  reviews[index] = {
    ...reviews[index],
    name: body.name ?? reviews[index].name,
    rating: Number(body.rating ?? reviews[index].rating),
    comment: body.comment ?? reviews[index].comment,
    updatedAt: new Date().toISOString(),
  };

  await writeDb({ ...db, reviews });

  return new Response(JSON.stringify(reviews[index]), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const requestId = decodeURIComponent(String(id ?? "")).trim();
  const db = await readDb();
  const reviews = Array.isArray(db.reviews) ? db.reviews : [];
  const newReviews = reviews.filter((review) => {
    const storedId = String(review.id ?? "").trim();
    return storedId !== requestId && storedId !== String(Number(requestId));
  });

  if (!requestId || newReviews.length === reviews.length) {
    return new Response(JSON.stringify({ message: "Review not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  await writeDb({ ...db, reviews: newReviews });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
