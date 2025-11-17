// services/tmdb.ts
import axios from "axios";
import { Movie, MovieResponse, Genre } from "@/types/movie";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  },
});

export const tmdbService = {
  async getMovies(page: number = 1): Promise<MovieResponse> {
    const response = await tmdbApi.get(
      `/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`
    );
    return response.data;
  },

  async getMoviesByFilters(filters: any): Promise<MovieResponse> {
    const { genres, year, rating } = filters;
    let url = `/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;

    if (genres?.length) url += `&with_genres=${genres.join(",")}`;
    if (year) url += `&year=${year}`;
    if (rating) url += `&vote_average.gte=${rating}`;

    const response = await tmdbApi.get(url);
    return response.data;
  },

  async getGenres(): Promise<Genre[]> {
    const response = await tmdbApi.get(`/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  },

  async getRandomMovie(filters: any): Promise<Movie> {
    const movies = await this.getMoviesByFilters(filters);
    const randomIndex = Math.floor(Math.random() * movies.results.length);
    return movies.results[randomIndex];
  },
};
