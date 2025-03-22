import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaCalendarAlt, FaFilm, FaUserTie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../services/api';
import Spinner from '../components/Spinner';
import ReviewForm from '../components/ReviewForm';
import ReviewItem from '../components/ReviewItem';
import Pagination from '../components/Pagination';
import { AuthContext } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('createdAt:DESC');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id, currentPage, sortOption]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse sort option
      const [sortBy, sortOrder] = sortOption.split(':');
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 5);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await api.get(`/api/movies/${id}?${params.toString()}`);
      
      setMovie(response.data.data.movie);
      setReviews(response.data.data.reviews.results);
      setTotalPages(response.data.data.reviews.pagination.totalPages);
      
      // Check if user has already reviewed this movie
      // In a real app, this would be handled by the backend
      // For now, we'll just check the reviews array
      if (isAuthenticated) {
        const userReviewed = response.data.data.reviews.results.some(
          review => review.UserId === localStorage.getItem('userId')
        );
        setHasReviewed(userReviewed);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setError('Failed to fetch movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setHasReviewed(true);
    fetchMovieDetails(); // Refresh reviews after adding a new one
  };

  const handleReviewUpdated = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
  };

  const handleReviewDeleted = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    setHasReviewed(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, document.getElementById('reviews-section').offsetTop - 100);
  };

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return <div className="alert alert-warning">Movie not found</div>;

  return (
    <div>
      <div className="row mb-5">
        {/* Movie Poster */}
        <div className="col-md-4 mb-4 mb-md-0">
          <img
            src={movie.imageUrl || 'https://via.placeholder.com/500x750?text=No+Image'}
            alt={movie.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '600px', width: '100%', objectFit: 'cover' }}
          />
        </div>
        
        {/* Movie Details */}
        <div className="col-md-8">
          <h1 className="mb-3">{movie.title}</h1>
          
          <div className="d-flex flex-wrap align-items-center mb-3">
            <div className="me-4 mb-2">
              <FaStar className="text-warning me-1" />
              <span className="fw-bold">{movie.averageRating.toFixed(1)}/10</span>
              <span className="text-muted ms-1">
                ({movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <div className="me-4 mb-2">
              <FaCalendarAlt className="me-1 text-primary" />
              <span>{movie.releaseYear}</span>
            </div>
            
            <div className="me-4 mb-2">
              <FaFilm className="me-1 text-primary" />
              <span>{movie.genre}</span>
            </div>
            
            <div className="mb-2">
              <FaUserTie className="me-1 text-primary" />
              <span>Director: {movie.director}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h5>Synopsis</h5>
            <p className="lead">{movie.description}</p>
          </div>
          
          <Link to="/" className="btn btn-outline-secondary">
            Back to Movies
          </Link>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div id="reviews-section" className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Reviews</h2>
          
          <select
            className="form-select w-auto"
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="createdAt:DESC">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="rating:DESC">Highest Rating</option>
            <option value="rating:ASC">Lowest Rating</option>
          </select>
        </div>
        
        {/* Review Form */}
        {!hasReviewed && (
          <ReviewForm 
            movieId={id} 
            onReviewAdded={handleReviewAdded} 
          />
        )}
        
        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="alert alert-info">
            No reviews yet. Be the first to review this movie!
          </div>
        ) : (
          <>
            {reviews.map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                onReviewUpdated={handleReviewUpdated}
                onReviewDeleted={handleReviewDeleted}
              />
            ))}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetails; 