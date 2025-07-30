import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMovieContext } from "../contexts/MovieContext";

// Simulate fetching a single movie (1 sec delay)
const fetchMovie = async (movie) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(movie), 1000);
  });
};

function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  const { data: fetchedMovie, isLoading } = useQuery({
    queryKey: ["movie", movie.id],
    queryFn: () => fetchMovie(movie),
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 animate-pulse h-80 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const favorite = isFavorite(fetchedMovie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(fetchedMovie.id);
    } else {
      addToFavorites(fetchedMovie);
    }
  }

  function handleSeeMore() {
    navigate(`/movie/${fetchedMovie.id}`, { state: { movie: fetchedMovie } });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${fetchedMovie.poster_path}`}
          alt={fetchedMovie.title}
          className="w-full h-70 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <button
            className={`absolute top-2 right-2 p-2 text-white rounded-full hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-green-400 ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♡
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 focus:outline-none transition-all"
            onClick={handleSeeMore}
          >
            See More
          </button>
        </div>
      </div>
      <div className="p-1">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {fetchedMovie.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {fetchedMovie.release_date?.split("-")[0]}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
// 