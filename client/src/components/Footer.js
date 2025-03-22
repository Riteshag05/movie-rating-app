import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} MovieRater. All rights reserved.
        </p>
        <p className="mb-0 small text-muted">
          Made with <i className="bi bi-heart-fill text-danger"></i> for movie lovers
        </p>
      </div>
    </footer>
  );
};

export default Footer; 