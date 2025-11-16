import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from '../contexts/LocaleContext';

interface FullscreenImageViewProps {
  imageUrl: string;
  imageTitle: string;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const PAN_STEP = 30;

const FullscreenImageView: React.FC<FullscreenImageViewProps> = ({ imageUrl, imageTitle, onClose }) => {
  const { t } = useLocale();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startImgPos = useRef({ x: 0, y: 0 });
  
  const resetZoom = useCallback(() => {
    setScale(MIN_SCALE);
    setPosition({ x: 0, y: 0 });
  }, []);

  const adjustScale = useCallback((amount: number) => {
    setScale(prevScale => {
      const newScale = Math.min(Math.max(MIN_SCALE, prevScale + amount), MAX_SCALE);
      if (newScale === MIN_SCALE) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['+', '=', '-', '_', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          adjustScale(0.2);
          break;
        case '-':
        case '_':
          adjustScale(-0.2);
          break;
        case 'ArrowUp':
          setPosition(p => ({ ...p, y: p.y + PAN_STEP }));
          break;
        case 'ArrowDown':
          setPosition(p => ({ ...p, y: p.y - PAN_STEP }));
          break;
        case 'ArrowLeft':
          setPosition(p => ({ ...p, x: p.x + PAN_STEP }));
          break;
        case 'ArrowRight':
          setPosition(p => ({ ...p, x: p.x - PAN_STEP }));
          break;
        case '0':
        case 'r':
          resetZoom();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, adjustScale, resetZoom]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isDragging) return;
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    adjustScale(delta);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= MIN_SCALE) return;
    e.preventDefault();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startImgPos.current = position;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= MIN_SCALE) return;
    e.preventDefault();
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPosition({
      x: startImgPos.current.x + dx,
      y: startImgPos.current.y + dy,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] backdrop-blur-md"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      ref={containerRef}
      onWheel={handleWheel}
    >
      <div 
        className="w-full h-full flex items-center justify-center overflow-hidden"
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt={imageTitle}
          className="max-w-full max-h-full object-contain transition-transform duration-100 ease-linear"
          style={{ 
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              cursor: isDragging ? 'grabbing' : scale > MIN_SCALE ? 'grab' : 'default'
          }}
          onMouseDown={handleMouseDown}
          draggable="false"
        />
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
         <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors" aria-label={t('fullscreen.close')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="bg-black/50 p-2 rounded-lg flex items-center gap-2">
          <button onClick={() => adjustScale(-0.5)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50" disabled={scale <= MIN_SCALE} aria-label={t('fullscreen.zoomOut')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
          </button>
          <button onClick={resetZoom} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50" disabled={scale <= MIN_SCALE} aria-label={t('fullscreen.resetZoom')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
          </button>
          <button onClick={() => adjustScale(0.5)} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50" disabled={scale >= MAX_SCALE} aria-label={t('fullscreen.zoomIn')}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
          </button>
        </div>
        <div className="text-xs text-gray-300 bg-black/50 px-3 py-1 rounded-full shadow-lg">
          <span className="font-bold">{t('fullscreen.scroll')}</span> {t('fullscreen.toZoom')} | <span className="font-bold">{t('fullscreen.arrows')}</span> {t('fullscreen.toPan')} | <span className="font-bold">Esc</span> {t('fullscreen.toClose')}
        </div>
      </div>
    </div>
  );
};

export default FullscreenImageView;
