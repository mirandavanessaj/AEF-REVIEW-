import React from 'react';
import {
  Compass,
  BookOpen,
  Award,
  Sparkles,
  Target,
  Crown,
  Trophy,
  Zap,
  Lock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { AchievementBadge, Language } from '../types';

interface BadgeItemProps {
  badge: AchievementBadge;
  language: Language;
  onNavigateToUnit?: (unit: 1 | 2 | 3) => void;
}

export const BadgeItem: React.FC<BadgeItemProps> = ({ badge, language, onNavigateToUnit }) => {
  const getIcon = (name: string, isUnlocked: boolean) => {
    const className = `w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 ${
      isUnlocked ? 'text-white drop-shadow-md' : 'text-slate-400'
    }`;

    switch (name) {
      case 'Compass':
        return <Compass className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getTierDetails = (tier: AchievementBadge['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) {
      return {
        bg: 'bg-slate-100 border-slate-200',
        ring: 'ring-1 ring-slate-200',
        badgeBg: 'bg-slate-200 border-slate-300',
        tagText: language === 'en' ? 'Locked' : 'Bloqueado',
        tagColor: 'bg-slate-200 text-slate-600',
        barColor: 'bg-slate-300',
      };
    }

    switch (tier) {
      case 'bronze':
        return {
          bg: 'bg-gradient-to-b from-amber-50/80 to-amber-100/40 border-amber-300 shadow-amber-100',
          ring: 'ring-1 ring-amber-300',
          badgeBg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 border-amber-500 shadow-md shadow-amber-700/20',
          tagText: language === 'en' ? 'Bronze' : 'Bronce',
          tagColor: 'bg-amber-100 text-amber-800 border-amber-300',
          barColor: 'bg-amber-600',
        };
      case 'silver':
        return {
          bg: 'bg-gradient-to-b from-slate-50 to-blue-50/40 border-slate-300 shadow-slate-100',
          ring: 'ring-1 ring-slate-300',
          badgeBg: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600 border-slate-300 shadow-md shadow-slate-500/20',
          tagText: language === 'en' ? 'Silver' : 'Plata',
          tagColor: 'bg-slate-100 text-slate-800 border-slate-300',
          barColor: 'bg-slate-500',
        };
      case 'gold':
        return {
          bg: 'bg-gradient-to-b from-yellow-50/80 to-amber-50/50 border-yellow-300 shadow-yellow-100',
          ring: 'ring-2 ring-yellow-400/50',
          badgeBg: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 border-yellow-300 shadow-lg shadow-yellow-500/30',
          tagText: language === 'en' ? 'Gold' : 'Oro',
          tagColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          barColor: 'bg-yellow-500',
        };
      case 'diamond':
        return {
          bg: 'bg-gradient-to-b from-cyan-50/90 via-blue-50/40 to-indigo-50/50 border-cyan-300 shadow-cyan-100',
          ring: 'ring-2 ring-cyan-400/60',
          badgeBg: 'bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-700 border-cyan-200 shadow-xl shadow-cyan-500/30',
          tagText: language === 'en' ? 'Diamond' : 'Diamante',
          tagColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
          barColor: 'bg-gradient-to-r from-cyan-500 to-blue-600',
        };
    }
  };

  const style = getTierDetails(badge.tier, badge.isUnlocked);

  const formattedDate = badge.unlockedAt
    ? new Date(badge.unlockedAt).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div
      id={`badge-card-${badge.id}`}
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between ${
        style.bg
      } ${style.ring} ${
        badge.isUnlocked
          ? 'hover:-translate-y-1 hover:shadow-md'
          : 'opacity-85 hover:opacity-100 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Header: Badge icon & Tier tag */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Digital Badge Medal */}
          <div className="relative">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
                style.badgeBg
              } ${badge.isUnlocked ? 'rotate-0 group-hover:rotate-6' : 'grayscale'}`}
            >
              {badge.isUnlocked ? (
                getIcon(badge.iconName, true)
              ) : (
                <div className="relative flex items-center justify-center">
                  {getIcon(badge.iconName, false)}
                  <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white p-1 rounded-full shadow-xs">
                    <Lock className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>

            {/* Unlocked Sparkle/Checkmark indicator */}
            {badge.isUnlocked && (
              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs border border-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Tier Badge & Unlock Date */}
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${
                style.tagColor
              }`}
            >
              {style.tagText}
            </span>

            {badge.isUnlocked && formattedDate ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </span>
            ) : (
              <span className="text-[11px] font-bold text-slate-500">
                {badge.progress}% {language === 'en' ? 'ready' : 'listo'}
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-tight mb-1">
          {badge.title[language]}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {badge.description[language]}
        </p>
      </div>

      {/* Bottom Progress Bar & Jump Button */}
      <div className="space-y-2 pt-2 border-t border-slate-200/60">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <span>
            {badge.isUnlocked
              ? language === 'en'
                ? 'Milestone Reached'
                : 'Meta Alcanzada'
              : `${badge.progress}% ${language === 'en' ? 'completed' : 'completado'}`}
          </span>
          <span className="font-mono">
            {badge.isUnlocked
              ? '100%'
              : `${badge.currentValue} / ${badge.targetValue}${
                  badge.targetPercentage ? '%' : ''
                }`}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              badge.isUnlocked ? 'bg-emerald-500' : style.barColor
            }`}
            style={{ width: `${badge.progress}%` }}
          />
        </div>

        {/* Optional quick jump to unit if locked */}
        {!badge.isUnlocked && badge.unit && onNavigateToUnit && (
          <button
            onClick={() => onNavigateToUnit(badge.unit as 1 | 2 | 3)}
            className="w-full mt-1 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-100/60 rounded-lg transition-colors cursor-pointer text-center"
          >
            {language === 'en'
              ? `Go to Unit ${badge.unit} Tasks →`
              : `Ir a Tareas de Unidad ${badge.unit} →`}
          </button>
        )}
      </div>
    </div>
  );
};
