import MovieCard from '../components/MovieCard';
import { useState } from 'react';
import { useMovies } from '../hooks/useMovies'; //  Custom query hook

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    quality: 'All',
    genre: 'All',
    rating: 'All',
    year: 'All',
    language: 'All',
    orderBy: 'Latest',
  });

  const {
    data: movies = [],
    isLoading,
    isError,
    error,
  } = useMovies(searchQuery, filters); //  Using TanStack query hook

  const handleSearch = (e) => {
    e.preventDefault();
    // Remove refetch() - TanStack Query will automatically refetch when searchQuery changes
  };

  const handleFilterChange = (e) => {
    console.log('Filter changed:', e.target.name, '=', e.target.value); // Debug log
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Remove refetch() - TanStack Query will automatically refetch when filters change
  };

  return (
    <div className="bg-black min-h-screen p-6">
      <form
        onSubmit={handleSearch}
        className="max-w-4xl mx-auto mb-8 bg-black p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          placeholder="Search for a movie..."
          className="w-full border text-center border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 text-center">
          {[
            { name: 'quality', label: 'Quality', options: ['All', '4K', '1080p', '720p'] },
            { name: 'genre', label: 'Genre', options: ['All', 'Drama', 'Adventure', 'Crime', 'Action', 'Comedy'] },
            { name: 'rating', label: 'Rating', options: ['All', ...Array.from({ length: 10 }, (_, i) => i + 1)] },
            { name: 'year', label: 'Year', options: ['All', ...Array.from({ length: 2025 - 1949 + 1 }, (_, i) => 2025 - i)] },
            { name: 'language', label: 'Language', options: ['All', 'English', 'Chinese', 'Hindi', 'French'] },
            { name: 'orderBy', label: 'Order By', options: ['Latest', 'Older', 'Feature', 'Seeds', 'Peers'] },
          ].map(({ name, label, options }) => (
            <div key={name}>
              <label className="block text-sm text-white font-semibold mb-1">
                {label}:
              </label>
              <select
                name={name}
                value={filters[name]}
                onChange={handleFilterChange}
                className="w-full border text-center border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full px-6 mt-3 py-2 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white font-medium rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Search
        </button>
      </form>

      {/* Debug/*}
      {/* <div className="max-w-4xl mx-auto mb-4 text-white text-sm">
        <p>Search Query: "{searchQuery}"</p>
        <p>Active Filters: {JSON.stringify(filters)}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Movies Count: {movies.length}</p>
      </div> */}

      {isError && (
        <div className="text-red-500 text-center">
          {error.message || 'Failed to load movies.'}
        </div>
      )}

      {isLoading ? (
        <div className="text-white text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))
          ) : (
            <div className="col-span-4 text-center text-white text-lg">
              No movies found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;