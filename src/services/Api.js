import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const API_KEY = 'ee28a6b0c12761ad7bf116fbb11a2118';
const BASE_URL = 'https://api.themoviedb.org/3';

// Query Keys Factory
export const movieQueries = {
  all: ['movies'],
  popular: () => [...movieQueries.all, 'popular'],
  details: (id) => [...movieQueries.all, 'details', id],
  search: (query, filters) => 
    [...movieQueries.all, 'search', query, filters],
  discover: (filters) => 
    [...movieQueries.all, 'discover', filters],
};

// Original API Functions (exported for backward compatibility)
export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch popular movies");
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

export const searchMovies = async (query, filters = {}) => {
  const params = new URLSearchParams({ api_key: API_KEY });

  if (query && query.trim()) {
    params.append("query", query);
    
    // Add year filter to search if specified
    if (filters.year && filters.year !== 'All') {
      params.append('year', filters.year);
    }

    const response = await fetch(`${BASE_URL}/search/movie?${params}`);
    if (!response.ok) throw new Error("Failed to search movies");
    const data = await response.json();
    return filterResults(data.results, filters);
  } else {
    return discoverMovies(filters);
  }
};

export const discoverMovies = async (filters = {}) => {
  const params = new URLSearchParams({ api_key: API_KEY });

  // Year filter
  if (filters.year && filters.year !== 'All') {
    params.append('primary_release_year', filters.year);
  }

  // Genre filter
  const genreMap = {
    'Action': 28, 'Adventure': 12, 'Comedy': 35,
    'Crime': 80, 'Drama': 18
  };
  if (filters.genre && filters.genre !== 'All' && genreMap[filters.genre]) {
    params.append('with_genres', genreMap[filters.genre]);
  }

  // Language filter
  const languageMap = {
    'English': 'en', 'Chinese': 'zh', 'Hindi': 'hi', 'French': 'fr'
  };
  if (filters.language && filters.language !== 'All' && languageMap[filters.language]) {
    params.append('with_original_language', languageMap[filters.language]);
  }

  // Rating filter (minimum rating)
  if (filters.rating && filters.rating !== 'All') {
    params.append('vote_average.gte', filters.rating);
  }

  // Sort order
  const sortMap = {
    'Latest': 'release_date.desc',
    'Older': 'release_date.asc',
    'Feature': 'popularity.desc',
    'Seeds': 'vote_count.desc',
    'Peers': 'vote_average.desc'
  };
  params.append('sort_by', sortMap[filters.orderBy] || 'popularity.desc');

  console.log('Discover API URL:', `${BASE_URL}/discover/movie?${params}`);

  const response = await fetch(`${BASE_URL}/discover/movie?${params}`);
  if (!response.ok) throw new Error("Failed to discover movies");
  const data = await response.json();
  return data.results;
};

// Filter results locally (same as your original)
const filterResults = (movies, filters) => {
  let filteredMovies = [...movies];

  // Year filter (for search results)
  if (filters.year && filters.year !== 'All') {
    filteredMovies = filteredMovies.filter(movie => {
      const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
      return year === parseInt(filters.year);
    });
  }

  // Genre filter (for search results)
  const genreMap = {
    'Action': 28, 'Adventure': 12, 'Comedy': 35,
    'Crime': 80, 'Drama': 18
  };
  if (filters.genre && filters.genre !== 'All' && genreMap[filters.genre]) {
    const genreId = genreMap[filters.genre];
    filteredMovies = filteredMovies.filter(movie =>
      movie.genre_ids && movie.genre_ids.includes(genreId)
    );
  }

  // Language filter (for search results)
  const languageMap = {
    'English': 'en', 'Chinese': 'zh', 'Hindi': 'hi', 'French': 'fr'
  };
  if (filters.language && filters.language !== 'All' && languageMap[filters.language]) {
    const langCode = languageMap[filters.language];
    filteredMovies = filteredMovies.filter(movie =>
      movie.original_language === langCode
    );
  }

  // Rating filter (for search results)
  if (filters.rating && filters.rating !== 'All') {
    filteredMovies = filteredMovies.filter(movie =>
      movie.vote_average >= parseInt(filters.rating)
    );
  }

  // Sort results (for search results)
  const sortMap = {
    'Latest': (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0),
    'Older': (a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0),
    'Feature': (a, b) => b.popularity - a.popularity,
    'Seeds': (a, b) => b.vote_count - a.vote_count,
    'Peers': (a, b) => b.vote_average - a.vote_average
  };
  
  if (filters.orderBy && filters.orderBy !== 'Latest' && sortMap[filters.orderBy]) {
    filteredMovies.sort(sortMap[filters.orderBy]);
  }

  return filteredMovies;
};

// TanStack Query Hooks

// Hook for popular movies
export const usePopularMovies = (options = {}) => {
  return useQuery({
    queryKey: movieQueries.popular(),
    queryFn: getPopularMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Hook for movie details
export const useMovieDetails = (id, options = {}) => {
  return useQuery({
    queryKey: movieQueries.details(id),
    queryFn: () => getMovieDetails(id),
    enabled: !!id, // Only run if id exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    ...options,
  });
};

// Hook for searching movies
export const useSearchMovies = (query, filters = {}, options = {}) => {
  return useQuery({
    queryKey: movieQueries.search(query, filters),
    queryFn: () => searchMovies(query, filters),
    enabled: !!query || Object.keys(filters).length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Hook for discovering movies
export const useDiscoverMovies = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: movieQueries.discover(filters),
    queryFn: () => discoverMovies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// Infinite query hook for paginated results (bonus feature)
export const useInfinitePopularMovies = (options = {}) => {
  return useInfiniteQuery({
    queryKey: [...movieQueries.popular(), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${pageParam}`
      );
      if (!response.ok) throw new Error("Failed to fetch popular movies");
      const data = await response.json();
      return {
        results: data.results,
        nextPage: pageParam < data.total_pages ? pageParam + 1 : undefined,
        totalPages: data.total_pages,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// Utility functions for cache invalidation
export const invalidateMovieQueries = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: movieQueries.all });
};

export const invalidatePopularMovies = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: movieQueries.popular() });
};

export const invalidateMovieDetails = (queryClient, id) => {
  queryClient.invalidateQueries({ queryKey: movieQueries.details(id) });
};