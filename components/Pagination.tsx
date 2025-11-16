import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useLocale();

  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    const pageRange = 1; // Number of pages to show around the current page
    const pagesToShowMobile = 3;
    const pagesToShowDesktop = 5;

    const isMobile = window.innerWidth < 768;
    const pagesToShow = isMobile ? pagesToShowMobile : pagesToShowDesktop;

    if (totalPages <= pagesToShow + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);

      // Show ellipsis or second page
      if (currentPage > pageRange + 2) {
        pageNumbers.push('...');
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - pageRange);
      const endPage = Math.min(totalPages - 1, currentPage + pageRange);

      for (let i = startPage; i <= endPage; i++) {
        const lastPage = pageNumbers[pageNumbers.length - 1];
        if (typeof lastPage === 'number' && i - 1 > lastPage) {
          pageNumbers.push('...');
        }
        pageNumbers.push(i);
      }

      // Show ellipsis or second to last page
      if (currentPage < totalPages - pageRange - 1) {
        pageNumbers.push('...');
      }

      // Always show the last page
      pageNumbers.push(totalPages);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const prevButtonClass = `flex items-center gap-2 px-3 md:px-4 h-10 md:h-12 text-sm font-bold rounded-lg transition-colors duration-300 ${
    currentPage === 1 
      ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
      : 'bg-gray-800/50 text-gray-300 hover:bg-purple-600/50'
  }`;

  const nextButtonClass = `flex items-center gap-2 px-3 md:px-4 h-10 md:h-12 text-sm font-bold rounded-lg transition-colors duration-300 ${
    currentPage === totalPages 
      ? 'bg-gray-800/30 text-gray-600 cursor-not-allowed' 
      : 'bg-gray-800/50 text-gray-300 hover:bg-purple-600/50'
  }`;

  return (
    <nav aria-label="Photo gallery pagination" className="flex items-center justify-center gap-1 md:gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={prevButtonClass}
        aria-label={t('pagination.previous')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="hidden sm:inline">{t('pagination.previous')}</span>
      </button>

      {pageNumbers.map((page, index) => {
        if (typeof page === 'number') {
          const isActive = currentPage === page;
          const buttonClass = `w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-sm font-bold rounded-lg transition-colors duration-300 ${
            isActive
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 cursor-default'
              : 'bg-gray-800/50 text-gray-300 hover:bg-purple-600/50'
          }`;
          return (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={buttonClass}
              aria-current={isActive ? 'page' : undefined}
              aria-label={t('pagination.goToPage', { page })}
            >
              {page}
            </button>
          );
        } else {
          return (
            <span
              key={index}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-sm font-bold text-gray-500"
              aria-hidden="true"
            >
              {page}
            </span>
          );
        }
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={nextButtonClass}
        aria-label={t('pagination.next')}
      >
        <span className="hidden sm:inline">{t('pagination.next')}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;