import React, { useState, useEffect } from 'react';
import { NewBlogPostData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLocale } from '../contexts/LocaleContext';
import { fileToDataUrl } from '../utils/fileUtils';
import Modal from './Modal';

interface AddPostModalProps {
  onClose: () => void;
  onAddPost: (postData: NewBlogPostData) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ onClose, onAddPost }) => {
  const { t } = useLocale();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageUrl('');
    }
  };
  
  const handleSourceChange = (source: 'url' | 'upload') => {
      setImageSource(source);
      if (source === 'url') {
          setImageFile(null);
          if (imagePreview) {
              URL.revokeObjectURL(imagePreview);
              setImagePreview(null);
          }
      } else {
          setImageUrl('');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError(t('addPost.errorAllFields'));
      return;
    }

    setIsLoading(true);
    let finalImageUrl: string | null = imageSource === 'url' ? imageUrl.trim() : null;

    if (imageSource === 'upload' && imageFile) {
        try {
            finalImageUrl = await fileToDataUrl(imageFile);
        } catch (err) {
            setError(t('addPost.errorImageProcess'));
            setIsLoading(false);
            return;
        }
    }

    if (!finalImageUrl) {
        setError(t('addPost.errorImageRequired'));
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
        onAddPost({ title, excerpt, imageUrl: finalImageUrl!, content });
    }, 500);
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="add-post-title">
      <div
        className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-2xl p-8 max-h-[90vh] flex flex-col"
      >
        <h2 id="add-post-title" className="text-3xl font-bold text-white text-center mb-6">{t('addPost.title')}</h2>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="post-title">
              {t('addPost.postTitleLabel')}
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="post-excerpt">
              {t('addPost.excerptLabel')}
            </label>
            <textarea
              id="post-excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">{t('addPost.imageLabel')}</label>
            <div className="flex items-center gap-4 bg-gray-700/50 p-1 rounded-lg">
                <button type="button" onClick={() => handleSourceChange('url')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'url' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    {t('addPost.fromUrl')}
                </button>
                <button type="button" onClick={() => handleSourceChange('upload')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    {t('addPost.uploadImage')}
                </button>
            </div>
          </div>
          
          {imageSource === 'url' ? (
             <div>
                <label className="block text-gray-400 text-sm font-bold sr-only" htmlFor="post-image-url">
                    {t('addPost.imageUrlLabel')}
                </label>
                <input
                id="post-image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required={imageSource === 'url'}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                />
            </div>
          ) : (
            <div>
                 <label htmlFor="post-image-upload" className="w-full cursor-pointer bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span>{imageFile ? t('addPost.changeImage') : t('addPost.chooseImage')}</span>
                </label>
                <input
                    id="post-image-upload"
                    type="file"
                    onChange={handleFileChange}
                    required={imageSource === 'upload'}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
                {imagePreview && (
                    <div className="mt-4">
                        <img src={imagePreview} alt={t('addPost.previewAlt')} className="w-full h-auto max-h-48 object-cover rounded-md" />
                    </div>
                )}
            </div>
          )}
          
           <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="post-content">
              {t('addPost.contentLabel')}
            </label>
            <textarea
              id="post-content"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              placeholder="<p>Start your post here...</p>"
            />
          </div>
        
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end gap-4">
              {error && <p className="text-red-500 text-xs italic text-left flex-grow self-center">{error}</p>}
               <button
                  type="button"
                  onClick={onClose}
                  className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {t('addPost.cancelButton')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]"
                >
                  {isLoading ? <LoadingSpinner /> : t('addPost.createButton')}
                </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddPostModal;