import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate page numbers array
  const pageNumbers = [];
  
  // Logic to determine which page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);
  
  // Adjust when near the beginning or end
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - 4);
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        {/* Previous button */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        
        {/* First page */}
        {startPage > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}
        
        {/* Page numbers */}
        {pageNumbers.map(number => (
          <li 
            key={number} 
            className={`page-item ${currentPage === number ? 'active' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}
        
        {/* Last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        
        {/* Next button */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination; 