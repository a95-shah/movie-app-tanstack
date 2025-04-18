import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";

function Favorites() {
    const { favorites } = useMovieContext();

    if (favorites && favorites.length > 0) {
        return (
            <div className="container mx-auto p-6">
                <h2 className="text-center text-2xl font-bold mb-6">Your Favorites</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map((movie) => (
                        <div key={movie.id} className="max-w-xs mx-auto">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h2 className="text-2xl font-bold mb-4">No Favorite Movies Yet</h2>
            <p className="text-center text-gray-600 max-w-md">
                Start adding movies to your favorites, and they will appear here.
            </p>
        </div>
    );
}

export default Favorites;


