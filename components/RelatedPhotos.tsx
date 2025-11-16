import React, { useMemo } from 'react';
import { Photo } from '../types';

interface RelatedPhotosProps {
  currentPhoto: Photo;
  allPhotos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
}

const RelatedPhotos: React.FC<RelatedPhotosProps> = ({ currentPhoto, allPhotos, onSelectPhoto }) => {
  const relatedPhotos = useMemo(() => {
    const otherPhotos = allPhotos.filter(p => p.id !== currentPhoto.id);
    let candidates: (Photo & { score: number })[] = [];

    // Prioritize tag-based relation
    if (currentPhoto.tags && currentPhoto.tags.length > 0) {
      candidates = otherPhotos.map(photo => {
        const commonTags = photo.tags?.filter(tag => currentPhoto.tags?.includes(tag)) || [];
        return { ...photo, score: commonTags.length };
      }).filter(photo => photo.score > 0);
      
      candidates.sort((a, b) => b.score - a.score);
    }

    // Fallback to date-based relation if no tag matches are found
    if (candidates.length === 0) {
      const currentDate = new Date(currentPhoto.date).getTime();
      const thirtyDaysInMillis = 30 * 24 * 60 * 60 * 1000;

      candidates = otherPhotos.map(photo => {
        const photoDate = new Date(photo.date).getTime();
        const diff = Math.abs(currentDate - photoDate);
        return { ...photo, score: diff };
      }).filter(photo => photo.score <= thirtyDaysInMillis);
      
      candidates.sort((a, b) => a.score - b.score);
    }

    return candidates.slice(0, 5);
  }, [currentPhoto, allPhotos]);

  if (relatedPhotos.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-4 border-t border-gray-700">
      <h4 className="text-lg font-semibold text-purple-300 mb-3">Related Photos</h4>
      <div className="flex overflow-x-auto space-x-3 pb-3 custom-scrollbar">
        {relatedPhotos.map(photo => (
          <button
            key={photo.id}
            onClick={() => onSelectPhoto(photo)}
            className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden group relative focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <img 
              src={photo.urls?.small || photo.url} 
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <p className="text-white text-xs font-bold truncate">{photo.title}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedPhotos;