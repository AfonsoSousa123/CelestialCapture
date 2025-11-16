import React, { useRef, useState, useEffect } from 'react';
import { Photo } from '../types';
import PhotoCard from './PhotoCard';
import LoadingSpinner from './LoadingSpinner';
import { useLocale } from '../contexts/LocaleContext';
import { fileToDataUrl } from '../utils/fileUtils';
import { readExifData } from '../utils/exifReader';

interface GalleryProps {
  photos: Photo[];
  onSelectPhoto: (photo: Photo) => void;
  onAddPhoto: (photo: Photo) => void;
  isAdmin: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ photos, onSelectPhoto, onAddPhoto, isAdmin }) => {
    const { t } = useLocale();
    const [uploadPreview, setUploadPreview] = useState<{ url: string; name: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    useEffect(() => {
        photoRefs.current = photoRefs.current.slice(0, photos.length);
    }, [photos]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (photos.length === 0) return;

            const getColumns = () => {
                if (window.innerWidth >= 1536) return 6;
                if (window.innerWidth >= 1280) return 5;
                if (window.innerWidth >= 1024) return 4;
                if (window.innerWidth >= 768) return 3;
                if (window.innerWidth >= 640) return 2;
                return 1;
            };

            const columns = getColumns();
            let newIndex = focusedIndex;

            if (e.key === 'Enter' && focusedIndex !== null) {
                e.preventDefault();
                onSelectPhoto(photos[focusedIndex]);
                return;
            }

            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                    newIndex = (focusedIndex ?? -1) + 1;
                    break;
                case 'ArrowLeft':
                    newIndex = (focusedIndex ?? 1) - 1;
                    break;
                case 'ArrowDown':
                    newIndex = (focusedIndex ?? -columns) + columns;
                    break;
                case 'ArrowUp':
                    newIndex = (focusedIndex ?? columns) - columns;
                    break;
                default:
                    return; // Exit if not an arrow key
            }
            
            e.preventDefault();

            if (newIndex >= 0 && newIndex < photos.length) {
                setFocusedIndex(newIndex);
                photoRefs.current[newIndex]?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [focusedIndex, photos, onSelectPhoto]);

    const processFile = async (file: File) => {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
            alert(t('gallery.invalidFileType'));
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setUploadPreview({ url: previewUrl, name: file.name });

        try {
            const dataUrl = await fileToDataUrl(file);
            const base64Data = dataUrl.split(',')[1];

            const getDimensions = (url: string): Promise<{ width: number; height: number }> => {
                return new Promise(resolve => {
                    const img = new Image();
                    img.onload = () => resolve({ width: img.width, height: img.height });
                    img.onerror = () => resolve({ width: 0, height: 0 });
                    img.src = url;
                });
            };

            const [dimensions, exifData] = await Promise.all([
                getDimensions(dataUrl),
                readExifData(file)
            ]);

            const newPhoto: Photo = {
                id: new Date().toISOString(),
                title: file.name.split('.').slice(0, -1).join('.') || t('gallery.untitled'),
                date: new Date().toLocaleDateString('en-CA'),
                url: dataUrl,
                description: null,
                base64Data: base64Data,
                mimeType: file.type,
                rating: 0,
                tags: [],
                width: exifData.width || dimensions.width,
                height: exifData.height || dimensions.height,
                fileSize: parseFloat((file.size / 1024 / 1024).toFixed(1)),
                iso: exifData.iso,
                aperture: exifData.aperture,
                exposureTime: exifData.exposureTime,
            };

            onAddPhoto(newPhoto);
        } catch (error) {
            console.error("Error processing file:", error);
            alert(t('gallery.uploadError'));
        } finally {
            setUploadPreview(null);
            URL.revokeObjectURL(previewUrl);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await processFile(file);
        }
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDraggingOver(true);
        }
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
    
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            await processFile(file);
            e.dataTransfer.clearData();
        }
    };

    const handleAddPhotoClick = () => {
        fileInputRef.current?.click();
    };

  return (
    <section 
        className="relative"
        onDragEnter={isAdmin ? handleDragEnter : undefined}
        onDragLeave={isAdmin ? handleDragLeave : undefined}
        onDragOver={isAdmin ? handleDragOver : undefined}
        onDrop={isAdmin ? handleDrop : undefined}
    >
       {isAdmin && isDraggingOver && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm border-4 border-dashed border-purple-500 rounded-2xl flex flex-col items-center justify-center z-10 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xl font-bold text-white">{t('gallery.dropzone.title')}</p>
                <p className="text-gray-400">{t('gallery.dropzone.subtitle')}</p>
            </div>
        )}
       {isAdmin && (
        <div className="flex flex-col items-center mb-8">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
            />
            <button 
                onClick={handleAddPhotoClick}
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30 flex items-center space-x-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span>{t('gallery.uploadButton')}</span>
            </button>
            {uploadPreview && (
                <div className="mt-4 p-3 bg-gray-800 rounded-lg w-full max-w-xs flex items-center space-x-4 animate-fadeIn shadow-md">
                    <img src={uploadPreview.url} alt="Upload preview" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate" title={uploadPreview.name}>{uploadPreview.name}</p>
                        <p className="text-xs text-gray-400">{t('gallery.processing')}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <LoadingSpinner />
                    </div>
                </div>
            )}
        </div>
       )}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 md:gap-6">
        {photos.map((photo, index) => (
          <PhotoCard 
            key={photo.id} 
            photo={photo} 
            onSelectPhoto={onSelectPhoto}
            isFocused={focusedIndex === index}
            ref={el => { photoRefs.current[index] = el; }}
          />
        ))}
      </div>
    </section>
  );
};

export default Gallery;