import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_KEY = 'eb0f2b704cb44658d38aff9391f75471';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!movie) return <p>No movie details found.</p>;

  return (
    <div className="movie-details pattern min-h-screen flex items-center justify-center p-6">
      <div className="wrapper bg-gray-900 bg-opacity-80 rounded-2xl p-8 max-w-5xl w-full text-white flex flex-col md:flex-row gap-8 shadow-lg">
        <div className="flex-shrink-0">
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
            alt={movie.title}
            className="rounded-xl w-48 md:w-64"
          />
        </div>
        <div className="flex flex-col justify-start">
          <Link to="/" className="back-link mb-4 text-indigo-400 hover:text-indigo-600 transition-colors">← Back to movies</Link>
          <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
          <p className="mb-2"><strong>Release Date:</strong> {movie.release_date}</p>
          <p className="mb-2"><strong>Rating:</strong> {movie.vote_average}</p>
          <p className="mb-4"><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Original Language:</strong> {movie.original_language}</p>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
