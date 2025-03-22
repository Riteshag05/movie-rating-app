import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash, FaCheck, FaBan } from 'react-icons/fa';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, refresh]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, you would have a dedicated admin endpoint for reviews
      // For this example, we'll simulate it
      
      // Fetch movie details to get reviews
      const response = await api.get('/api/movies');
      const movies = response.data.data.movies;
      
      // Simulate fetching reviews (in a real app, you'd have a separate endpoint)
      // We're simulating this with randomized data for the example
      const mockReviews = [];
      const reviewsPerPage = 10;
      const totalReviews = 45; // Simulated total
      const startIndex = (currentPage - 1) * reviewsPerPage;
      
      for (let i = 0; i < Math.min(reviewsPerPage, totalReviews - startIndex); i++) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        mockReviews.push({
          id: `review-${startIndex + i + 1}`,
          movieId: randomMovie.id,
          movieTitle: randomMovie.title,
          userId: `user-${Math.floor(Math.random() * 100) + 1}`,
          userName: ['John Doe', 'Jane Smith', 'Alice Brown', 'Bob Wilson', 'Charlie Chen'][Math.floor(Math.random() * 5)],
          rating: Math.floor(Math.random() * 10) + 1,
          comment: [
            'Great movie, loved the storyline!',
            'Disappointing. Expected more from the director.',
            "Masterpiece! One of the best films I've seen.",
            'Decent film but nothing spectacular.',
            'The acting was superb but the plot was predictable.'
          ][Math.floor(Math.random() * 5)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          likeCount: Math.floor(Math.random() * 20)
        });
      }
      
      setReviews(mockReviews);
      setTotalPages(Math.ceil(totalReviews / reviewsPerPage));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // In a real app you would call the API to delete the review
      // For this example, we'll simulate success
      // await api.delete(`/api/reviews/${id}`);
      
      toast.success('Review deleted successfully');
      
      // Update the UI by removing the deleted review
      setReviews(reviews.filter(review => review.id !== id));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReviews();
  };

  return (
    <div>
      <h1 className="mb-4">Manage Reviews</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search reviews by user or movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="submit">
            Search
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSearch('');
              setCurrentPage(1);
              setRefresh(prev => prev + 1);
            }}
          >
            Clear
          </button>
        </div>
      </form>

      {/* Reviews Table */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="alert alert-info">
          No reviews found.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>User</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id}>
                    <td>{review.movieTitle}</td>
                    <td>{review.userName}</td>
                    <td>{review.rating}/10</td>
                    <td>
                      {review.comment.length > 50
                        ? `${review.comment.substring(0, 50)}...`
                        : review.comment}
                    </td>
                    <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td>{review.likeCount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(review.id)}
                        title="Delete Review"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AdminReviews; 