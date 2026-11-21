import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../i18n/locales/en/translations';
import { ar } from '../i18n/locales/ar/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state: dark / light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('wahaj_theme') || 'dark';
  });

  // Language state: 'en' / 'ar'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('wahaj_lang') || 'en';
  });

  // Active search query
  const [searchQuery, setSearchQuery] = useState('');

  // Selected investigation for modal or detail view
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);

  // Sync theme to HTML class
  useEffect(() => {
    localStorage.setItem('wahaj_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync language to HTML dir attribute
  useEffect(() => {
    localStorage.setItem('wahaj_lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const t = lang === 'ar' ? ar : en;

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        toggleLanguage,
        t,
        searchQuery,
        setSearchQuery,
        selectedInvestigation,
        setSelectedInvestigation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
