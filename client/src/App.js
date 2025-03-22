import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import AdminDashboard from './pages/AdminDashboard';
import AdminMovies from './pages/AdminMovies';
import AdminReviews from './pages/AdminReviews';
import NotFound from './pages/NotFound';

// Auth guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/movies" 
              element={
                <AdminRoute>
                  <AdminMovies />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/reviews" 
              element={
                <AdminRoute>
                  <AdminReviews />
                </AdminRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App; 