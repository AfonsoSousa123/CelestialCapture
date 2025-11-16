import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import enData from '../locales/en.json';
import ptData from '../locales/pt-PT.json';

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
    return 'en';
};

const getNestedTranslation = (obj: Translations | undefined, key: string): string | undefined => {
    if (!obj) return undefined;
    return key.split('.').reduce((o: any, i: string) => (o && typeof o === 'object' ? o[i] : undefined), obj);
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale());
    const [translations, setTranslations] = useState<Record<Locale, Translations> | null>(null);

    useEffect(() => {
        // Use static imports so JSON is bundled and cannot return HTML in production
        setTranslations({ 'en': enData as Translations, 'pt-PT': ptData as Translations });
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
            return key;
        }

        let translation = getNestedTranslation(translations[locale], key);

        if (translation === undefined) {
            translation = getNestedTranslation(translations['en'], key);
        }

        if (translation === undefined) {
            return key;
        }

        if (typeof translation === 'string' && replacements) {
            Object.keys(replacements).forEach(rKey => {
                const regex = new RegExp(`{{${rKey}}}`, 'g');
                translation = (translation as string).replace(regex, String(replacements[rKey]));
            });
        }
        return String(translation);
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