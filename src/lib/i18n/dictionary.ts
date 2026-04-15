import { en } from './locales/en';
import { zhTW } from './locales/zh-TW';
import { ar } from './locales/ar';
import { ur } from './locales/ur';
import { hi } from './locales/hi';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { pa } from './locales/pa';
import { pl } from './locales/pl';
import { ro } from './locales/ro';
import { Dictionary, Locale } from './types';

export const dictionaries: Record<Locale, Dictionary> = {
  'en': en as unknown as Dictionary,
  'zh-TW': zhTW as unknown as Dictionary,
  'ar': ar as unknown as Dictionary,
  'ur': ur as unknown as Dictionary,
  'hi': hi as unknown as Dictionary,
  'ja': ja as unknown as Dictionary,
  'ko': ko as unknown as Dictionary,
  'pa': pa as unknown as Dictionary,
  'pl': pl as unknown as Dictionary,
  'ro': ro as unknown as Dictionary
};

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries['en'];
};

export type { Dictionary, Locale };
