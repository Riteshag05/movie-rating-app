import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
        className="card-img-top"
        alt={movie.title}
        style={{ height: '300px', objectFit: 'cover' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text text-muted">
          {movie.releaseYear} | {movie.genre}
        </p>
        <div className="mb-2 d-flex align-items-center">
          <FaStar className="text-warning me-1" />
          <span>
            {movie.averageRating.toFixed(1)} ({movie.reviewCount} reviews)
          </span>
        </div>
        <p className="card-text flex-grow-1">
          {movie.description.length > 100
            ? `${movie.description.substring(0, 100)}...`
            : movie.description}
        </p>
        <Link to={`/movies/${movie.id}`} className="btn btn-primary mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard; 