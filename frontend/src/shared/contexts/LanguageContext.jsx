import { createContext, useContext, useState } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('language') || 'vi';
  });

  const changeLanguage = (lang) => {
    setLocale(lang);
    localStorage.setItem('language', lang);
  };

  const t = (keyStr, params = {}) => {
    const keys = keyStr.split('.');
    let current = translations[locale];
    
    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        return keyStr;
      }
      current = current[key];
    }

    if (typeof current === 'string') {
      let result = current;
      Object.keys(params).forEach((paramKey) => {
        result = result.replace(`{${paramKey}}`, params[paramKey]);
      });
      return result;
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
