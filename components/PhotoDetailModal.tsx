import React, { useState, useEffect, useRef } from 'react';
import { Photo } from '../types';
import { generatePhotoDescription } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import FullscreenImageView from './FullscreenImageView';
import StarRating from './StarRating';
import RelatedPhotos from './RelatedPhotos';
import { useHistoryState } from '../hooks/useHistoryState';
import { useLocale } from '../contexts/LocaleContext';
import Modal from './Modal';
import { useToast } from '../hooks/useToast';

interface PhotoDetailModalProps {
  photo: Photo;
  allPhotos: Photo[];
  onClose: () => void;
  onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => void;
  onDeletePhoto: (photoId: string) => void;
  onNavigate: (photo: Photo) => void;
  isAdmin: boolean;
  onSetPhotoOfTheWeek: (photoId: string) => void;
}

interface EditablePhotoState {
  title: string;
  description: string;
  tags: string[];
  rating: number;
  iso: string | null;
  aperture: string | null;
  exposureTime: string | null;
}

const parseTechDetailsFromDescription = (description: string) => {
    const details: Partial<EditablePhotoState> = { iso: null, aperture: null, exposureTime: null };
    const techDetailsSection = description.match(/technical details/i);
    if (!techDetailsSection) return details;

    const isoMatch = description.match(/ISO:?\s*([\d,]+)/i);
    if (isoMatch) details.iso = isoMatch[1];
    
    const apertureMatch = description.match(/Aperture:?\s*([fF]\/\d+(\.\d+)?)/i);
    if (apertureMatch) details.aperture = apertureMatch[1];

    const exposureMatch = description.match(/Exposure (time)?:?\s*(\d+(\.\d+)?\s*s(ec|econds)?)/i);
    if (exposureMatch) details.exposureTime = exposureMatch[2].trim();
    
    return details;
};

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-md text-gray-200">{value}</p>
    </div>
);

