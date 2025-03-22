import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState('');

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setRegisterError('');
    const success = await register(values.name, values.email, values.password);
    
    if (success) {
      navigate('/');
    }
    
    setSubmitting(false);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow">
          <div className="card-body p-5">
            <h2 className="text-center mb-4">Create an Account</h2>
            
            {registerError && (
              <div className="alert alert-danger" role="alert">
                {registerError}
              </div>
            )}
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className={`form-control ${
                        errors.name && touched.name ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className={`form-control ${
                        errors.email && touched.email ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className={`form-control ${
                        errors.password && touched.password ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`form-control ${
                        errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-4 text-center">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 