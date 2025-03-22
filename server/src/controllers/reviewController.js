const { Review, Movie, Like, User, sequelize } = require('../models');

// Create a new review
exports.createReview = async (req, res, next) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userId = req.user.id;
    
    // Check if movie exists
    const movie = await Movie.findByPk(movieId);
    
    if (!movie) {
      return res.status(404).json({
        status: 'fail',
        message: 'Movie not found'
      });
    }
    
    // Check if user already reviewed this movie
    const existingReview = await Review.findOne({
      where: {
        MovieId: movieId,
        UserId: userId
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already reviewed this movie'
      });
    }
    
    // Create new review
    const newReview = await Review.create({
      rating,
      comment,
      MovieId: movieId,
      UserId: userId
    });
    
    // Update movie's average rating and review count
    await updateMovieRatingStats(movieId);
    
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Update a review
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }
    
    // Check if the user is the owner of the review
    if (review.UserId !== userId) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only update your own reviews'
      });
    }
    
    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    
    await review.save();
    
    // Update movie's average rating
    await updateMovieRatingStats(review.MovieId);
    
    res.status(200).json({
      status: 'success',
      data: {
        review
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Delete a review
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }
    
    // Check if the user is the owner of the review or an admin
    if (review.UserId !== userId && !isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'You can only delete your own reviews'
      });
    }
    
    const movieId = review.MovieId;
    
    await review.destroy();
    
    // Update movie's average rating
    await updateMovieRatingStats(movieId);
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Like a review
exports.likeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }
    
    // Check if user already liked this review
    const existingLike = await Like.findOne({
      where: {
        ReviewId: reviewId,
        UserId: userId
      }
    });
    
    if (existingLike) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already liked this review'
      });
    }
    
    // Create like
    await Like.create({
      ReviewId: reviewId,
      UserId: userId
    });
    
    // Update review like count
    review.likeCount += 1;
    await review.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Review liked successfully',
        likeCount: review.likeCount
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Unlike a review
exports.unlikeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    
    // Check if review exists
    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: 'Review not found'
      });
    }
    
    // Check if like exists
    const like = await Like.findOne({
      where: {
        ReviewId: reviewId,
        UserId: userId
      }
    });
    
    if (!like) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have not liked this review'
      });
    }
    
    // Delete like
    await like.destroy();
    
    // Update review like count
    review.likeCount = Math.max(0, review.likeCount - 1);
    await review.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Review unliked successfully',
        likeCount: review.likeCount
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Helper function to update movie's average rating and review count
async function updateMovieRatingStats(movieId) {
  const result = await Review.findAll({
    where: { MovieId: movieId },
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'reviewCount']
    ],
    raw: true
  });
  
  const movie = await Movie.findByPk(movieId);
  
  if (movie) {
    movie.averageRating = result[0].averageRating || 0;
    movie.reviewCount = result[0].reviewCount || 0;
    await movie.save();
  }
} 