import React from 'react';
import Logo from './Logo';
import { useLocale } from '../contexts/LocaleContext';

const Footer: React.FC = () => {
  const { t } = useLocale();
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8 text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <Logo className="text-purple-500" />
            <div className="text-xl font-bold text-gray-300 tracking-wider">
              {t('header.title')} <span className="text-purple-400">{t('header.titleHighlight')}</span>
            </div>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          <p className="text-xs">{t('footer.tagline')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
