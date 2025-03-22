import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilm, FaStar, FaUsers, FaChartLine } from 'react-icons/fa';
import api from '../services/api';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalReviews: 0,
    totalUsers: 0,
    averageRating: 0,
  });
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real application, you would have an endpoint for admin dashboard data
        // For this example, we'll fake it with multiple requests

        // Fetch movies to get total count and recent ones
        const moviesResponse = await api.get('/api/movies?limit=5');
        const movies = moviesResponse.data.data.movies;
        const totalMovies = moviesResponse.data.data.pagination.totalResults;
        
        // Fetch recent reviews (in a real app, this would be a separate endpoint)
        // We're simulating this for the example
        const reviewsData = {
          totalReviews: 42, // Simulated data
          averageRating: 7.8,
          recentReviews: [
            { id: '1', movieTitle: 'The Shawshank Redemption', rating: 9, userName: 'John Doe', createdAt: '2023-05-15T10:30:00Z' },
            { id: '2', movieTitle: 'The Godfather', rating: 10, userName: 'Jane Smith', createdAt: '2023-05-14T14:22:00Z' },
            { id: '3', movieTitle: 'The Dark Knight', rating: 8, userName: 'Bob Johnson', createdAt: '2023-05-13T09:15:00Z' },
            { id: '4', movieTitle: 'Pulp Fiction', rating: 9, userName: 'Alice Brown', createdAt: '2023-05-12T18:45:00Z' },
            { id: '5', movieTitle: 'Forrest Gump', rating: 7, userName: 'Charlie Wilson', createdAt: '2023-05-11T11:10:00Z' },
          ]
        };
        
        // Simulated user count
        const totalUsers = 124;
        
        // Set state with the fetched data
        setStats({
          totalMovies,
          totalReviews: reviewsData.totalReviews,
          totalUsers,
          averageRating: reviewsData.averageRating,
        });
        
        setRecentMovies(movies);
        setRecentReviews(reviewsData.recentReviews);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Movies</h5>
                  <h2 className="mb-0">{stats.totalMovies}</h2>
                </div>
                <FaFilm size={40} />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/movies" className="text-white text-decoration-none">
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Reviews</h5>
                  <h2 className="mb-0">{stats.totalReviews}</h2>
                </div>
                <FaStar size={40} />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <Link to="/admin/reviews" className="text-white text-decoration-none">
                View All <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Users</h5>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <FaUsers size={40} />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <span className="text-white">Registered Users</span>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-3 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Avg. Rating</h5>
                  <h2 className="mb-0">{stats.averageRating.toFixed(1)}/10</h2>
                </div>
                <FaChartLine size={40} />
              </div>
            </div>
            <div className="card-footer bg-transparent border-0">
              <span className="text-white">Overall Average</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Movies */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card h-100">
            <div className="card-header bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recently Added Movies</h5>
              <Link to="/admin/movies" className="btn btn-sm btn-primary">
                Add New Movie
              </Link>
            </div>
            <div className="card-body">
              {recentMovies.length === 0 ? (
                <p className="text-muted">No movies found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Year</th>
                        <th>Rating</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMovies.map(movie => (
                        <tr key={movie.id}>
                          <td>{movie.title}</td>
                          <td>{movie.releaseYear}</td>
                          <td>{movie.averageRating.toFixed(1)}</td>
                          <td>
                            <Link to={`/movies/${movie.id}`} className="btn btn-sm btn-outline-primary me-2">
                              View
                            </Link>
                            <Link to={`/admin/movies?edit=${movie.id}`} className="btn btn-sm btn-outline-secondary">
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Recent Reviews */}
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">Recent Reviews</h5>
            </div>
            <div className="card-body">
              {recentReviews.length === 0 ? (
                <p className="text-muted">No reviews found</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Movie</th>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReviews.map(review => (
                        <tr key={review.id}>
                          <td>{review.movieTitle}</td>
                          <td>{review.userName}</td>
                          <td>{review.rating}</td>
                          <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 