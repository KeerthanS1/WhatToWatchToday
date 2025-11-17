import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    // Get a random page and pick a random movie
    const randomPage = Math.floor(Math.random() * 10) + 1;
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${randomPage}&sort_by=popularity.desc`
    );
    const data = await response.json();
    const randomIndex = Math.floor(Math.random() * data.results.length);
    return NextResponse.json(data.results[randomIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch random movie" },
      { status: 500 }
    );
  }
}
