import React from 'react';
import Button from './Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  className = '' 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
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

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="text-sm text-gray-700">
        Hiển thị {startItem} đến {endItem} trong tổng số {totalItems} kết quả
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || !onPageChange}
        >
          Trước
        </Button>
        
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onPageChange && onPageChange(page)}
                disabled={!onPageChange}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || !onPageChange}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default Pagination; 