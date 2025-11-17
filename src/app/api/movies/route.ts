import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc&include_adult=false`
    );

    if (!response.ok) {
      throw new Error("TMDB API response was not ok");
    }

    const data = await response.json();

    // Ensure we always return exactly 20 movies per page
    if (data.results && data.results.length > 20) {
      data.results = data.results.slice(0, 20);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
