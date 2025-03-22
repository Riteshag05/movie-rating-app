import React, { useState, useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    rating: '',
    comment: ''
  };

  const validationSchema = Yup.object({
    rating: Yup.number()
      .required('Rating is required')
      .min(1, 'Rating must be at least 1')
      .max(10, 'Rating must be at most 10'),
    comment: Yup.string()
      .required('Review comment is required')
      .min(10, 'Comment must be at least 10 characters')
      .max(500, 'Comment must be at most 500 characters')
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to post a review');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/api/reviews', {
        movieId,
        rating: parseInt(values.rating),
        comment: values.comment
      });

      toast.success('Review submitted successfully!');
      resetForm();
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="alert alert-info">
        Please <a href="/login">login</a> to submit a review
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">Write a Review</h5>
      </div>
      <div className="card-body">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">
                  Rating (1-10)
                </label>
                <Field
                  type="number"
                  id="rating"
                  name="rating"
                  min="1"
                  max="10"
                  className={`form-control ${
                    errors.rating && touched.rating ? 'is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  name="rating"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Your Review
                </label>
                <Field
                  as="textarea"
                  id="comment"
                  name="comment"
                  rows="4"
                  className={`form-control ${
                    errors.comment && touched.comment ? 'is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  name="comment"
                  component="div"
                  className="invalid-feedback"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReviewForm; 