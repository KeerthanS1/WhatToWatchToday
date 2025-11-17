import axios from "axios";
import { Movie, MovieResponse, Genre } from "@/types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const tmdbService = {
  async getMovies(page: number = 1): Promise<MovieResponse> {
    // If no API key, return mock data
    if (!API_KEY) {
      console.warn("TMDB API key not found. Using mock data.");
      const mockData = generateMockMovies(page);
      return {
        page,
        results: mockData,
        total_pages: 5, // Mock total pages
        total_results: 100,
      };
    }

    try {
      const response = await axios.get(`/api/movies?page=${page}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching movies:", error);
      // Fallback to mock data
      const mockData = generateMockMovies(page);
      return {
        page,
        results: mockData,
        total_pages: 5,
        total_results: 100,
      };
    }
  },

  async getMoviesByFilters(filters: any): Promise<MovieResponse> {
    const { genres, year, rating } = filters;
    let url = `/api/movies/filter?`;
    const params = new URLSearchParams();

    if (genres?.length) params.append("genres", genres.join(","));
    if (year) params.append("year", year);
    if (rating) params.append("rating", rating.toString());

    const response = await axios.get(url + params.toString());
    return response.data;
  },

  async getRandomMovie(): Promise<Movie> {
    const response = await axios.get("/api/movies/random");
    return response.data;
  },

  async getMovieDetails(movieId: number): Promise<Movie> {
    const response = await axios.get(`/api/movies/${movieId}`);
    return response.data;
  },

  async getGenres(): Promise<Genre[]> {
    const response = await axios.get("/api/genres");
    return response.data;
  },
};

function generateMockMovies(page: number): Movie[] {
  const startId = (page - 1) * 20;
  return Array.from({ length: 20 }, (_, i) => ({
    id: startId + i + 1,
    title: `Movie ${startId + i + 1}`,
    overview: "This is a mock movie description for development purposes.",
    poster_path: "/default-poster.jpg",
    backdrop_path: "/default-backdrop.jpg",
    release_date: "2023-01-01",
    vote_average: Math.random() * 10,
    genre_ids: [28, 12],
  }));
}
