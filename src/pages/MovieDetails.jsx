import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../services/Api";
import { useState } from "react";

const MovieDetails = () => {
  const { id } = useParams();
  const [selectedQuality, setSelectedQuality] = useState("1080p.WEB");
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Fetch movie details
  const {
    data: movie,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["movieDetails", id],
    queryFn: () => getMovieDetails(id),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch movie videos (trailers)
  const {
    data: videosData,
    isLoading: videosLoading,
  } = useQuery({
    queryKey: ["movieVideos", id],
    queryFn: async () => {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=ee28a6b0c12761ad7bf116fbb11a2118`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  // Find the official trailer
  const trailer = videosData?.results?.find(
    video => video.type === "Trailer" && video.site === "YouTube" && video.official
  ) || videosData?.results?.find(
    video => video.type === "Trailer" && video.site === "YouTube"
  );

  const handlePlayTrailer = () => {
    if (trailer) {
      setShowTrailerModal(true);
    }
  };

  const closeTrailerModal = () => {
    setShowTrailerModal(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          <p className="text-white text-xl animate-pulse">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-8 max-w-md">
          <div className="text-red-400 text-6xl mb-4 text-center">⚠️</div>
          <p className="text-red-400 text-center text-lg">{error.message}</p>
        </div>
      </div>
    );
  }

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatBudget = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen">
      {/* Trailer Modal */}
      {showTrailerModal && trailer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={closeTrailerModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* YouTube Video */}
            <div className="relative aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&showinfo=0`}
                title="Movie Trailer"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Trailer Info */}
            <div className="p-6 bg-gray-800/50">
              <h3 className="text-xl font-semibold text-white mb-2">{trailer.name}</h3>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="bg-red-600 text-white px-2 py-1 rounded text-sm">
                  {trailer.type}
                </span>
                <span>{new Date(trailer.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Backdrop */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 70%, rgba(0,0,0,0.95) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button 
            onClick={() => window.history.back()}
            className="mb-6 flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-300 group"
          >
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-lg">Back to Movies</span>
          </button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pt-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-80 h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handlePlayTrailer}
                    disabled={!trailer || videosLoading}
                    className={`backdrop-blur-sm rounded-full p-4 transform scale-90 group-hover:scale-100 transition-all duration-300 ${
                      trailer && !videosLoading
                        ? 'bg-green-600/90 hover:bg-green-500/90 cursor-pointer'
                        : 'bg-gray-600/50 cursor-not-allowed'
                    }`}
                  >
                    {videosLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    ) : trailer ? (
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Information */}
            <div className="flex-1 space-y-6">
              {/* Title and Year */}
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-xl text-green-400 italic font-light">"{movie.tagline}"</p>
                )}
                <div className="flex items-center space-x-4 text-lg text-gray-300">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">
                    {movie.release_date?.split("-")[0]}
                  </span>
                  <span>•</span>
                  <span>{formatRuntime(movie.runtime)}</span>
                  <span>•</span>
                  <span className="uppercase tracking-wider">{movie.original_language}</span>
                </div>
              </div>

              {/* Trailer Button (if available) */}
              {trailer && !videosLoading && (
                <button
                  onClick={handlePlayTrailer}
                  className="flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-600/30"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>
              )}

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 bg-gray-700/50 backdrop-blur-sm rounded-full text-sm font-medium border border-gray-600/30 hover:bg-gray-600/50 transition-colors duration-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(movie.vote_average / 2) ? 'text-yellow-400' : 'text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-xl font-semibold">{movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>{movie.vote_count?.toLocaleString()} votes</span>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">Overview</h3>
                <p className="text-gray-300 leading-relaxed text-lg max-w-3xl">
                  {movie.overview}
                </p>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30">
                <div>
                  <p className="text-gray-400 text-sm">Budget</p>
                  <p className="text-white font-semibold">{formatBudget(movie.budget)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <p className="text-white font-semibold">{formatBudget(movie.revenue)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className="text-white font-semibold">{movie.status || 'Released'}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Language</p>
                  <p className="text-white font-semibold">{movie.spoken_languages?.[0]?.english_name || 'English'}</p>
                </div>
              </div>

              {/* Download Section */}
              <div className="space-y-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-semibold">Download Options</h3>
                <div className="flex flex-wrap gap-3">
                  {["720p.WEB", "1080p.WEB", "1080p.BluRay", "4K.UHD"].map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setSelectedQuality(quality)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        selectedQuality === quality
                          ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 rounded-xl flex items-center justify-center space-x-3 font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-600/30">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download {selectedQuality}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="bg-black/50 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Similar Movies 
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[
              { 
                src: "https://cdn.shopify.com/s/files/1/0057/3728/3618/files/scan004_6f77ec60-fb85-495f-9a70-719695e027fa_500x749.jpg?v=1697205691",
                title: "The Matrix"
              },
              { 
                src: "https://cdn.shopify.com/s/files/1/0057/3728/3618/files/darkknight.building.24x36_20e90057-f673-4cc3-9ce7-7b0d3eeb7d83_500x749.jpg?v=1707491191",
                title: "The Dark Knight"
              },
              { 
                src: "https://cdn.shopify.com/s/files/1/0057/3728/3618/products/6cd691e19fffbe57b353cb120deaeb8f_8489d7bf-24ba-4848-9d0f-11f20cb35025_500x749.jpg?v=1573613877",
                title: "Joker"
              },
              { 
                src: "https://www.movieposters.com/cdn/shop/files/ItemR85879_jpg_240x360_crop_center.progressive.jpg?v=1741204835",
                title: "Inception"
              },
              
            ].map((movie, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg transform group-hover:scale-105 transition-all duration-500">
                  <img 
                    src={movie.src}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:brightness-75 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm">{movie.title}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-gray-300 text-xs">8.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;