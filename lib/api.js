const API_KEY = "ef89a6d4";

export async function searchMovies(query) {
  const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
  return res.json();
}

export async function getMovie(id) {
  const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
  return res.json();
}