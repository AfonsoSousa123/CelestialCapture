import React, { useState, useEffect } from 'react';
import { ObjectOfTheMonthData } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useLocale } from '../contexts/LocaleContext';
import Modal from './Modal';

interface EditObjectOfTheMonthModalProps {
  currentData: ObjectOfTheMonthData;
  onClose: () => void;
  onSave: (newData: ObjectOfTheMonthData) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const EditObjectOfTheMonthModal: React.FC<EditObjectOfTheMonthModalProps> = ({ currentData, onClose, onSave }) => {
  const { t } = useLocale();
  const [data, setData] = useState<ObjectOfTheMonthData>(currentData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFactChange = (index: number, value: string) => {
    const newFacts = [...data.facts];
    newFacts[index] = { ...newFacts[index], value: value };
    setData(prev => ({ ...prev, facts: newFacts }));
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setData(prev => ({ ...prev, imageUrl: '' }));
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
          setData(prev => ({ ...prev, imageUrl: currentData.imageUrl }));
      } else {
          setData(prev => ({ ...prev, imageUrl: '' }));
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!data.name.trim() || !data.description.trim() || !data.findingTips.trim() || data.facts.some(fact => !fact.value.trim())) {
        setError(t('editObject.errorAllFields'));
        return;
    }

    setIsLoading(true);
    let finalData = { ...data };

    if (imageSource === 'upload' && imageFile) {
        try {
            const base64Url = await fileToBase64(imageFile);
            finalData.imageUrl = base64Url;
        } catch (err) {
            setError(t('editObject.errorImageProcess'));
            setIsLoading(false);
            return;
        }
    }
    
    if (!finalData.imageUrl.trim()) {
        setError(t('editObject.errorImageRequired'));
        setIsLoading(false);
        return;
    }

    setTimeout(() => {
        onSave(finalData);
    }, 500);
  };

  return (
    <Modal onClose={onClose} ariaLabelledBy="edit-object-title">
      <div 
        className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl shadow-purple-500/20 w-full max-w-2xl p-8 max-h-[90vh] flex flex-col"
      >
        <h2 id="edit-object-title" className="text-3xl font-bold text-white text-center mb-6">{t('editObject.title')}</h2>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4">
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="name">
              {t('editObject.nameLabel')}
            </label>
            <input id="name" name="name" type="text" value={data.name} onChange={handleInputChange} required className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">{t('editObject.imageLabel')}</label>
            <img src={imagePreview || data.imageUrl} alt={t('editObject.imageAlt')} className="w-full h-auto max-h-48 object-cover rounded-md mb-2 bg-gray-900" />
             <div className="flex items-center gap-4 bg-gray-700/50 p-1 rounded-lg">
                <button type="button" onClick={() => handleSourceChange('url')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'url' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    {t('editObject.fromUrl')}
                </button>
                <button type="button" onClick={() => handleSourceChange('upload')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    {t('editObject.uploadImage')}
                </button>
            </div>
          </div>

          {imageSource === 'url' ? (
            <div>
                <label className="block text-gray-400 text-sm font-bold sr-only" htmlFor="imageUrl">
                    {t('editObject.imageUrlLabel')}
                </label>
                <input id="imageUrl" name="imageUrl" type="url" value={data.imageUrl} onChange={handleInputChange} required className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mt-2" />
            </div>
          ) : (
            <div className="mt-2">
                 <label htmlFor="object-image-upload" className="w-full cursor-pointer bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{imageFile ? t('editObject.changeImage') : t('editObject.chooseImage')}</span>
                </label>
                <input id="object-image-upload" type="file" onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
            </div>
          )}

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="description">
              {t('editObject.descriptionLabel')}
            </label>
            <textarea id="description" name="description" rows={4} value={data.description} onChange={handleInputChange} required className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.facts.map((fact, index) => (
                <div key={fact.label}>
                    <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor={`fact-${index}`}>
                    {fact.label}
                    </label>
                    <input id={`fact-${index}`} type="text" value={fact.value} onChange={(e) => handleFactChange(index, e.target.value)} required className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
            ))}
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="findingTips">
              {t('editObject.findingTipsLabel')}
            </label>
            <textarea id="findingTips" name="findingTips" rows={3} value={data.findingTips} onChange={handleInputChange} required className="w-full bg-gray-700 text-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y" />
          </div>
        
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end gap-4">
              {error && <p className="text-red-500 text-xs italic text-left flex-grow self-center">{error}</p>}
               <button type="button" onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                  {t('editObject.cancelButton')}
                </button>
                <button type="submit" disabled={isLoading} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[140px]">
                  {isLoading ? <LoadingSpinner /> : t('editObject.saveButton')}
                </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditObjectOfTheMonthModal;