import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 