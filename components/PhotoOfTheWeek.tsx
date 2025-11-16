import React from 'react';
import { Photo } from '../types';
import { useLocale } from '../contexts/LocaleContext';

interface PhotoOfTheWeekProps {
  photo: Photo;
  onSelectPhoto: (photo: Photo) => void;
}

const PhotoOfTheWeek: React.FC<PhotoOfTheWeekProps> = ({ photo, onSelectPhoto }) => {
  const { t } = useLocale();
  return (
    <section className="mb-12 animate-fadeInUp">
      <div 
        className="relative group cursor-pointer bg-black rounded-2xl overflow-hidden shadow-2xl shadow-yellow-500/10 border-2 border-yellow-500/30 h-80 md:h-[500px] flex justify-center items-center" 
        onClick={() => onSelectPhoto(photo)}
      >
        <img
          src={photo.urls?.large || photo.url}
          alt={photo.title}
          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div className="mb-4">
                <span className="inline-block bg-yellow-400 text-gray-900 font-bold text-sm px-4 py-1 rounded-full shadow-lg">
                    {t('photoOfWeek.badge')}
                </span>
            </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white text-shadow-lg">{photo.title}</h2>
          <p className="mt-2 text-lg text-gray-300 text-shadow max-w-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {photo.description?.split('\n')[0] || t('photoOfWeek.capturedOn', { date: photo.date })}
          </p>
        </div>
      </div>
      <style>{`
          .text-shadow-lg { text-shadow: 0 4px 15px rgba(0, 0, 0, 0.7); }
          .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8); }
      `}</style>
    </section>
  );
};

export default PhotoOfTheWeek;