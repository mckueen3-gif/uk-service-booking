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
 * 🚀 FIXED: Now returns a "Null Proxy" for missing keys to ensure total path safety.
 * This prevents "Cannot read property of undefined" crashes for deep access.
 */
function createSafeDictionary(target: any, path: string = ''): any {
  // If target is undefined, we return a "Null Proxy" that pretends to be a valid object
  const proxyTarget = target || {};

  return new Proxy(proxyTarget, {
    get(obj: any, prop) {
      // Internal React/Next.js and standard JS safety
      if (prop === 'toString' || prop === Symbol.toPrimitive || prop === 'valueOf') {
        return () => path || ''; 
      }
      if (prop === Symbol.iterator || prop === 'map' || prop === 'forEach' || prop === 'filter' || prop === 'reduce') {
        return Array.isArray(obj[prop]) ? obj[prop] : (obj[prop] === undefined ? [] : obj[prop]);
      }
      if (prop === '$$typeof' || prop === 'toJSON' || prop === 'then') return undefined;

      const value = obj[prop];
      
      // 🚀 TOTAL PATH SAFETY: If value is missing, return a recursive Null Proxy
      // instead of undefined. This allows t.missing.deep.path to resolve gracefully.
      if (value === undefined) {
        const fullPath = path ? `${path}.${String(prop)}` : String(prop);
        return createSafeDictionary(undefined, fullPath);
      }

      // If the value is an object, wrap it recursively
      if (value !== null && typeof value === 'object') {
        const fullPath = path ? `${path}.${String(prop)}` : String(prop);
        return createSafeDictionary(value, fullPath);
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
