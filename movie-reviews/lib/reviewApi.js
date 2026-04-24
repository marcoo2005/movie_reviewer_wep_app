const API_URL = "/api/reviews";

export async function getReviews(movieId) {
  try {
    const res = await fetch(`${API_URL}?movieId=${encodeURIComponent(movieId)}`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

export async function addReview(movieId, name, rating, comment) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movieId,
        name,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to add review");
    }
    return res.json();
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

export async function updateReview(id, name, rating, comment) {
  try {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating: Number(rating), comment }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to update review");
    }
    return res.json();
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}

export async function deleteReview(id) {
  try {
    const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete review");
    }
    return res.json();
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}