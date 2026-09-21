import React, { useEffect } from 'react';
import { Award, X, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import { AchievementBadge, Language } from '../types';

interface AchievementToastProps {
  badge: AchievementBadge | null;
  language: Language;
  onClose: () => void;
  onViewAchievements: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  badge,
  language,
  onClose,
  onViewAchievements,
}) => {
  useEffect(() => {
    if (badge) {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [badge, onClose]);

  if (!badge) return null;

  const getTierColor = (tier: AchievementBadge['tier']) => {
    switch (tier) {
      case 'diamond':
        return 'from-cyan-500 via-blue-600 to-indigo-700 border-cyan-300 text-white';
      case 'gold':
        return 'from-amber-400 via-yellow-500 to-amber-600 border-yellow-300 text-amber-950';
      case 'silver':
        return 'from-slate-300 via-slate-400 to-slate-500 border-slate-200 text-white';
      default:
        return 'from-amber-600 to-amber-700 border-amber-400 text-white';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-amber-400/80 relative overflow-hidden">
        {/* Background glow & sparkles */}
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-blue-500/20 rounded-full blur-lg pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          {/* Badge Medal Emblem */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierColor(
              badge.tier
            )} border-2 flex items-center justify-center shrink-0 shadow-lg`}
          >
            <Trophy className="w-6 h-6 text-white drop-shadow" />
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-black uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              <span>
                {language === 'en' ? 'Achievement Unlocked!' : '¡Logro Desbloqueado!'}
              </span>
            </div>

            <h4 className="font-extrabold text-sm sm:text-base text-white leading-tight">
              {badge.title[language]}
            </h4>

            <p className="text-xs text-slate-300 mt-1 leading-snug line-clamp-2">
              {badge.description[language]}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onViewAchievements();
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>{language === 'en' ? 'View All Badges' : 'Ver Todos los Logros'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
