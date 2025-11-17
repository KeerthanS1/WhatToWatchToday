"use client";
import { motion } from "framer-motion";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: () => void;
}

export default function MovieCard({ movie, index, onClick }: MovieCardProps) {
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
      transition={{ duration: 0.5, delay: index * 0.05 }} // Faster animation
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-2xl h-full">
        {/* Movie Poster */}
        <img
          src={imageUrl}
          alt={movie.title}
          className="w-full h-64 object-cover transition-all duration-500 group-hover:brightness-50"
          loading="lazy" // Lazy loading for better performance
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center justify-between">
            <span
              className={`font-semibold text-xs ${getRatingColor(
                movie.vote_average
              )}`}
            >
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-xs text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition-all">
              View Details
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
