'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Locale, Dictionary, dictionaries, getDictionary } from '@/lib/i18n/dictionary';

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
/**
 * Creates a recursive proxy that handles missing translation keys gracefully.
 * 🚀 FIXED: Now accepts a fallback dictionary (usually English) to ensure 
 * that missing keys in other languages display English content instead of raw paths.
 */
function createSafeDictionary(target: any, fallback: any = {}, path: string = ''): any {
  // We use dummy objects for undefined targets
  const proxyTarget = target || {};
  const proxyFallback = fallback || {};

  return new Proxy(proxyTarget, {
    get(obj: any, prop) {
      // Internal React/Next.js and standard JS safety
      if (prop === 'toString' || prop === Symbol.toPrimitive || prop === 'valueOf') {
        const val = obj[prop] || proxyFallback[prop];
        if (typeof val === 'function') return val.bind(obj);
        return () => val || path || ''; 
      }
      
      if (prop === Symbol.iterator || prop === 'map' || prop === 'forEach' || prop === 'filter' || prop === 'reduce') {
        const val = obj[prop] !== undefined ? obj[prop] : proxyFallback[prop];
        return Array.isArray(val) ? val : (val === undefined ? [] : val);
      }

      // Next.js/React internals
      if (prop === '$$typeof' || prop === 'toJSON' || prop === 'then') return obj[prop];

      const value = obj[prop];
      const fallbackValue = proxyFallback[prop];
      const fullPath = path ? `${path}.${String(prop)}` : String(prop);

      // 1. If we found a value that is NOT an object (string, number, boolean), return it
      if (value !== undefined && value !== null && typeof value !== 'object') {
        return value;
      }

      // 2. If the value is missing but we have a fallback string/primitive, return it
      if (value === undefined && fallbackValue !== undefined && typeof fallbackValue !== 'object') {
        return fallbackValue;
      }

      // 3. If we found an object in either target or fallback, wrap it recursively
      if ((value !== undefined && typeof value === 'object') || (fallbackValue !== undefined && typeof fallbackValue === 'object')) {
        return createSafeDictionary(value, fallbackValue, fullPath);
      }

      // 4. Final fallback: return a recursive Proxy for the missing path
      return createSafeDictionary(undefined, undefined, fullPath);
    }
  });
}

export function LanguageProvider({ children, initialLocale = 'en' }: { children: React.ReactNode, initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

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
    t: createSafeDictionary(getDictionary(locale), getDictionary('en')),
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
