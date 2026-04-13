import { en } from './locales/en';
import { zhTW } from './locales/zh-TW';
import { Dictionary } from './types';

export type Locale = 'en' | 'zh-TW' | 'ar' | 'ur';

export const dictionaries: Record<Locale, Dictionary> = {
  'en': en as unknown as Dictionary,
  'zh-TW': zhTW as unknown as Dictionary,
  'ar': en as unknown as Dictionary,
  'ur': en as unknown as Dictionary
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries['en'];
};

export type { Dictionary };
