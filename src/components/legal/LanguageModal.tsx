import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Check } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";
import { Locale, dictionaries } from "@/lib/i18n/dictionary";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { locale, setLocale, t } = useTranslation();
  const localesList = Object.keys(dictionaries) as Locale[];

  const languageNames: Record<string, string> = {
    'en': 'English',
    'zh-TW': '繁體中文',
    'hi': 'हिन्दी',
    'ar': 'العربية',
    'ja': '日本語',
    'ko': '한국어',
    'pl': 'Polski',
    'ro': 'Română',
    'ur': 'اردو',
    'pa': 'ਪੰਜਾਬੀ',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] print:hidden"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[201] pointer-events-none print:hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] w-full max-w-2xl overflow-hidden pointer-events-auto border border-slate-200"
            >
              {/* Header */}
              <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {t.legal.ui.selectLanguage}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">
                      Globalization Protocol
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Grid */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {localesList.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocale(loc);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all border ${
                        locale === loc
                          ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200"
                          : "bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200 hover:shadow-lg"
                      }`}
                    >
                      <span className="font-bold text-lg">{languageNames[loc] || loc}</span>
                      {locale === loc && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  {t.legal.ui.close}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
