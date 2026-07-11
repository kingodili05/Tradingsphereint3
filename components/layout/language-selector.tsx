'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'ru', label: 'Русский' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

function getCurrentLang(): string {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (match) {
    const parts = decodeURIComponent(match[1]).split('/');
    if (parts[2]) return parts[2];
  }
  return 'en';
}

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLang(getCurrentLang());

    // Load the Google Translate script once. The hidden element below hosts
    // the widget; our dropdown drives it via the googtrans cookie.
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            { pageLanguage: 'en', autoDisplay: false },
            'google_translate_element'
          );
        }
      };
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (code: string) => {
    setIsOpen(false);
    setLang(code);

    const host = window.location.hostname;
    const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

    if (code === 'en') {
      // Clear the translation cookie on every domain scope Google may have set
      document.cookie = `googtrans=; path=/; ${expire}`;
      document.cookie = `googtrans=; path=/; domain=${host}; ${expire}`;
      document.cookie = `googtrans=; path=/; domain=.${host}; ${expire}`;
    } else {
      const value = `/en/${code}`;
      document.cookie = `googtrans=${value}; path=/`;
      document.cookie = `googtrans=${value}; path=/; domain=${host}`;
      document.cookie = `googtrans=${value}; path=/; domain=.${host}`;
    }

    window.location.reload();
  };

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative notranslate" ref={containerRef}>
      <div id="google_translate_element" className="hidden" />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{current.code.split('-')[0]}</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-md shadow-lg z-50 py-1 max-h-80 overflow-y-auto"
          role="listbox"
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="option"
              aria-selected={l.code === lang}
              onClick={() => selectLanguage(l.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                l.code === lang ? 'font-semibold text-blue-600' : ''
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
