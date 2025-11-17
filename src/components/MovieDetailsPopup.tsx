"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { useEffect, useState } from "react";

interface MovieDetailsPopupProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieDetailsPopup({
  movie,
  onClose,
}: MovieDetailsPopupProps) {
  const [streamingLinks, setStreamingLinks] = useState<string[]>([]);

  useEffect(() => {
    // Mock streaming links - in real app, you'd use a streaming availability API
    const links = [
      "https://netflix.com",
      "https://primevideo.com",
      "https://hulu.com",
      "https://disneyplus.com",
    ];
    setStreamingLinks(links.slice(0, Math.floor(Math.random() * 3) + 1));
  }, [movie]);

  if (!movie) return null;

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : imageUrl;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop Image */}
          <div
            className="h-64 bg-cover bg-center rounded-t-2xl relative"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-2xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={movie.title}
                  className="w-64 rounded-xl shadow-2xl -mt-32 relative z-10"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-white font-semibold">
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                  </div>
                  <span className="text-gray-300">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  {movie.runtime && (
                    <span className="text-gray-300">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  )}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {movie.overview}
                </p>

                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white text-lg font-semibold mb-2">
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Streaming Links */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Watch On
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {streamingLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                      >
                        {new URL(link).hostname.replace("www.", "")}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {movie.budget && movie.budget > 0 && (
                    <div>
                      <span className="text-gray-400">Budget: </span>
                      <span className="text-white">
                        ${(movie.budget / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  )}
                  {movie.revenue && movie.revenue > 0 && (
                    <div>
                      <span className="text-gray-400">Revenue: </span>
                      <span className="text-white">
                        ${(movie.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
