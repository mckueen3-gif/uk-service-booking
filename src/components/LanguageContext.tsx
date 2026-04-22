'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Locale, Dictionary, dictionaries, getDictionary } from '@/lib/i18n/dictionary';
import { interpolate } from '@/lib/i18n/interpolate';

interface LanguageContextType {
  locale: Locale;
  language: Locale; // Alias for backward compatibility
  t: Dictionary;
  format: (template: string, params: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


/**
 * Creates a recursive proxy that handles missing translation keys gracefully.
 * 🚀 FIXED: Now accepts a fallback dictionary (usually English) to ensure 
 * that missing keys in other languages display English content instead of raw paths.
 * 
 * 🛡️ ULTRA-SAFETY: Added React rendering protection. If a developer accidentally
 * renders a translation branch (a Proxy) instead of a leaf (a string), 
 * the Proxy now informs React it is a valid element (a span) instead of crashing.
 */
function createSafeDictionary(target: any, fallback: any = {}, path: string = ''): any {
  // 🚀 FIXED: We use a function decoy as the Proxy target to enable the 'apply' trap (callability).
  const proxyTarget = function() {};
  
  // Storage for the actual dictionary data
  const data = target || {};
  const proxyFallback = fallback || {};

  return new Proxy(proxyTarget, {
    get(_, prop) {
      // 1. Internal React/Next.js and standard JS safety
      if (prop === 'toString' || prop === Symbol.toPrimitive || prop === 'valueOf') {
        const val = data[prop] || proxyFallback[prop];
        if (typeof val === 'function') return val.bind(data);
        return () => val || path || ''; 
      }
      
      // 2. React child safety: If React tries to render this object directly, 
      // we tell it we are a <span> element displaying the path.
      if (prop === '$$typeof') return data[prop] || (typeof Symbol !== 'undefined' ? Symbol.for('react.element') : 0xeac7);
      if (prop === 'type') return data[prop] || 'span';
      if (prop === 'props') return data[prop] || { 
        children: path || '...', 
        style: { color: '#ef4444', fontWeight: 'bold' },
        title: 'I18n Path Error'
      };
      if (prop === 'ref') return data[prop] || null;
      if (prop === 'key') return data[prop] || null;

      // 3. Collection methods
      if (prop === Symbol.iterator || prop === 'map' || prop === 'forEach' || prop === 'filter' || prop === 'reduce') {
        const val = data[prop] !== undefined ? data[prop] : proxyFallback[prop];
        return Array.isArray(val) ? val : (val === undefined ? [] : val);
      }

      // 4. Next.js/React standard internals
      if (prop === 'toJSON' || prop === 'then') return data[prop];

      const value = data[prop];
      const fallbackValue = proxyFallback[prop];
      const fullPath = path ? `${path}.${String(prop)}` : String(prop);

      // 5. If we found a value that is NOT an object (string, number, boolean), return it
      if (value !== undefined && value !== null && typeof value !== 'object') {
        return value;
      }

      // 6. If the value is missing but we have a fallback string/primitive in English, return it
      if (value === undefined && fallbackValue !== undefined && typeof fallbackValue !== 'object') {
        return fallbackValue;
      }

      // 7. If we found an actual object (branch) in the current dictionary, wrap it recursively
      if (value !== undefined && value !== null && typeof value === 'object') {
        return createSafeDictionary(value, fallbackValue, fullPath);
      }

      // 8. If the fallback also has an object, but target doesn't, wrap empty target
      if (fallbackValue !== undefined && typeof fallbackValue === 'object') {
        return createSafeDictionary(undefined, fallbackValue, fullPath);
      }

      // 🚀 CRITICAL FIX: If BOTH are missing, return the path STRING.
      return fullPath;
    },
    // 🚀 NEW: Handle calling t('path.to.key') or t('Hardcoded String')
    apply(_, thisArg, argumentsList) {
      const input = argumentsList[0];
      const options = argumentsList[1];
      if (typeof input !== 'string') return path || '';

      let result = '';

      // Try to resolve as a nested path
      const parts = input.split('.');
      let current = data;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          current = undefined;
          break;
        }
      }

      if (typeof current === 'string') {
        result = current;
      } else {
        // Try fallback dictionary
        let fCurrent = proxyFallback;
        for (const part of parts) {
          if (fCurrent && typeof fCurrent === 'object' && part in fCurrent) {
            fCurrent = fCurrent[part];
          } else {
            fCurrent = undefined;
            break;
          }
        }

        if (typeof fCurrent === 'string') {
          result = fCurrent;
        } else {
          // If not a path, assume it's a literal string (standard fallback)
          result = input;
        }
      }

      // Apply interpolation if options are provided
      if (options && typeof options === 'object') {
        return interpolate(result, options);
      }

      return result;
    }
  });
}

export function LanguageProvider({ children, initialLocale = 'en' }: { children: React.ReactNode, initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

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

    // 🚀 CRITICAL: Force Next.js to re-fetch Server Components with the new cookie
    router.refresh();
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = (locale === 'ar' || locale === 'ur') ? 'rtl' : 'ltr';
  }, [locale]);

  const value = {
    locale,
    language: locale, // Alias
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
