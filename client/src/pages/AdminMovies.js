import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, refresh]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      
      if (search) params.append('search', search);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie? This will also delete all associated reviews and cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/api/movies/${id}`);
      toast.success('Movie deleted successfully');
      setRefresh(prev => prev + 1);
    } catch (error) {
      toast.error('Failed to delete movie');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    releaseYear: Yup.number()
      .required('Release year is required')
      .integer('Must be a whole number')
      .min(1900, 'Must be after 1900')
      .max(new Date().getFullYear() + 5, `Must be before ${new Date().getFullYear() + 5}`),
    director: Yup.string().required('Director is required'),
    genre: Yup.string().required('Genre is required'),
    imageUrl: Yup.string().url('Must be a valid URL')
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (editMovie) {
        // Update existing movie
        await api.patch(`/api/movies/${editMovie.id}`, values);
        toast.success('Movie updated successfully');
        setEditMovie(null);
      } else {
        // Create new movie
        await api.post('/api/movies', values);
        toast.success('Movie created successfully');
        setIsCreating(false);
      }
      
      resetForm();
      setRefresh(prev => prev + 1);
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Movies</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditMovie(null);
            setIsCreating(!isCreating);
          }}
        >
          {isCreating ? 'Cancel' : <><FaPlus className="me-2" /> Add Movie</>}
        </button>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search movies..."
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

      {/* Movie Form */}
      {(isCreating || editMovie) && (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5 className="mb-0">{editMovie ? 'Edit Movie' : 'Add New Movie'}</h5>
          </div>
          <div className="card-body">
            <Formik
              initialValues={
                editMovie
                  ? {
                      title: editMovie.title,
                      description: editMovie.description,
                      releaseYear: editMovie.releaseYear,
                      director: editMovie.director,
                      genre: editMovie.genre,
                      imageUrl: editMovie.imageUrl || ''
                    }
                  : {
                      title: '',
                      description: '',
                      releaseYear: new Date().getFullYear(),
                      director: '',
                      genre: '',
                      imageUrl: ''
                    }
              }
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <Field
                        type="text"
                        id="title"
                        name="title"
                        className={`form-control ${
                          errors.title && touched.title ? 'is-invalid' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="releaseYear" className="form-label">
                        Release Year
                      </label>
                      <Field
                        type="number"
                        id="releaseYear"
                        name="releaseYear"
                        min="1900"
                        max={new Date().getFullYear() + 5}
                        className={`form-control ${
                          errors.releaseYear && touched.releaseYear ? 'is-invalid' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="releaseYear"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="director" className="form-label">
                        Director
                      </label>
                      <Field
                        type="text"
                        id="director"
                        name="director"
                        className={`form-control ${
                          errors.director && touched.director ? 'is-invalid' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="director"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="genre" className="form-label">
                        Genre
                      </label>
                      <Field
                        type="text"
                        id="genre"
                        name="genre"
                        className={`form-control ${
                          errors.genre && touched.genre ? 'is-invalid' : ''
                        }`}
                      />
                      <ErrorMessage
                        name="genre"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      Image URL
                    </label>
                    <Field
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      className={`form-control ${
                        errors.imageUrl && touched.imageUrl ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="imageUrl"
                      component="div"
                      className="invalid-feedback"
                    />
                    <small className="form-text text-muted">
                      Enter a valid URL for the movie poster image
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows="4"
                      className={`form-control ${
                        errors.description && touched.description ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setIsCreating(false);
                        setEditMovie(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : editMovie ? 'Update Movie' : 'Add Movie'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Movies Table */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : movies.length === 0 ? (
        <div className="alert alert-info">
          No movies found. Add your first movie using the button above.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Director</th>
                  <th>Genre</th>
                  <th>Rating</th>
                  <th>Reviews</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map(movie => (
                  <tr key={movie.id}>
                    <td>{movie.title}</td>
                    <td>{movie.releaseYear}</td>
                    <td>{movie.director}</td>
                    <td>{movie.genre}</td>
                    <td>{movie.averageRating.toFixed(1)}</td>
                    <td>{movie.reviewCount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => {
                          setIsCreating(false);
                          setEditMovie(movie);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(movie.id)}
                      >
                        <FaTrash /> Delete
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

export default AdminMovies; 