import React from 'react';
import { useLocale } from '../contexts/LocaleContext';

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLocale();

  const buttonClass = (lang: 'en' | 'pt-PT') => 
    `px-3 py-1 text-sm font-bold rounded-md transition-colors duration-200 ${
      locale === lang 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;

  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-1 space-x-1">
      <button onClick={() => setLocale('en')} className={buttonClass('en')}>
        EN
      </button>
      <button onClick={() => setLocale('pt-PT')} className={buttonClass('pt-PT')}>
        PT
      </button>
    </div>
  );
};

export default LanguageSwitcher;
