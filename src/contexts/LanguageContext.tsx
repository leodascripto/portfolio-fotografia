// src/contexts/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Translation, getTranslation } from '@/lib/i18n';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translation;
  isLanguageSelected: boolean;
  setIsLanguageSelected: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('pt');
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);
  const [t, setT] = useState<Translation>(getTranslation('pt'));

  useEffect(() => {
    // Verificar se já existe um idioma salvo
    const savedLanguage = localStorage.getItem('leooli-language');
    const languageSelected = localStorage.getItem('leooli-language-selected');
    
    if (savedLanguage && languageSelected === 'true') {
      setLanguageState(savedLanguage);
      setIsLanguageSelected(true);
      setT(getTranslation(savedLanguage));
    } else {
      // Detectar idioma do browser como fallback
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = ['pt', 'en', 'ja'].includes(browserLang) ? browserLang : 'pt';
      setLanguageState(supportedLang);
      setT(getTranslation(supportedLang));
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    setT(getTranslation(lang));
    localStorage.setItem('leooli-language', lang);
  };

  const handleLanguageSelected = (selected: boolean) => {
    setIsLanguageSelected(selected);
    localStorage.setItem('leooli-language-selected', selected.toString());
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isLanguageSelected,
        setIsLanguageSelected: handleLanguageSelected
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};