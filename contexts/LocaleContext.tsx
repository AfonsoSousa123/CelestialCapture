import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

type Locale = 'en' | 'pt-PT';
type Translations = Record<string, any>;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'celestial-capture-locale';

const getInitialLocale = (): Locale => {
  try {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (storedLocale === 'en' || storedLocale === 'pt-PT') {
      return storedLocale;
    }
  } catch (error) {
    console.error("Could not read locale from localStorage", error);
  }
  // Default to English if no valid locale is found
  return 'en';
};


const getNestedTranslation = (obj: Translations, key: string): string | undefined => {
    try {
        return key.split('.').reduce((o, i) => o[i], obj);
    } catch (e) {
        return undefined;
    }
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale());
  const [translations, setTranslations] = useState<Record<Locale, Translations> | null>(null);

  useEffect(() => {
    const loadTranslations = async () => {
        try {
            const [enResponse, ptResponse] = await Promise.all([
                fetch('./locales/en.json'),
                fetch('./locales/pt-PT.json')
            ]);
            if (!enResponse.ok || !ptResponse.ok) {
                throw new Error('Failed to fetch translation files');
            }
            const enData = await enResponse.json();
            const ptData = await ptResponse.json();
            setTranslations({ 'en': enData, 'pt-PT': ptData });
        } catch (error) {
            console.error("Error loading translations:", error);
            // Set empty to avoid crash, but log the error
            setTranslations({ 'en': {}, 'pt-PT': {} });
        }
    };
    loadTranslations();
  }, []);
  
  const setLocale = useCallback((newLocale: Locale) => {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
        console.error("Could not save locale to localStorage", error);
    }
    setLocaleState(newLocale);
  }, []);

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    if (!translations) {
        return key; // Return key as a fallback during loading
    }
    
    let translation = getNestedTranslation(translations[locale], key);

    if (translation === undefined) {
      // Fallback to English if translation is missing in the current locale
      translation = getNestedTranslation(translations['en'], key);
    }

    if (translation === undefined) {
      return key; // Fallback to the key itself if not found in any language
    }

    if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            const regex = new RegExp(`{{${rKey}}}`, 'g');
            translation = translation!.replace(regex, String(replacements[rKey]));
        });
    }
    return translation;
  }, [locale, translations]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};