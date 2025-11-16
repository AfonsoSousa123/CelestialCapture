import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'text-purple-400' }) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true" // Decorative, so hide from screen readers
    >
      {/* A clean, geometric 'C' shape using an SVG arc */}
      <path
        d="M19 5.5A7.5 7.5 0 1 0 19 18.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* A four-pointed star, shifted further right to be centered in the C */}
      <path
        d="M13.8 9L14.8 11L16.8 12L14.8 13L13.8 15L12.8 13L10.8 12L12.8 11Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Logo;
