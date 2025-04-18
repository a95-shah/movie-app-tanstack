// import { useMovieContext } from "../contexts/MovieContext";
// import MovieCard from "../components/MovieCard";

// function Favorites() {
//     const { favorites } = useMovieContext();

//     if (favorites && favorites.length > 0) {
//         return (
//             <div className="container mx-auto p-6">
//                 <h2 className="text-center text-2xl font-bold mb-6">Your Favorites</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {favorites.map((movie) => (
//                         <div key={movie.id} className="max-w-xs mx-auto">
//                             <MovieCard movie={movie} />
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     }
//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
//             <h2 className="text-2xl font-bold mb-4">No Favorite Movies Yet</h2>
//             <p className="text-center text-gray-600 max-w-md">
//                 Start adding movies to your favorites, and they will appear here.
//             </p>
//         </div>
//     );
// }

// export default Favorites;


import MovieCard from '../components/MovieCard';
import { useState, useEffect } from 'react';
import { searchMovies, getPopularMovies } from '../services/Api';

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        quality: "All",
        genre: "All",
        rating: "All",
        year: "All",
        language: "All",
        orderBy: "Latest"
    });

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (err) {
                console.log(err);
                setError("Failed to load movies...");
            } finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const searchResults = await searchMovies(searchQuery, filters);
            setMovies(searchResults);
            setError(null);
        } catch (err) {
            console.log(err);
            setError("Failed to search movies...");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-black min-h-screen p-6">
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-8 bg-black p-6 rounded-lg shadow-md">
                <label className="block text-white font-semibold mb-2">Search Term:</label>
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 text-center">
                    {[
                        { name: "quality", label: "Quality", options: ["All", "4K", "1080p", "720p"] },
                        { name: "genre", label: "Genre", options: ["All", "Drama", "Adventure", "Crime", "Action", "Comedy"] },
                        { name: "rating", label: "Rating", options: ["All", ...Array.from({ length: 10 }, (_, i) => i + 1)] },
                        { name: "year", label: "Year", options: ["All", ...Array.from({ length: 2025 - 1949 + 1 }, (_, i) => 2025 - i)] },
                        { name: "language", label: "Language", options: ["All", "English", "Chinese", "Hindi", "French"] },
                        { name: "orderBy", label: "Order By", options: ["Latest", "Older", "Feature", "Seeds", "Peers"] }
                    ].map(({ name, label, options }) => (
                        <div key={name}>
                            <label className="block text-sm text-white font-semibold mb-1">{label}:</label>
                            <select
                                name={name}
                                value={filters[name]}
                                onChange={handleFilterChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {options.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full px-6 mt-3 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    Search
                </button>
            </form>

            {error && <div className='error-message text-red-500 text-center'>{error}</div>}

            {loading ? (
                <div className='loading text-white text-center'>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;

