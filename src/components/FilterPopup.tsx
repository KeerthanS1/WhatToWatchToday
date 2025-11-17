"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Genre } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onFilterApply: (filters: any) => void;
}

export default function FilterPopup({
  isOpen,
  onClose,
  onFilterApply,
}: FilterPopupProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await tmdbService.getGenres();
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  const handleApplyFilters = async () => {
    setShowAnimation(true);

    // Close popup first
    onClose();

    // Wait for popup to close, then apply filters
    setTimeout(() => {
      const filters = {
        genres: selectedGenres,
        year: year || undefined,
        rating: rating || undefined,
      };
      onFilterApply(filters);
      setShowAnimation(false);
    }, 500);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setYear("");
    setRating(0);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  🎬 Filter Movies
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <h3 className="text-white text-lg mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`px-4 py-2 rounded-full transition-all border ${
                        selectedGenres.includes(genre.id)
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="mb-6">
                <h3 className="text-white text-lg mb-3">Release Year</h3>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Years</option>
                  {Array.from(
                    { length: new Date().getFullYear() - 1990 + 1 },
                    (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-8">
                <h3 className="text-white text-lg mb-3">
                  Minimum Rating: {rating}/10
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 3, opacity: 0 }}
              className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              HERE WE GO!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
