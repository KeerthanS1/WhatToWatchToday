import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genres = searchParams.get("genres");
  const year = searchParams.get("year");
  const rating = searchParams.get("rating");

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=1&sort_by=popularity.desc&include_adult=false`;

  if (genres) url += `&with_genres=${genres}`;
  if (year) url += `&year=${year}`;
  if (rating) url += `&vote_average.gte=${rating}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Limit to 20 movies
    data.results = data.results.slice(0, 20);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
