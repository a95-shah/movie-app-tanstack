import { useLocation } from "react-router-dom";

const MovieDetails = () => {
//   const { id } = useParams();
  const location = useLocation();
  const { movie } = location.state || {};

  if (!movie) return <p className="text-center text-lg text-red-500">Movie not found.</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left: Movie Poster */}
        <div className="w-full md:w-1/3">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="w-full rounded-lg shadow-lg"
          />
          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center">
            <span className="mr-2">⬇</span> Download
          </button>
        </div>

        {/* Right: Movie Details */}
        <div className="w-full md:w-2/3">
          <h1 className="text-4xl font-bold">{movie.title} </h1>
          <p className="text-green-400 text-lg">{movie.release_date?.split("-")[0]} | {movie.original_language?.toUpperCase()}</p>
          <p className="mt-2 text-lg text-gray-300">{movie.genres?.map(g => g.name).join(", ")}</p>
          <p className="mt-4 text-left">{movie.overview}</p>

          {/* Ratings & Likes */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-yellow-400">
              ⭐ {movie.vote_average}/10
            </div>
            <div className="flex items-center text-green-400">
              ❤️ {movie.vote_count}
            </div>
            <div className="bg-yellow-500 text-black px-2 py-1 rounded-md text-sm font-semibold">IMDb</div>
          </div>

          {/* Available Formats */}
          <div className="mt-4">
            <p className="text-left mb-5  text-gray-400">Available in:</p>
            <div className="flex gap-2">
              <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md">720p.WEB</button>
              <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md">1080p.WEB</button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold">Similar Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {/* Placeholder images for similar movies */}
          <div className="bg-gray-800 p-2 rounded-lg">
            <img src="https://cdn.shopify.com/s/files/1/0057/3728/3618/files/scan004_6f77ec60-fb85-495f-9a70-719695e027fa_500x749.jpg?v=1697205691" alt="Similar Movie" className="rounded-lg" />
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <img src="https://cdn.shopify.com/s/files/1/0057/3728/3618/files/darkknight.building.24x36_20e90057-f673-4cc3-9ce7-7b0d3eeb7d83_500x749.jpg?v=1707491191" alt="Similar Movie" className="rounded-lg" />
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <img src="https://cdn.shopify.com/s/files/1/0057/3728/3618/products/6cd691e19fffbe57b353cb120deaeb8f_8489d7bf-24ba-4848-9d0f-11f20cb35025_500x749.jpg?v=1573613877" alt="Similar Movie" className="rounded-lg" />
          </div>
          <div className="bg-gray-800 p-2 rounded-lg">
            <img src="https://www.movieposters.com/cdn/shop/files/ItemR85879_jpg_240x360_crop_center.progressive.jpg?v=1741204835" alt="Similar Movie" className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