const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({ 
  photo, allPhotos, onClose, onUpdatePhoto, onDeletePhoto, onNavigate, isAdmin, 
  onSetPhotoOfTheWeek 
}) => {
  const { t } = useLocale();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isAiDescription, setIsAiDescription] = useState(false);
  
  const initialState: EditablePhotoState = {
    title: photo.title,
    description: photo.description || '',
    tags: photo.tags || [],
    rating: photo.rating || 0,
    iso: photo.iso || null,
    aperture: photo.aperture || null,
    exposureTime: photo.exposureTime || null,
  };
  
  const { state, setState, undo, redo, canUndo, canRedo, reset } = useHistoryState<EditablePhotoState>(initialState);

  useEffect(() => {
    reset({
      title: photo.title,
      description: photo.description || '',
      tags: photo.tags || [],
      rating: photo.rating || 0,
      iso: photo.iso || null,
      aperture: photo.aperture || null,
      exposureTime: photo.exposureTime || null,
    });
    setIsAiDescription(false);
    setShowConfirmDelete(false);
  }, [photo, reset]);
  
  const navigate = (direction: 'next' | 'prev') => {
      const currentIndex = allPhotos.findIndex(p => p.id === photo.id);
      if (currentIndex === -1) return;

      let nextIndex = -1;
      if (direction === 'next') {
        nextIndex = (currentIndex + 1) % allPhotos.length;
      } else {
        nextIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length;
      }
      
      if (nextIndex !== -1) {
        onNavigate(allPhotos[nextIndex]);
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || showConfirmDelete) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate('prev');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, allPhotos, onNavigate, isFullscreen, showConfirmDelete]);

  const areTagsEqual = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;
      const sorted1 = [...arr1].sort();
      const sorted2 = [...arr2].sort();
      return sorted1.every((value, index) => value === sorted2[index]);
  }

  const hasChanges = photo.title !== state.title || 
                     (photo.description || '') !== state.description ||
                     !areTagsEqual(photo.tags || [], state.tags) ||
                     (photo.rating || 0) !== state.rating ||
                     (photo.iso || null) !== state.iso ||
                     (photo.aperture || null) !== state.aperture ||
                     (photo.exposureTime || null) !== state.exposureTime;

  const handleGenerateDescription = async () => {
    if (!photo.base64Data || !photo.mimeType) {
        alert(t('photoDetail.generateError'));
        return;
    }
    setIsLoading(true);
    try {
        const description = await generatePhotoDescription(photo.base64Data, photo.mimeType, t('prompts.photoDescription'));
        const techDetails = parseTechDetailsFromDescription(description);
        setState({ ...state, description, ...techDetails });
        setIsAiDescription(true);
    } catch (error) {
        console.error("Failed to generate description:", error);
        setState({ ...state, description: t('photoDetail.generateErrorApi') });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
        e.preventDefault();
        const newTag = tagInput.trim();
        if (!state.tags.includes(newTag)) {
            setState({ ...state, tags: [...state.tags, newTag] });
        }
        setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!isAdmin) return;
    setState({ ...state, tags: state.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleSave = () => {
    onUpdatePhoto(photo.id, { 
        ...state,
        description: state.description || null,
    });
    showToast(t('toasts.changesSaved'), 'success');
    onClose();
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    onDeletePhoto(photo.id);
    showToast(t('toasts.photoDeleted', { title: state.title }), 'success');
  };
  
  const handleSetFeatured = () => {
    onSetPhotoOfTheWeek(photo.id);
    showToast(t('toasts.photoOfWeekUpdated'), 'success');
    onClose();
  }

  const descriptionPlaceholder = isAdmin 
    ? t('photoDetail.descriptionPlaceholderAdmin')
    : (state.description ? "" : t('photoDetail.descriptionPlaceholderUser'));

  return (
    <>
      <Modal
        onClose={onClose}
        ariaLabelledBy="photo-title"
        containerClassName="bg-gray-900/80 backdrop-blur-lg rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
      >
          <div key={`${photo.id}-img`} className="relative w-full md:w-1/2 h-[45vh] md:h-auto flex-shrink-0 bg-black flex items-center justify-center overflow-hidden group animate-view-change">
              <img src={photo.urls?.large || photo.url} alt={state.title} className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => setIsFullscreen(true)} className="p-3 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors" aria-label={t('photoDetail.viewFullscreen')}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9.75 9.75M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L14.25 9.75M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9.75 14.25m10.5 6.75v-4.5m0 4.5h-4.5m4.5 0l-5.25-5.25" /></svg>
                  </button>
              </div>
              {/* Navigation Buttons */}
              <button onClick={() => navigate('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0" aria-label="Previous photo">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => navigate('next')} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0" aria-label="Next photo">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
          </div>
          <div key={`${photo.id}-details`} className="w-full md:w-1/2 p-8 flex flex-col flex-1 min-h-0 animate-view-change" style={{ animationDelay: '50ms' }}>
            <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-start justify-between">
                <input
                  id="photo-title"
                  type="text"
                  value={state.title}
                  onChange={(e) => setState({ ...state, title: e.target.value })}
                  readOnly={!isAdmin}
                  className="text-3xl font-bold text-white mb-2 bg-transparent border-b-2 border-transparent focus:border-purple-500 outline-none w-full transition-colors read-only:cursor-default read-only:border-transparent"
                  placeholder={t('photoDetail.titlePlaceholder')}
                />
              </div>
              <p className="text-sm text-purple-400 mb-2">{photo.date}</p>
              
              {(isAdmin || (state.rating && state.rating > 0)) && (
                <div className="mb-4">
                   {!isAdmin && <p className="text-sm text-gray-400 mb-1">{t('photoDetail.ratingLabel')}</p>}
                  <StarRating 
                    rating={state.rating} 
                    onRatingChange={(newRating) => setState({ ...state, rating: newRating })}
                    isAdmin={isAdmin} 
                  />
                </div>
              )}
              
              <textarea
                value={state.description}
                onChange={(e) => {
                  setState({ ...state, description: e.target.value });
                  setIsAiDescription(false);
                }}
                readOnly={!isAdmin}
                className={`prose prose-invert prose-p:text-gray-300 bg-transparent w-full h-24 md:h-auto flex-grow resize-none focus:outline-none read-only:cursor-default focus:ring-2 focus:ring-purple-500 rounded-md p-2 -ml-2 transition-all duration-300 ${
                  isAiDescription && isAdmin ? 'bg-purple-900/20 shadow-[0_0_8px_rgba(192,132,252,0.3)] ring-1 ring-purple-500/50' : ''
                }`}
                placeholder={descriptionPlaceholder}
              />

              <div className="my-4 pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem label={t('photoDetail.resolution')} value={photo.width && photo.height ? `${photo.width} x ${photo.height}` : '—'} />
                    <DetailItem label={t('photoDetail.fileSize')} value={photo.fileSize ? `${photo.fileSize} MB` : '—'} />
                    
                    <div>
                        <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">ISO</p>
                        {isAdmin ? (
                            <input
                                type="text"
                                value={state.iso || ''}
                                onChange={(e) => setState({ ...state, iso: e.target.value })}
                                className="text-md text-gray-200 bg-transparent w-full focus:outline-none focus:bg-gray-800/50 rounded px-1 py-0.5 border border-transparent focus:border-purple-500 transition"
                                placeholder="e.g. 1600"
                            />
                        ) : (
                            <p className="text-md text-gray-200">{state.iso || '—'}</p>
                        )}
                    </div>
                    
                    <div>
                        <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">{t('photoDetail.aperture')}</p>
                        {isAdmin ? (
                            <input
                                type="text"
                                value={state.aperture || ''}
                                onChange={(e) => setState({ ...state, aperture: e.target.value })}
                                className="text-md text-gray-200 bg-transparent w-full focus:outline-none focus:bg-gray-800/50 rounded px-1 py-0.5 border border-transparent focus:border-purple-500 transition"
                                placeholder="e.g. f/2.8"
                            />
                        ) : (
                            <p className="text-md text-gray-200">{state.aperture || '—'}</p>
                        )}
                    </div>

                    <div>
                        <p className="text-xs text-purple-400 font-bold uppercase tracking-wider">{t('photoDetail.exposure')}</p>
                        {isAdmin ? (
                            <input
                                type="text"
                                value={state.exposureTime || ''}
                                onChange={(e) => setState({ ...state, exposureTime: e.target.value })}
                                className="text-md text-gray-200 bg-transparent w-full focus:outline-none focus:bg-gray-800/50 rounded px-1 py-0.5 border border-transparent focus:border-purple-500 transition"
                                placeholder="e.g. 300s"
                            />
                        ) : (
                            <p className="text-md text-gray-200">{state.exposureTime || '—'}</p>
                        )}
                    </div>
                </div>
              </div>

              {isAdmin && (
                <div className="my-4">
                    <button
                        onClick={handleGenerateDescription}
                        disabled={isLoading || !photo.base64Data}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                          <>
                          <LoadingSpinner />
                          <span>{t('photoDetail.generating')}</span>
                          </>
                      ) : (
                        <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10.89 3.472a1 1 0 00-1.78 0l-1.622 3.992a1 1 0 01-.79 1.12l-4.22.844a1 1 0 00-.638 1.808l3.197 3.01a1 1 0 01.317 1.054l-.844 4.22a1 1 0 001.316 1.159l3.83-1.95a1 1 0 011.054 0l3.83 1.95a1 1 0 001.316-1.16l-.843-4.22a1 1 0 01.317-1.054l3.197-3.01a1 1 0 00-.638-1.808l-4.22-.844a1 1 0 01-.79-1.12L10.89 3.472z" clipRule="evenodd" />
                        </svg>
                        <span>{state.description ? t('photoDetail.regenerateButton') : t('photoDetail.generateButton')}</span>
                        </>
                      )}
                    </button>
                    {!photo.base64Data && <p className="text-xs text-gray-500 text-center mt-2">{t('photoDetail.generateTooltip')}</p>}
                </div>
              )}
               <div className="mb-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                      {state.tags.map(tag => (
                          <span key={tag} className="flex items-center bg-purple-800 text-purple-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                              {tag}
                              {isAdmin && <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-purple-200 hover:text-white text-base leading-none">&times;</button>}
                          </span>
                      ))}
                  </div>
                  {isAdmin && (
                    <input 
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder={t('photoDetail.addTagPlaceholder')}
                        className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    />
                  )}
              </div>
                <RelatedPhotos 
                    currentPhoto={photo} 
                    allPhotos={allPhotos} 
                    onSelectPhoto={onNavigate}
                />
            </div>
            
            {isAdmin && (
              <div className="mt-6 flex flex-col gap-3">
                <button
                    onClick={handleSetFeatured}
                    className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    {t('photoDetail.setFeaturedButton')}
                 </button>
                <div className="flex flex-wrap items-center justify-center gap-3">
                   <button
                      onClick={handleSave}
                      disabled={!hasChanges}
                      className="flex-1 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {t('photoDetail.saveButton')}
                   </button>
                   <div className="flex items-center gap-1">
                      <button
                          onClick={undo}
                          disabled={!canUndo}
                          className="flex-shrink-0 bg-gray-600 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={t('photoDetail.undoAria', { title: state.title })}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                          </svg>
                      </button>
                      <button
                          onClick={redo}
                          disabled={!canRedo}
                          className="flex-shrink-0 bg-gray-600 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={t('photoDetail.redoAria', { title: state.title })}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                          </svg>
                      </button>
                   </div>
                   <button
                      onClick={handleDelete}
                      className="flex-shrink-0 bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-red-700 transition-colors"
                      aria-label={t('photoDetail.deleteButtonAria', { title: state.title })}
                   >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                   </button>
                </div>
              </div>
            )}
          </div>
      </Modal>

      {showConfirmDelete && (
        <Modal
          onClose={() => setShowConfirmDelete(false)}
          ariaLabelledBy="confirm-delete-title"
          showCloseButton={false}
          containerClassName="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-red-500/20 w-full max-w-sm p-8 text-center"
        >
          <h3 id="confirm-delete-title" className="text-2xl font-bold text-white mb-4">{t('photoDetail.confirmDeleteTitle')}</h3>
          <p className="text-gray-300 mb-8">{t('photoDetail.confirmDeleteMessage', { title: state.title })}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="flex-1 bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-500"
            >
              {t('photoDetail.cancelButton')}
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            >
              {t('photoDetail.deleteButton')}
            </button>
          </div>
        </Modal>
      )}

      {isFullscreen && (
          <FullscreenImageView 
              imageUrl={photo.urls?.large || photo.url}
              imageTitle={state.title}
              onClose={() => setIsFullscreen(false)}
          />
      )}
    </>
  );
};

export default PhotoDetailModal;
