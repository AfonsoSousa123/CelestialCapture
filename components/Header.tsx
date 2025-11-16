import React, { useState, useEffect } from 'react';
import { View } from '../types';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import ConfirmLogoutModal from './ConfirmLogoutModal';
import { useLocale } from '../contexts/LocaleContext';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLoginClick: () => void;
}

const NavLink: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ active, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-lg font-medium rounded-md transition-colors duration-300 ${
        active
          ? 'bg-purple-600 text-white shadow-lg'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, onLoginClick }) => {
  const { isAdmin, logout } = useAuth();
  const { t } = useLocale();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogoutConfirm = () => {
    logout();
    setIsLogoutModalOpen(false);
  };
  
  const createNavHandler = (view: View) => () => {
      setCurrentView(view);
      setIsMenuOpen(false);
  };

  const createAdminHandler = (action: () => void) => () => {
      action();
      setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm z-50 shadow-md shadow-purple-500/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="text-2xl font-bold text-white tracking-wider">
              {t('header.title')} <span className="text-purple-400">{t('header.titleHighlight')}</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 md:space-x-4">
            <NavLink
              active={currentView === View.GALLERY}
              onClick={() => setCurrentView(View.GALLERY)}
            >
              {t('header.gallery')}
            </NavLink>
            <NavLink
              active={currentView === View.STARGAZING}
              onClick={() => setCurrentView(View.STARGAZING)}
            >
              {t('header.stargazing')}
            </NavLink>
            <NavLink
              active={currentView === View.BLOG || currentView === View.BLOG_POST}
              onClick={() => setCurrentView(View.BLOG)}
            >
              {t('header.blog')}
            </NavLink>
            <div className="h-6 w-px bg-gray-600"></div>
            {isAdmin ? (
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-4 py-2 text-lg font-medium rounded-md transition-colors duration-300 text-gray-300 hover:bg-red-700 hover:text-white"
              >
                {t('header.logout')}
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 text-lg font-medium rounded-md transition-colors duration-300 text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {t('header.adminLogin')}
              </button>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-300 hover:text-white focus:outline-none"
                aria-label="Open menu"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-gray-900/95 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end p-4">
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="text-gray-400 hover:text-white" 
            aria-label="Close menu"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
            <NavLink active={currentView === View.GALLERY} onClick={createNavHandler(View.GALLERY)} className="w-full text-left">{t('header.gallery')}</NavLink>
            <NavLink active={currentView === View.STARGAZING} onClick={createNavHandler(View.STARGAZING)} className="w-full text-left">{t('header.stargazing')}</NavLink>
            <NavLink active={currentView === View.BLOG || currentView === View.BLOG_POST} onClick={createNavHandler(View.BLOG)} className="w-full text-left">{t('header.blog')}</NavLink>
            
            <hr className="border-gray-700" />

            {isAdmin ? (
                <button
                    onClick={createAdminHandler(() => setIsLogoutModalOpen(true))}
                    className="w-full text-left px-4 py-3 text-lg font-medium rounded-md transition-colors duration-300 text-gray-300 hover:bg-red-700 hover:text-white"
                >
                    {t('header.logout')}
                </button>
            ) : (
                <button
                    onClick={createAdminHandler(onLoginClick)}
                    className="w-full text-left px-4 py-3 text-lg font-medium rounded-md transition-colors duration-300 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                    {t('header.adminLogin')}
                </button>
            )}
            
            <div className="pt-4">
                <LanguageSwitcher />
            </div>
        </nav>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[59] backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {isLogoutModalOpen && (
        <ConfirmLogoutModal
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}
    </>
  );
};

export default Header;