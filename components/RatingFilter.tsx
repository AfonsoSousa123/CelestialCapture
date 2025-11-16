import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface RatingFilterProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarIcon: React.FC<{ filled: boolean; isPlaceholder?: boolean }> = ({ filled, isPlaceholder }) => (
  <svg
    className={`w-5 h-5 transition-colors duration-200 ${
      filled ? 'text-yellow-400' : isPlaceholder ? 'text-gray-700' : 'text-gray-500'
    }`}
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RatingFilter: React.FC<RatingFilterProps> = ({ rating, onRatingChange }) => {
  const { t } = useLocale();
  return (
    <div className="w-full">
      <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-300 mb-2">
        {t('ratingFilter.label')}
      </label>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
                <StarIcon key={star} filled={star <= rating} />
            ))}
            {rating === 0 && <span className="ml-2 text-sm text-gray-500">{t('ratingFilter.any')}</span>}
        </div>
        <input
          id="rating-filter"
          type="range"
          min="0"
          max="5"
          step="1"
          value={rating}
          onChange={(e) => onRatingChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
        />
        <button 
          onClick={() => onRatingChange(0)}
          className={`text-sm text-purple-400 hover:text-purple-300 transition-opacity ${rating > 0 ? 'opacity-100' : 'opacity-0'}`}
          aria-label={t('ratingFilter.clearAriaLabel')}
        >
          {t('ratingFilter.clear')}
        </button>
      </div>
      <style>{`
        .range-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 20px;
            height: 20px;
            background: #a855f7; /* purple-500 */
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
        }
        .range-slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            background: #a855f7;
            cursor: pointer;
            border-radius: 50%;
            border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default RatingFilter;