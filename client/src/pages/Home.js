import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import api from '../services/api';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, genre, year]);

  useEffect(() => {
    // Extract unique genres and years for filters
    if (movies.length > 0) {
      const uniqueGenres = [...new Set(movies.map(movie => movie.genre))];
      setGenres(uniqueGenres);

      const uniqueYears = [...new Set(movies.map(movie => movie.releaseYear))];
      setYears(uniqueYears.sort((a, b) => b - a)); // Sort years in descending order
    }
  }, [movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 12);
      
      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (year) params.append('year', year);

      const response = await api.get(`/api/movies?${params.toString()}`);
      
      setMovies(response.data.data.movies);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchMovies();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top when changing page
  };

  const handleReset = () => {
    setSearch('');
    setGenre('');
    setYear('');
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="bg-light p-4 mb-4 rounded">
        <h1 className="text-center mb-4">Discover Movies</h1>
        
        <form onSubmit={handleSearch} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search movies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  <FaSearch className="me-1" /> Search
                </button>
              </div>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={genre}
                onChange={(e) => {
                  setGenre(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <select
                className="form-select"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Years</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : movies.length === 0 ? (
        <div className="alert alert-info">
          No movies found. Try different search criteria.
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 mb-4">
            {movies.map(movie => (
              <div key={movie.id} className="col">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Home; 