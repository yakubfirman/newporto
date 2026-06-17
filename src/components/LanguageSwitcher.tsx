'use client';

import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import Script from 'next/script';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('id');

  useEffect(() => {
    // Check current language from cookie
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match && match[1]) {
      const lang = match[1].split('/')[2];
      if (lang) {
        setCurrentLang(lang);
      }
    }

    // Define global initialization function for Google Translate
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'id',
          includedLanguages: 'en,id',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };
  }, []);

  const switchLanguage = (lang: string) => {
    if (lang === 'id') {
      // Clear cookies to revert to original language (ID)
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      // Set cookie to translate from ID to EN
      document.cookie = `googtrans=/id/en; path=/;`;
      document.cookie = `googtrans=/id/en; path=/; domain=${window.location.hostname}`;
    }
    window.location.reload();
  };

  const toggleLanguage = () => {
    switchLanguage(currentLang === 'id' ? 'en' : 'id');
  };

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>

      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />

      <button
        onClick={toggleLanguage}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-white border-[4px] border-black px-4 py-3 comic-shadow hover:bg-primary hover:text-white transition-all hover:-translate-y-1 group"
        aria-label="Switch Language"
        style={{ borderRadius: '0', transform: 'rotate(-2deg)' }}
      >
        <Languages
          size={24}
          strokeWidth={3}
          className="group-hover:rotate-12 transition-transform"
        />
        <span className="comic-heading text-xl font-bold tracking-wider">
          {currentLang === 'id' ? 'ID' : 'EN'}
        </span>
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Hide Google Translate UI elements */
        .skiptranslate iframe {
          display: none !important;
        }
        body {
          top: 0px !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important; 
          box-shadow: none !important;
        }
      `,
        }}
      />
    </>
  );
}
