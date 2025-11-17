// components/MovieCard.tsx
"use client";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie, index }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder-movie.jpg";

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl bg-gray-800"
      >
        {/* Movie Poster */}
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-80 object-cover transition-all duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>

          <div className="flex items-center justify-between mb-2">
            <span
              className={`font-semibold ${getRatingColor(movie.vote_average)}`}
            >
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          {/* Description on Hover */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? "auto" : 0,
            }}
            className="overflow-hidden"
          >
            <p className="text-sm text-gray-300 line-clamp-3 mt-2">
              {movie.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors">
                Watch Now
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                ❤️
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
