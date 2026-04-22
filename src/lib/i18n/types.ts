export type Dictionary = {
  (path: string, options?: any): string;
  [key: string]: any;
};

export type Locale = 'en' | 'zh-TW' | 'ar' | 'ur' | 'hi' | 'ja' | 'ko' | 'pa' | 'pl' | 'ro';
