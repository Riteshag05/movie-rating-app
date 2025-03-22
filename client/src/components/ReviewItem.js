import React, { useState, useContext } from 'react';
import { FaStar, FaThumbsUp, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReviewItem = ({ review, onReviewUpdated, onReviewDeleted }) => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [isLiked, setIsLiked] = useState(false); // In a real app, this would be fetched from API
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    rating: review.rating,
    comment: review.comment
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = currentUser && currentUser.id === review.UserId;
  const formattedDate = new Date(review.createdAt).toLocaleDateString();

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to like reviews');
      return;
    }

    try {
      setIsSubmitting(true);
      if (!isLiked) {
        await api.post(`/api/reviews/${review.id}/like`);
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
        toast.success('Review liked!');
      } else {
        await api.delete(`/api/reviews/${review.id}/like`);
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
        toast.success('Review unliked!');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.delete(`/api/reviews/${review.id}`);
      toast.success('Review deleted successfully');
      if (onReviewDeleted) onReviewDeleted(review.id);
    } catch (error) {
      toast.error('Failed to delete review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await api.patch(`/api/reviews/${review.id}`, editData);
      
      // Update the review with edited data
      const updatedReview = {
        ...review,
        ...editData
      };
      
      setIsEditing(false);
      toast.success('Review updated successfully');
      
      if (onReviewUpdated) onReviewUpdated(updatedReview);
    } catch (error) {
      toast.error('Failed to update review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 className="card-title mb-0">
              {review.User?.name || 'Anonymous'}
            </h5>
            <div className="text-muted small">
              <FaStar className="text-warning me-1" />
              <span>{review.rating}/10</span>
              <span className="mx-2">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
          
          {isOwner && !isEditing && (
            <div>
              <button 
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => setIsEditing(true)}
                disabled={isSubmitting}
              >
                <FaEdit /> Edit
              </button>
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmitEdit}>
            <div className="mb-3">
              <label htmlFor="rating" className="form-label">
                Rating (1-10)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                min="1"
                max="10"
                value={editData.rating}
                onChange={handleEditChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">
                Your Review
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                value={editData.comment}
                onChange={handleEditChange}
                className="form-control"
                required
              ></textarea>
            </div>
            
            <div>
              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="card-text">{review.comment}</p>
            
            <div className="d-flex align-items-center">
              <button
                className={`btn btn-sm ${isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={handleLike}
                disabled={isSubmitting || !isAuthenticated}
              >
                <FaThumbsUp className="me-1" />
                {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem; 