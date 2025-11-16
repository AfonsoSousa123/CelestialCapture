import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (newRating: number) => void;
  isAdmin: boolean;
}

const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => {
    return (
        <svg
            className={`w-6 h-6 transition-colors duration-200 ${filled ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
};

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, isAdmin }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index: number) => {
    if (!isAdmin) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!isAdmin) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!isAdmin || !onRatingChange) return;
    // Clicking the same star again resets the rating to 0
    const newRating = index === rating ? 0 : index;
    onRatingChange(newRating);
  };

  return (
    <div 
        className={`flex items-center ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
        onMouseLeave={handleMouseLeave}
        aria-label={`Rating: ${rating} out of 5 stars`}
        role="radiogroup"
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <button
            key={index}
            type="button"
            className="focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded-sm"
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            disabled={!isAdmin}
            aria-label={`Set rating to ${index} star${index > 1 ? 's' : ''}`}
            role="radio"
            aria-checked={rating === index}
        >
             <StarIcon filled={(hoverRating || rating) >= index} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
