"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import FilterPopup from "@/components/FilterPopup";
import MovieDetailsPopup from "@/components/MovieDetailsPopup";
import MovieCard from "@/components/MovieCard";

export default function Home() {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [moviesData, randomMovieData] = await Promise.all([
        tmdbService.getMovies(1), // Load first 20 movies
        tmdbService.getRandomMovie(),
      ]);
      setLatestMovies(moviesData.results);
      setRandomMovie(randomMovieData);
      setInitialLoadDone(true);

      // Check if there are more pages
      if (moviesData.results.length < 20 || page >= moviesData.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more movies when scrolling
  const loadMoreMovies = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const moviesData = await tmdbService.getMovies(nextPage);

      if (moviesData.results.length === 0) {
        setHasMore(false);
        return;
      }

      setLatestMovies((prev) => [...prev, ...moviesData.results]);
      setPage(nextPage);

      // Stop if we've reached the end or have enough movies
      if (
        moviesData.results.length < 20 ||
        nextPage >= moviesData.total_pages
      ) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

  // Scroll event handler
  useEffect(() => {
    if (!initialLoadDone || !hasMore || isLoading) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      // Load more when user is 100px from bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreMovies, hasMore, isLoading, initialLoadDone]);

  const handleFindRandom = async () => {
    try {
      const randomMovieData = await tmdbService.getRandomMovie();
      setRandomMovie(randomMovieData);
    } catch (error) {
      console.error("Error finding random movie:", error);
    }
  };

  const handleFilterApply = async (filters: any) => {
    try {
      const filteredData = await tmdbService.getMoviesByFilters(filters);
      setFilteredMovies(filteredData.results);
      setIsFiltered(true);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleClearFilters = () => {
    setFilteredMovies([]);
    setIsFiltered(false);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="WTWT Logo"
                  className="h-10 w-10 object-contain"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  What to Watch Today?
                </h1>
              </div>
            </motion.div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFindRandom}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                🎲 Find Random
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilterPopup(true)}
                className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                🔍 Filter & Search
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Random Movie Section */}
        <AnimatePresence>
          {randomMovie && (
            <motion.section
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    🎯 Your Random Pick
                  </h2>
                  <button
                    onClick={handleFindRandom}
                    className="text-sm text-purple-300 hover:text-purple-100 transition-colors"
                  >
                    🔄 Try Another
                  </button>
                </div>
                <div className="flex gap-6">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${randomMovie.poster_path}`}
                    alt={randomMovie.title}
                    className="w-32 rounded-xl shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => setSelectedMovie(randomMovie)}
                  />
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold text-white mb-2 hover:text-purple-200 transition-colors cursor-pointer"
                      onClick={() => setSelectedMovie(randomMovie)}
                    >
                      {randomMovie.title}
                    </h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">
                      {randomMovie.overview}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setSelectedMovie(randomMovie)}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Filtered Movies Section */}
        {isFiltered && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">
                ✨ Filtered Movies
              </h2>
              <button
                onClick={handleClearFilters}
                className="text-purple-300 hover:text-purple-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  index={index}
                  onClick={() => setSelectedMovie(movie)}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Latest Movies Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-8">
            🎬 Latest Movies
          </h2>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {latestMovies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${index}`}
                movie={movie}
                index={index}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="text-gray-400">Loading more movies...</span>
              </div>
            </div>
          )}

          {/* End of Results */}
          {!hasMore && latestMovies.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">
                🎉 You've reached the end! Loaded {latestMovies.length} movies.
              </p>
            </div>
          )}

          {/* Initial Loading */}
          {!initialLoadDone && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(20)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl h-64 animate-pulse"
                ></div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* Popups */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        onFilterApply={handleFilterApply}
      />

      <MovieDetailsPopup
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

      {/* Scroll to Top Button */}
      {latestMovies.length > 40 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg z-30 transition-all"
        >
          ↑
        </motion.button>
      )}
    </div>
  );
}
