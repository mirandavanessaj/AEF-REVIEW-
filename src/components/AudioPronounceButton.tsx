import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeech, subscribeSpeech } from '../utils/speech';
import { Language } from '../types';

export interface AudioPronounceButtonProps {
  text: string;
  language?: Language;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'pill' | 'subtle' | 'primary' | 'badge';
  label?: string;
  showSlowToggle?: boolean;
  className?: string;
  title?: string;
  stopPropagation?: boolean;
}

export const AudioPronounceButton: React.FC<AudioPronounceButtonProps> = ({
  text,
  language = 'en',
  size = 'sm',
  variant = 'icon',
  label,
  showSlowToggle = false,
  className = '',
  title,
  stopPropagation = true,
}) => {
  const [isSpeakingThis, setIsSpeakingThis] = useState(false);
  const [playSlow, setPlaySlow] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSpeech((speakingText) => {
      setIsSpeakingThis(speakingText === text);
    });
    return unsubscribe;
  }, [text]);

  const handlePlay = (e: React.MouseEvent, forceSlow?: boolean) => {
    if (stopPropagation) {
      e.stopPropagation();
    }

    const useSlow = forceSlow !== undefined ? forceSlow : playSlow;

    if (isSpeakingThis && forceSlow === undefined) {
      stopSpeech();
    } else {
      speakText(text, {
        rate: useSlow ? 0.65 : 0.88,
      });
    }
  };

  const handleSlowToggle = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    const nextSlow = !playSlow;
    setPlaySlow(nextSlow);
    // Play immediately in slow mode
    speakText(text, {
      rate: nextSlow ? 0.65 : 0.88,
    });
  };

  const defaultTitle =
    title ||
    (isSpeakingThis
      ? language === 'en'
        ? 'Click to stop audio'
        : 'Clic para detener el audio'
      : playSlow
      ? language === 'en'
        ? `Listen at slow speed: "${text}"`
        : `Escuchar a velocidad lenta: "${text}"`
      : language === 'en'
      ? `Listen to pronunciation: "${text}"`
      : `Escuchar pronunciación: "${text}"`);

  // Icon sizing
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  // Base button styles per variant
  let buttonClasses = '';
  if (variant === 'icon') {
    const sizePadding = {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
    }[size];

    buttonClasses = `${sizePadding} rounded-full transition-all cursor-pointer flex items-center justify-center ${
      isSpeakingThis
        ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-300 animate-pulse'
        : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 active:scale-95'
    }`;
  } else if (variant === 'pill') {
    const sizePadding = {
      xs: 'px-2 py-0.5 text-[10px]',
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-xs sm:text-sm',
      lg: 'px-4 py-2 text-sm',
    }[size];

    buttonClasses = `${sizePadding} rounded-full border transition-all cursor-pointer inline-flex items-center gap-1.5 font-medium ${
      isSpeakingThis
        ? 'bg-blue-600 border-blue-700 text-white shadow-xs animate-pulse'
        : 'bg-white hover:bg-blue-50/80 text-blue-700 border-blue-200 hover:border-blue-300 shadow-2xs active:scale-95'
    }`;
  } else if (variant === 'primary') {
    const sizePadding = {
      xs: 'px-2.5 py-1 text-xs',
      sm: 'px-3 py-1.5 text-xs sm:text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    }[size];

    buttonClasses = `${sizePadding} rounded-xl font-semibold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs active:scale-95 ${
      isSpeakingThis
        ? 'bg-blue-700 text-white ring-2 ring-blue-400 animate-pulse'
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`;
  } else if (variant === 'badge') {
    buttonClasses = `px-2 py-0.5 text-[11px] rounded-md font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
      isSpeakingThis
        ? 'bg-blue-600 text-white'
        : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60'
    }`;
  } else {
    // subtle
    buttonClasses = `inline-flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors ${
      isSpeakingThis
        ? 'text-blue-700 font-bold'
        : 'text-slate-500 hover:text-blue-700'
    }`;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={(e) => handlePlay(e)}
        className={buttonClasses}
        title={defaultTitle}
        aria-label={defaultTitle}
      >
        {isSpeakingThis ? (
          <div className="flex items-center gap-1">
            <Volume2 className={`${iconSizeClasses} shrink-0 animate-bounce`} />
            {/* Animated audio wave bars */}
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1.5 bg-current animate-pulse"></span>
              <span className="w-0.5 h-3 bg-current animate-pulse delay-75"></span>
              <span className="w-0.5 h-2 bg-current animate-pulse delay-150"></span>
            </span>
          </div>
        ) : (
          <Volume2 className={`${iconSizeClasses} shrink-0`} />
        )}

        {label && <span>{label}</span>}
        {isSpeakingThis && !label && variant === 'pill' && (
          <span>{language === 'en' ? 'Playing...' : 'Reproduciendo...'}</span>
        )}
      </button>

      {/* Optional Slow Audio Button for pronunciation training */}
      {showSlowToggle && (
        <button
          type="button"
          onClick={handleSlowToggle}
          className={`px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors cursor-pointer flex items-center gap-0.5 ${
            playSlow
              ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
          }`}
          title={
            language === 'en'
              ? 'Listen at slower speed (0.65x) for pronunciation clarity'
              : 'Escuchar más lento (0.65x) para practicar la pronunciación'
          }
        >
          <span>🐢</span>
          <span className="hidden sm:inline">
            {language === 'en' ? 'Slow' : 'Lento'}
          </span>
        </button>
      )}
    </div>
  );
};
