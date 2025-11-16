import React from 'react';
import { Photo, SortOption } from '../types';
import Hero from './Hero';
import PhotoOfTheWeek from './PhotoOfTheWeek';
import SearchBar from './SearchBar';
import SortControl from './SortControl';
import RatingFilter from './RatingFilter';
import TagFilter from './TagFilter';
import Gallery from './Gallery';
import Pagination from './Pagination';
import { useLocale } from '../contexts/LocaleContext';

interface GalleryPageProps {
  onSelectPhoto: (photo: Photo) => void;
  onAddPhoto: (photo: Photo) => void;
  isAdmin: boolean;
  photoOfTheWeek?: Photo;
  searchQuery: string;
  onQueryChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  ratingFilter: number;
  onRatingChange: (rating: number) => void;
  allTags: string[];
  activeTags: string[];
  onSelectTag: (tag: string) => void;
  onClearTags: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginatedPhotos: Photo[];
}

const GalleryPage: React.FC<GalleryPageProps> = ({
  onSelectPhoto, onAddPhoto, isAdmin, photoOfTheWeek,
  searchQuery, onQueryChange, sortOption, onSortChange,
  ratingFilter, onRatingChange, allTags, activeTags, onSelectTag, onClearTags,
  currentPage, totalPages, onPageChange, paginatedPhotos
}) => {
  const { t } = useLocale();

  const handlePageChange = (page: number) => {
      onPageChange(page);
      const gallerySection = document.getElementById('gallery-section');
      // Use a small timeout to ensure the state update has started before scrolling
      setTimeout(() => {
          gallerySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
  };

  return (
    <>
      <Hero />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {photoOfTheWeek && <PhotoOfTheWeek photo={photoOfTheWeek} onSelectPhoto={onSelectPhoto} />}
          <section id="gallery-section">
            <div className="bg-gray-900/30 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 md:p-8 mb-8 md:mb-12 max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-grow">
                  <SearchBar query={searchQuery} onQueryChange={onQueryChange} />
                </div>
                <div className="md:w-auto">
                  <SortControl activeSort={sortOption} onSortChange={onSortChange} />
                </div>
              </div>
              <div className="mb-6">
                 <RatingFilter rating={ratingFilter} onRatingChange={onRatingChange} />
              </div>
              <TagFilter 
                tags={allTags} 
                activeTags={activeTags} 
                onSelectTag={onSelectTag}
                onClearTags={onClearTags}
              />
            </div>
            {paginatedPhotos.length > 0 ? (
                <Gallery 
                  photos={paginatedPhotos} 
                  onSelectPhoto={onSelectPhoto} 
                  onAddPhoto={onAddPhoto} 
                  isAdmin={isAdmin}
                />
            ) : (
                <div className="text-center py-16 bg-gray-900/30 rounded-lg">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('gallery.noPhotosFound.title')}</h3>
                    <p className="text-gray-400">{t('gallery.noPhotosFound.subtitle')}</p>
                </div>
            )}
            {totalPages > 1 && (
                <div className="mt-8 md:mt-12 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
