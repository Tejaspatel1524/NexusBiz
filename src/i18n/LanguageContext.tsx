import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Language, TranslationKey } from './translations';
import { translations, languageNames } from './translations';


interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: TranslationKey) => string;
    languageNames: typeof languageNames;
    availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'nexusbiz-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        // Try to get saved language from localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved in translations) {
            return saved as Language;
        }
        // Try browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang in translations) {
            return browserLang as Language;
        }
        return 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(STORAGE_KEY, lang);
        // Update document language attribute
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const t = (key: TranslationKey): string => {
        return translations[language]?.[key] || translations.en[key] || key;
    };

    const availableLanguages: Language[] = ['en', 'es', 'fr', 'de', 'ja'];

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            t,
            languageNames,
            availableLanguages
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export { type Language, type TranslationKey };
