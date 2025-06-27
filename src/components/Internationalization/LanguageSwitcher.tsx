import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  rtl?: boolean;
}

interface LanguageSwitcherProps {
  onLanguageChange: (language: string) => void;
  currentLanguage?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  onLanguageChange,
  currentLanguage = 'en'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(currentLanguage);

  useEffect(() => {
    setSelected(currentLanguage);
  }, [currentLanguage]);

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === selected) || languages[0];

  const handleSelectLanguage = (code: string) => {
    setSelected(code);
    onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">{selectedLanguage.flag} {selectedLanguage.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            >
              <div className="py-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleSelectLanguage(language.code)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors duration-200 ${
                      language.rtl ? 'text-right' : ''
                    }`}
                    dir={language.rtl ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">{language.flag}</span>
                      <span>{language.name}</span>
                    </div>
                    {selected === language.code && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;