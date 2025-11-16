import React, { useRef, useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';
import { fileToDataUrl } from '../utils/fileUtils';

interface BlogPostEditorProps {
  initialContent: string;
  initialImageUrl: string;
  onSave: (updates: { content: string; imageUrl: string }) => void;
  onCancel: () => void;
}

const EditorButton: React.FC<{ onMouseDown: (e: React.MouseEvent) => void; children: React.ReactNode; 'aria-label': string }> = ({ onMouseDown, children, 'aria-label': ariaLabel }) => (
  <button
    type="button"
    onMouseDown={onMouseDown} // Use onMouseDown to prevent the editor from losing focus
    className="p-2 w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ initialContent, initialImageUrl, onSave, onCancel }) => {
  const { t } = useLocale();
  const editorRef = useRef<HTMLDivElement>(null);
  
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
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
          setImageUrl(initialImageUrl);
      } else {
          setImageUrl('');
      }
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleSave = async () => {
    if (editorRef.current) {
      const finalContent = editorRef.current.innerHTML;
      
      let finalImageUrl = imageUrl.trim();
      if (imageSource === 'upload' && imageFile) {
        finalImageUrl = await fileToDataUrl(imageFile);
      }

      onSave({ 
        content: finalContent, 
        imageUrl: finalImageUrl || initialImageUrl
      });
    }
  };

  return (
    <div className="bg-gray-800 border-2 border-purple-500/50 rounded-lg shadow-lg">
      <div className="flex items-center p-2 border-b border-gray-700 space-x-1 text-gray-200">
        <EditorButton onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} aria-label={t('editor.bold')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15h2M12 9v6M5 9h5a2 2 0 012 2v2a2 2 0 01-2 2H5V9z" /></svg>
        </EditorButton>
        <EditorButton onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} aria-label={t('editor.italic')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m4-14H8" /></svg>
        </EditorButton>
        <EditorButton onMouseDown={(e) => { e.preventDefault(); handleFormat('insertUnorderedList'); }} aria-label={t('editor.bulletList')}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
        </EditorButton>
      </div>
      <div
        ref={editorRef}
        contentEditable={true}
        className="blog-content p-4 min-h-[300px] focus:outline-none"
        dangerouslySetInnerHTML={{ __html: initialContent }}
      />
      <div className="p-4 border-t border-gray-700 space-y-4">
        <label className="block text-gray-400 text-sm font-bold">{t('editor.imageLabel')}</label>
        <img src={imagePreview || imageUrl} alt={t('editor.imageAlt')} className="w-full h-auto max-h-48 object-cover rounded-md mb-2" />
        
        <div className="flex items-center gap-4 bg-gray-700/50 p-1 rounded-lg">
            <button type="button" onClick={() => handleSourceChange('url')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'url' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                {t('editor.fromUrl')}
            </button>
            <button type="button" onClick={() => handleSourceChange('upload')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors ${imageSource === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                {t('editor.uploadImage')}
            </button>
        </div>

        {imageSource === 'url' ? (
            <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-gray-700 text-gray-200 placeholder-gray-400 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
        ) : (
            <div>
                <label htmlFor="post-image-upload-edit" className="w-full cursor-pointer bg-gray-700 text-gray-300 hover:bg-gray-600 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{imageFile ? t('editor.changeImage') : t('editor.chooseImage')}</span>
                </label>
                <input
                    id="post-image-upload-edit"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                />
            </div>
        )}
      </div>
      <div className="flex justify-end p-2 border-t border-gray-700 space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors"
        >
          {t('editor.cancel')}
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
        >
          {t('editor.save')}
        </button>
      </div>
    </div>
  );
};

export default BlogPostEditor;