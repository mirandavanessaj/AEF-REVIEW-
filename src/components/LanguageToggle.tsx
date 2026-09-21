import React from 'react';
import { Languages } from 'lucide-react';
import { Language } from '../types';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, onToggle }) => {
  return (
    <button
      id="language-toggle-btn"
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
      title={language === 'en' ? 'Click for Spanish explanations' : 'Haz clic para explicaciones en inglés'}
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <div className="flex items-center text-xs font-semibold">
        <span className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
          EN
        </span>
        <span className="text-slate-300 dark:text-slate-600 mx-0.5">/</span>
        <span className={`px-1.5 py-0.5 rounded ${language === 'es' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>
          ES
        </span>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
        {language === 'en' ? 'Help in ES' : 'Ayuda en ES'}
      </span>
    </button>
  );
};
