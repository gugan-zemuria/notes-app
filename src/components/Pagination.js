'use client';

import styles from './Pagination.module.css';

export default function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, totalCount, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Showing {Math.min((currentPage - 1) * 12 + 1, totalCount)} - {Math.min(currentPage * 12, totalCount)} of {totalCount} notes
      </div>
      
      <div className={styles.pagination}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`${styles.pageButton} ${styles.navButton}`}
        >
          ← Previous
        </button>

        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`${styles.pageButton} ${styles.navButton}`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}