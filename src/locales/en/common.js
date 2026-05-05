import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files trực tiếp
import enTranslations from './locales/en/common.json';
import viTranslations from './locales/vi/common.json';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        lng: 'en',
        supportedLngs: ['en', 'vi'],
        defaultNS: 'common',
        ns: ['common'],
        resources: {
            en: {
                common: enTranslations
            },
            vi: {
                common: viTranslations
            }
        },
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

i18n.on('languageChanged', (lng) => {
    console.log('Language changed to:', lng);
    localStorage.setItem('language', lng);
});

export default i18n;