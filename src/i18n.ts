
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en/translation.json';
import arTranslations from './locales/ar/translation.json';

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Default language
    fallbackLng: 'en',
    // Debug mode in development
    debug: import.meta.env.DEV,
    // Resources with translations
    resources: {
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      }
    },
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;

// Helper function to handle RTL/LTR text direction
export const setLanguageDirection = (language: string) => {
  // Set HTML direction attribute based on language
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  // Add language-specific class to body for CSS styling
  document.body.classList.remove('lang-en', 'lang-ar');
  document.body.classList.add(`lang-${language}`);
};
