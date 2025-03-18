import { useMovieContext } from "../contexts/MovieContext";
import { useNavigate } from "react-router-dom";


function MovieCard({ movie }) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const navigate = useNavigate();
    const favorite = isFavorite(movie.id)

    function onFavoriteClick(e) {
      e.preventDefault()
      if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }
    function handleSeeMore() {
      navigate(`/movie/${movie.id}`, { state: { movie } });
    }
  
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ">
        <div className="relative">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
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
            {movie.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {movie.release_date?.split("-")[0]}
          </p>
        </div>
      </div>
    );
  }
  
  export default MovieCard;
  