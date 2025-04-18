
const API_KEY = 'ee28a6b0c12761ad7bf116fbb11a2118';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results;
};

export const searchMovies = async (query, filters = {}) => {
    // Start with basic parameters
    const params = new URLSearchParams();
    params.append('api_key', API_KEY);
    
    // Add search query if provided
    if (query && query.trim()) {
        params.append('query', query);
        // Use search endpoint for specific queries
        const response = await fetch(`${BASE_URL}/search/movie?${params}`);
        const data = await response.json();
        return filterResults(data.results, filters);
    } else {
        // If no query, use discover endpoint to apply filters
        return discoverMovies(filters);
    }
};

// Helper function to filter movie results on the client side
const filterResults = (movies, filters) => {
    let filteredMovies = [...movies];
    
    if (filters.year && filters.year !== 'All') {
        filteredMovies = filteredMovies.filter(movie => {
            const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
            return releaseYear === parseInt(filters.year);
        });
    }
    
    if (filters.rating && filters.rating !== 'All') {
        filteredMovies = filteredMovies.filter(movie => {
            // TMDB uses a 10-point rating scale
            return Math.floor(movie.vote_average) >= parseInt(filters.rating);
        });
    }
    
    return filteredMovies;
};

// Use discover API for filtering without a specific search query
export const discoverMovies = async (filters = {}) => {
    const params = new URLSearchParams();
    params.append('api_key', API_KEY);
    
    // Map your UI filters to TMDB API parameters
    if (filters.year && filters.year !== 'All') {
        params.append('primary_release_year', filters.year);
    }
    
    if (filters.genre && filters.genre !== 'All') {
        // Map genre names to IDs (you would need a complete mapping)
        const genreMap = {
            'Action': 28,
            'Adventure': 12,
            'Comedy': 35,
            'Crime': 80,
            'Drama': 18
        };
        
        if (genreMap[filters.genre]) {
            params.append('with_genres', genreMap[filters.genre]);
        }
    }
    
    if (filters.language && filters.language !== 'All') {
        // Map language names to ISO codes
        const languageMap = {
            'English': 'en',
            'Chinese': 'zh',
            'Hindi': 'hi',
            'French': 'fr'
        };
        
        if (languageMap[filters.language]) {
            params.append('with_original_language', languageMap[filters.language]);
        }
    }
    
    // Handle sort order
    if (filters.orderBy) {
        const sortMap = {
            'Latest': 'release_date.desc',
            'Older': 'release_date.asc',
            'Feature': 'popularity.desc',
            'Seeds': 'vote_count.desc',
            'Peers': 'vote_average.desc'
        };
        
        params.append('sort_by', sortMap[filters.orderBy] || 'popularity.desc');
    }
    
    const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
    const data = await response.json();
    
    return data.results;
};