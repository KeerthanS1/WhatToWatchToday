// app/page.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";
import FilterPopup from "@/components/FilterPopup";
import MovieCard from "@/components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showFilterPopup, setShowFilterPopup] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show popup on first visit
    const hasSeenPopup = localStorage.getItem("hasSeenFilterPopup");
    if (hasSeenPopup) {
      setShowFilterPopup(false);
    }
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const data = await tmdbService.getMovies();
      setMovies(data.results);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowFilterPopup(false);
    localStorage.setItem("hasSeenFilterPopup", "true");
  };

  const handleRandomSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowFilterPopup(false);
    localStorage.setItem("hasSeenFilterPopup", "true");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.h1
              className="text-4xl font-bold text-white"
              whileHover={{ scale: 1.05 }}
            >
              🎬 What to watch today
            </motion.h1>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilterPopup(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              🎲 Find Random
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Selected Random Movie */}
        <AnimatePresence>
          {selectedMovie && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎯 Your Random Pick
                </h2>
                <div className="flex gap-6">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${selectedMovie.poster_path}`}
                    alt={selectedMovie.title}
                    className="w-48 rounded-xl shadow-2xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {selectedMovie.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {selectedMovie.overview}
                    </p>
                    <div className="flex gap-4">
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
                        ▶️ Watch Now
                      </button>
                      <button
                        onClick={() => setSelectedMovie(null)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Movies Grid */}
        <section>
          <motion.h2
            className="text-3xl font-bold text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Latest Movies
          </motion.h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-800 rounded-2xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              layout
            >
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </motion.div>
          )}
        </section>
      </main>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={handleClosePopup}
        onRandomSelect={handleRandomSelect}
      />
    </div>
  );
}
