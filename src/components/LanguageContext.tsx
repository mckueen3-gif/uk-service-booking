'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Dictionary, dictionaries } from '@/lib/i18n/dictionary';

interface LanguageContextType {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Initialize from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('user-locale') as Locale;
    if (savedLocale && dictionaries[savedLocale]) {
      setLocaleState(savedLocale);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') setLocaleState('zh-TW');
      else if (browserLang === 'hi') setLocaleState('hi');
      else if (browserLang === 'ar') setLocaleState('ar');
      else if (browserLang === 'ja') setLocaleState('ja');
      else if (browserLang === 'ko') setLocaleState('ko');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('user-locale', newLocale);
    // Update document dir and lang for SEO and accessibility
    document.documentElement.lang = newLocale;
    document.documentElement.dir = (newLocale === 'ar' || newLocale === 'ur') ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = (locale === 'ar' || locale === 'ur') ? 'rtl' : 'ltr';
  }, [locale]);

  const value = {
    locale,
    t: dictionaries[locale],
    setLocale,
    isRTL: locale === 'ar' || locale === 'ur'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
