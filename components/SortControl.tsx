import React from 'react';
import { SortOption } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface SortControlProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortControl: React.FC<SortControlProps> = ({ activeSort, onSortChange }) => {
  const { t } = useLocale();
  return (
    <div className="w-full">
      <label htmlFor="sort-select" className="sr-only">{t('sort.label')}</label>
      <div className="relative">
        <select
          id="sort-select"
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full appearance-none pl-4 pr-10 py-3 bg-gray-900/70 backdrop-blur-sm text-white rounded-lg border-2 border-transparent focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors duration-300 shadow-md cursor-pointer"
        >
          <option value={SortOption.NEWEST}>{t('sort.newest')}</option>
          <option value={SortOption.OLDEST}>{t('sort.oldest')}</option>
          <option value={SortOption.RATING}>{t('sort.rating')}</option>
          <option value={SortOption.TITLE}>{t('sort.title')}</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortControl;
