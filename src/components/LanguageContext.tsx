'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Locale, Dictionary, dictionaries } from '@/lib/i18n/dictionary';

interface LanguageContextType {
  locale: Locale;
  t: Dictionary;
  format: (template: string, params: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Helper to replace {{var}} or {var} in strings
 */
export const interpolate = (str: string, params: Record<string, string | number>) => {
  if (!str) return "";
  return Object.entries(params).reduce((acc, [key, val]) => {
    // Handle both {{key}} and {key}
    const regex = new RegExp(`(\\{\\{${key}\\}\\}|\\{${key}\\})`, 'g');
    return acc.replace(regex, val.toString());
  }, str);
};

/**
 * Creates a recursive proxy that handles missing translation keys gracefully.
 * t.any.path.not.exist -> returns "" (empty string) instead of crashing.
 */
function createSafeDictionary(target: any, path: string = ''): any {
  // Use a plain object target for better compatibility
  const proxyTarget = target || {};

  return new Proxy(proxyTarget, {
    get(obj: any, prop) {
      if (prop === 'then') return undefined;
      
      // Handle rendering/string conversion
      if (prop === 'toString' || prop === Symbol.toPrimitive || prop === 'valueOf') {
        return () => '';
      }
      
      const value = obj[prop];
      
      // If reading a property that doesn't exist, return a new safe dictionary
      if (value === undefined) {
        // Handle common array methods to prevent crashes during iteration
        if (prop === 'map' || prop === 'filter' || prop === 'slice') {
          return () => [];
        }
        return createSafeDictionary({}, path ? `${path}.${String(prop)}` : String(prop));
      }

      // If the value is an object, wrap it recursively
      if (value !== null && typeof value === 'object') {
        return createSafeDictionary(value, path ? `${path}.${String(prop)}` : String(prop));
      }

      return value;
    }
  });
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Phase 1: High-priority localStorage check
    const saved = typeof window !== 'undefined' ? localStorage.getItem('user-locale') as Locale : null;
    
    if (saved && dictionaries[saved]) {
      setLocaleState(saved);
      return;
    } 

    // Phase 2: Fallback to Cookie
    const cookieValue = typeof document !== 'undefined' ? document.cookie
      .split('; ')
      .find(row => row.startsWith('user-locale='))
      ?.split('=')[1] as Locale : undefined;
    
    if (cookieValue && dictionaries[cookieValue]) {
      setLocaleState(cookieValue);
      return;
    }

    // Phase 3: Browser Auto-Detection (Smart Fallback)
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0] as Locale;
      if (dictionaries[browserLang]) {
        setLocaleState(browserLang);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('user-locale', newLocale);
    
    // Set cookie for Server Components (expires in 1 year)
    document.cookie = `user-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
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
    t: createSafeDictionary(dictionaries[locale]),
    format: interpolate,
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
