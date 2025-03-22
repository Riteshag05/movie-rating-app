const express = require('express');
const movieController = require('../controllers/movieController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovie);

// Protected routes - admin only
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', movieController.createMovie);
router.patch('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router; 