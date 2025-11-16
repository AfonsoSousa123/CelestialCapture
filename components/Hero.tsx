import React, { useState, useEffect } from 'react';
import { useLocale } from '../contexts/LocaleContext';

const Hero: React.FC = () => {
  const { t } = useLocale();
  const [scrollStyles, setScrollStyles] = useState({
    contentOpacity: 1,
    bgTransform: 'translateY(0px)',
    bgOpacity: 1,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const screenHeight = window.innerHeight;
      
      const contentFadeEnd = screenHeight * 0.5;
      const calculatedContentOpacity = Math.max(0, 1 - (scrollY / contentFadeEnd));
      
      const bgTransform = `translateY(${scrollY * 0.5}px)`;
      
      const bgFadeEnd = screenHeight * 0.8;
      const calculatedBgOpacity = Math.max(0, 1 - (scrollY / bgFadeEnd));

      setScrollStyles({
        contentOpacity: calculatedContentOpacity,
        bgTransform: bgTransform,
        bgOpacity: calculatedBgOpacity,
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1920&auto=format&fit=crop')",
          transform: scrollStyles.bgTransform,
          opacity: scrollStyles.bgOpacity,
        }}
        aria-hidden="true"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-900"></div>

      <div className="relative z-10 p-4 animate-fadeInUp" style={{ opacity: scrollStyles.contentOpacity }}>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-shadow-lg">
          {t('header.title')} <span className="text-purple-400">{t('header.titleHighlight')}</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto text-shadow">
          {t('hero.subtitle')}
        </p>
        <a 
          href="#gallery-section"
          className="mt-8 inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          {t('hero.exploreButton')}
        </a>
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10" style={{ opacity: scrollStyles.contentOpacity }}>
        <div className="animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
      
      <style>{`
        .text-shadow-lg { text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5); }
        .text-shadow { text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6); }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-15px); }
          60% { transform: translateY(-8px); }
        }
        .animate-bounce { animation: bounce 2s infinite; }
      `}</style>
    </section>
  );
};

export default Hero;