const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All review routes are protected
router.use(protect);

// Create review
router.post('/', reviewController.createReview);

// Update review
router.patch('/:id', reviewController.updateReview);

// Delete review
router.delete('/:id', reviewController.deleteReview);

// Like/unlike review
router.post('/:reviewId/like', reviewController.likeReview);
router.delete('/:reviewId/like', reviewController.unlikeReview);

module.exports = router; 