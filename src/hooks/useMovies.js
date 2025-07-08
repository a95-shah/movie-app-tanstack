import { useQuery } from "@tanstack/react-query";
import {
  getPopularMovies,
  searchMovies,
  discoverMovies,
  getMovieDetails
} from "../services/Api";

export const usePopularMovies = () =>
  useQuery({
    queryKey: ["popularMovies"],
    queryFn: getPopularMovies,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

export const useMovieDetails = (id) =>
  useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => getMovieDetails(id),
    enabled: !!id, // ensures it only fetches if id exists
    staleTime: 1000 * 60 * 10,
  });

export const useSearchMovies = (query, filters) =>
  useQuery({
    queryKey: ["searchMovies", query, filters],
    queryFn: () => searchMovies(query, filters),
    enabled: !!query,
  });

export const useDiscoverMovies = (filters) =>
  useQuery({
    queryKey: ["discoverMovies", filters],
    queryFn: () => discoverMovies(filters),
    enabled: !filters.query, // only when no search query
  });

// Updated useMovies hook
export const useMovies = (searchQuery, filters) => {
  // Check if any filters are applied (not 'All')
  const hasFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'orderBy') return false; // orderBy is always applied
    return value !== 'All';
  });

  return useQuery({
    queryKey: ['movies', searchQuery, filters],
    queryFn: async () => {
      // If there's a search query, use searchMovies
      if (searchQuery?.trim()) {
        return await searchMovies(searchQuery, filters);
      }
      // If there are filters applied but no search query, use discoverMovies
      else if (hasFilters) {
        return await discoverMovies(filters);
      }
      // Otherwise, get popular movies
      else {
        return await getPopularMovies();
      }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};