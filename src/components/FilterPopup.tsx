// components/FilterPopup.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Genre } from "@/types/movie";
import { tmdbService } from "@/services/tmdb";

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRandomSelect: (movie: any) => void;
}

export default function FilterPopup({
  isOpen,
  onClose,
  onRandomSelect,
}: FilterPopupProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [year, setYear] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  useEffect(() => {
    const fetchGenres = async () => {
      const genresData = await tmdbService.getGenres();
      setGenres(genresData);
    };
    fetchGenres();
  }, []);

  const handleRandomSelect = async () => {
    const filters = {
      genres: selectedGenres,
      year: year || undefined,
      rating: rating || undefined,
    };
    const randomMovie = await tmdbService.getRandomMovie(filters);
    onRandomSelect(randomMovie);
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Discover Your Next Movie
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
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedGenres.includes(genre.id)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear()}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Filter by year"
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Rating */}
            <div className="mb-8">
              <h3 className="text-white text-lg mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-white min-w-12">{rating}/10</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleRandomSelect}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                🎲 Surprise Me!
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
              >
                Skip & Browse All
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
