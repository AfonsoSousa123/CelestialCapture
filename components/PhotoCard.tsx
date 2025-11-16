import React, { useState, forwardRef, memo } from 'react';
import { Photo } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface PhotoCardProps {
  photo: Photo;
  onSelectPhoto: (photo: Photo) => void;
  isFocused: boolean;
}

const PhotoCard = forwardRef<HTMLDivElement, PhotoCardProps>(({ photo, onSelectPhoto, isFocused }, ref) => {
  const { t } = useLocale();
  const [isLoaded, setIsLoaded] = useState(false);

  // Fallback dimensions if not available in photo data
  const getDimensionsFromUrl = (url: string) => {
    try {
      const parts = url.split('/');
      if (parts.length >= 2) {
        const height = parseInt(parts[parts.length - 1], 10);
        const width = parseInt(parts[parts.length - 2], 10);
        if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
          return { width, height };
        }
      }
    } catch (e) {}
    return { width: 400, height: 600 }; // Generic aspect ratio
  };

  const { width, height } = getDimensionsFromUrl(photo.urls?.medium || photo.url);

  return (
    <div
      ref={ref}
      className={`group relative rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-purple-500/40 break-inside-avoid mb-4 md:mb-6 bg-gray-900/50 border border-gray-800/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${isFocused ? 'ring-4 ring-purple-500 ring-offset-2 ring-offset-gray-900' : ''}`}
      onClick={() => onSelectPhoto(photo)}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelectPhoto(photo); }}
      aria-label={t('photoCard.viewDetails', { title: photo.title })}
    >
      <img
        src={photo.urls?.medium || photo.url}
        srcSet={photo.urls ? `${photo.urls.small} 400w, ${photo.urls.medium} 800w, ${photo.urls.large} 1200w` : undefined}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
        alt={photo.title}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-100 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <h3 className="text-white text-lg font-bold truncate transition-transform duration-300 translate-y-8 group-hover:translate-y-0">{photo.title}</h3>
        <div className="opacity-0 transition-all duration-300 group-hover:opacity-100 delay-100">
            <p className="text-gray-300 text-sm">{photo.date}</p>
            <div className="flex flex-wrap gap-1 mt-2">
                {photo.tags?.slice(0, 3).map(tag => (
                <span key={tag} className="bg-purple-900/70 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                    {tag}
                </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
});

export default memo(PhotoCard);