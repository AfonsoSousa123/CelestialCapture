import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => {
  const { t } = useLocale();
  return (
    <div className="w-full">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('search.photoPlaceholder')}
          className="w-full pl-10 pr-4 py-3 bg-gray-900/70 backdrop-blur-sm text-white rounded-lg border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors duration-300 shadow-md"
          aria-label={t('search.photoPlaceholder')}
        />
      </div>
    </div>
  );
};

export default SearchBar;
