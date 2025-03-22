import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated && isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute; 