const { Movie, Review, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get all movies with pagination and filtering
exports.getAllMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Search and filter options
    const search = req.query.search || '';
    const genre = req.query.genre || '';
    const year = req.query.year || '';
    
    // Build filter conditions
    const whereConditions = {};
    
    if (search) {
      whereConditions.title = { [Op.iLike]: `%${search}%` };
    }
    
    if (genre) {
      whereConditions.genre = { [Op.iLike]: `%${genre}%` };
    }
    
    if (year) {
      whereConditions.releaseYear = year;
    }
    
    // Get movies with total count
    const { count, rows: movies } = await Movie.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      status: 'success',
      results: movies.length,
      data: {
        movies,
        pagination: {
          currentPage: page,
          totalPages,
          totalResults: count,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a single movie by ID with reviews
exports.getMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const movie = await Movie.findByPk(id);
    
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }
    
    // Get reviews for the movie with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'DESC';
    
    let order;
    
    if (sortBy === 'popular') {
      order = [['likeCount', 'DESC'], ['createdAt', 'DESC']];
    } else {
      order = [[sortBy, sortOrder]];
    }
    
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { MovieId: id },
      include: [
        {
          model: User,
          attributes: ['id', 'name']
        }
      ],
      limit,
      offset,
      order
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
      status: 'success',
      data: {
        movie,
        reviews: {
          results: reviews,
          pagination: {
            currentPage: page,
            totalPages,
            totalResults: count,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Create a new movie (admin only)
exports.createMovie = async (req, res, next) => {
  try {
    const { title, description, releaseYear, director, genre, imageUrl } = req.body;
    
    // Basic validation
    if (!title || !description || !releaseYear || !director || !genre) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields'
      });
    }
    
    const newMovie = await Movie.create({
      title,
      description,
      releaseYear,
      director,
      genre,
      imageUrl
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        movie: newMovie
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update a movie (admin only)
exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, releaseYear, director, genre, imageUrl } = req.body;
    
    const movie = await Movie.findByPk(id);
    
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }
    
    // Update movie fields
    if (title) movie.title = title;
    if (description) movie.description = description;
    if (releaseYear) movie.releaseYear = releaseYear;
    if (director) movie.director = director;
    if (genre) movie.genre = genre;
    if (imageUrl) movie.imageUrl = imageUrl;
    
    await movie.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        movie
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a movie (admin only)
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const movie = await Movie.findByPk(id);
    
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }
    
    await movie.destroy();
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}; 