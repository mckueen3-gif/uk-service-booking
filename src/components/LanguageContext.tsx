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
 * 🚀 FIXED: Returns string/primitive on demand to prevent React rendering crashes.
 */
function createSafeDictionary(target: any, path: string = ''): any {
  const proxyTarget = target || {};

  return new Proxy(proxyTarget, {
    get(obj: any, prop) {
      if (prop === 'then') return undefined;
      
      // 🚀 REACT SAFETY: If React tries to render the proxy object directly,
      // we must return a string (empty or the path) to avoid "Objects are not valid as a React child" errors.
      if (prop === 'toString' || prop === Symbol.toPrimitive || prop === 'valueOf') {
        return () => ''; // Return empty string for safe rendering
      }

      // Handle common React/Next.js internals or JSON conversion
      if (prop === '$$typeof' || prop === 'toJSON') return undefined;
      
      const value = obj[prop];
      
      // If reading a property that doesn't exist, return a new safe dictionary proxy representing that path
      if (value === undefined) {
        // Handle common array methods to prevent crashes during iteration
        if (prop === 'map' || prop === 'filter' || prop === 'slice') {
          return () => [];
        }
        
        const fullPath = path ? `${path}.${String(prop)}` : String(prop);
        return createSafeDictionary({}, fullPath);
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
    // Helper to validate and set locale
    const safeSetLocale = (val: any) => {
      if (val && dictionaries[val as Locale]) {
        setLocaleState(val as Locale);
        return true;
      }
      return false;
    };

    // Phase 1: High-priority localStorage check
    const saved = typeof window !== 'undefined' ? localStorage.getItem('user-locale') : null;
    if (safeSetLocale(saved)) return;

    // Phase 2: Fallback to Cookie
    const cookieValue = typeof document !== 'undefined' ? document.cookie
      .split('; ')
      .find(row => row.startsWith('user-locale='))
      ?.split('=')[1] : undefined;
    if (safeSetLocale(cookieValue)) return;

    // Phase 3: Browser Auto-Detection
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      safeSetLocale(browserLang);
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
