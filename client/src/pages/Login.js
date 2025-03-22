import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError('');
    const success = await login(values.email, values.password);
    
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
            <h2 className="text-center mb-4">Login</h2>
            
            {loginError && (
              <div className="alert alert-danger" role="alert">
                {loginError}
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
                  
                  <div className="mb-4">
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
                  
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>
            
            <div className="mt-4 text-center">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 