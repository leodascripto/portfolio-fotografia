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

  // ✅ Carrega idioma salvo no localStorage
  useEffect(() => {
    console.log('🌐 Inicializando LanguageContext...');
    
    try {
      const savedLanguage = localStorage.getItem('leooli-language');
      const languageSelected = localStorage.getItem('leooli-language-selected');
      
      console.log('💾 Idioma salvo:', savedLanguage);
      console.log('✓ Foi selecionado?', languageSelected);
      
      if (savedLanguage && languageSelected === 'true') {
        console.log('✅ Restaurando idioma:', savedLanguage);
        setLanguageState(savedLanguage);
        setIsLanguageSelected(true);
        setT(getTranslation(savedLanguage));
      } else {
        // Detectar idioma do browser
        const browserLang = navigator.language.split('-')[0];
        const supportedLang = ['pt', 'en', 'ja'].includes(browserLang) ? browserLang : 'pt';
        console.log('🌍 Idioma detectado do browser:', supportedLang);
        setLanguageState(supportedLang);
        setT(getTranslation(supportedLang));
      }
    } catch (error) {
      console.error('❌ Erro ao carregar idioma:', error);
      setLanguageState('pt');
      setT(getTranslation('pt'));
    }
  }, []);

  // ✅ Atualiza idioma e salva no localStorage
  const setLanguage = (lang: string) => {
    console.log('🔄 Mudando idioma para:', lang);
    
    try {
      const newTranslation = getTranslation(lang);
      setLanguageState(lang);
      setT(newTranslation);
      
      // Salva no localStorage
      localStorage.setItem('leooli-language', lang);
      localStorage.setItem('leooli-language-selected', 'true');
      
      console.log('✅ Idioma atualizado:', lang);
      console.log('📝 Tradução:', newTranslation);
    } catch (error) {
      console.error('❌ Erro ao mudar idioma:', error);
    }
  };

  // ✅ Marca idioma como selecionado
  const handleLanguageSelected = (selected: boolean) => {
    console.log('📌 Idioma selecionado:', selected);
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