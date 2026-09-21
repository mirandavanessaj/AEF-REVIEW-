import React, { useState, useMemo } from 'react';
import { Trophy, Award, Sparkles, Filter, CheckCircle2, Lock, Shield, Star, Zap, Crown } from 'lucide-react';
import { Language, UnitNumber } from '../types';
import { useProgress } from '../context/ProgressContext';
import { BadgeItem } from './BadgeItem';

interface AchievementsViewProps {
  language: Language;
  onSelectUnit?: (unit: UnitNumber) => void;
  onNavigateToExercises?: () => void;
  onNavigateToQuizzes?: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  language,
  onSelectUnit,
  onNavigateToExercises,
  onNavigateToQuizzes,
}) => {
  const { badges, unlockedBadgesCount, totalBadgesCount } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');

  const completionPercentage = totalBadgesCount > 0 ? Math.round((unlockedBadgesCount / totalBadgesCount) * 100) : 0;

  // Student Rank based on badges unlocked
  const studentRank = useMemo(() => {
    if (unlockedBadgesCount >= 12) {
      return {
        title: language === 'en' ? 'English File Master' : 'Maestro English File',
        level: language === 'en' ? 'Master Rank IV' : 'Rango Maestro IV',
        icon: Crown,
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      };
    }
    if (unlockedBadgesCount >= 8) {
      return {
        title: language === 'en' ? 'Grammar Scholar' : 'Estudiante Avanzado',
        level: language === 'en' ? 'Scholar Rank III' : 'Rango Avanzado III',
        icon: Award,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      };
    }
    if (unlockedBadgesCount >= 4) {
      return {
        title: language === 'en' ? 'Active Explorer' : 'Explorador Activo',
        level: language === 'en' ? 'Explorer Rank II' : 'Rango Explorador II',
        icon: Star,
        color: 'text-blue-600 bg-blue-50 border-blue-200',
      };
    }
    return {
      title: language === 'en' ? 'Beginner Apprentice' : 'Aprendiz Inicial',
      level: language === 'en' ? 'Apprentice Rank I' : 'Rango Aprendiz I',
      icon: Sparkles,
      color: 'text-slate-600 bg-slate-50 border-slate-200',
    };
  }, [unlockedBadgesCount, language]);

  const categories = [
    { id: 'all', label: language === 'en' ? 'All Badges' : 'Todos los Logros' },
    { id: 'unit1', label: language === 'en' ? 'Unit 1 Milestones' : 'Metas Unidad 1' },
    { id: 'unit2', label: language === 'en' ? 'Unit 2 Milestones' : 'Metas Unidad 2' },
    { id: 'unit3', label: language === 'en' ? 'Unit 3 Milestones' : 'Metas Unidad 3' },
    { id: 'overall', label: language === 'en' ? 'Course Milestones' : 'Metas del Curso' },
    { id: 'mastery', label: language === 'en' ? 'Mastery Challenges' : 'Desafíos de Maestría' },
  ];

  const filteredBadges = useMemo(() => {
    return badges.filter((b) => {
      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (filterStatus === 'unlocked' && !b.isUnlocked) return false;
      if (filterStatus === 'locked' && b.isUnlocked) return false;
      return true;
    });
  }, [badges, selectedCategory, filterStatus]);

  const RankIcon = studentRank.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner: Rank, Summary & Progress Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Ambient background lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Achievements & Milestones' : 'Logros y Metas'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {language === 'en' ? 'Digital Study Badges' : 'Insignias Digitales de Estudio'}
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {language === 'en'
                ? 'Earn digital medals as you advance through Units 1 to 3. Reach 25%, 50%, and 100% completion per unit, solve interactive grammar drills, and conquer practice exams.'
                : 'Gana medallas digitales a medida que avanzas en las Unidades 1 a 3. Alcanza el 25%, 50% y 100% de cada unidad, resuelve ejercicios interactivos y domina los exámenes de prueba.'}
            </p>
          </div>

          {/* Student Level & Badge Counter Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 min-w-[260px] sm:min-w-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Current Rank' : 'Rango Actual'}
                </span>
                <h4 className="text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                  <RankIcon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{studentRank.title}</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Unlocked' : 'Desbloqueados'}
                </span>
                <p className="text-xl font-black text-amber-400 font-mono">
                  {unlockedBadgesCount} / {totalBadgesCount}
                </p>
              </div>
            </div>

            {/* Total badges progress bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1.5">
                <span>{language === 'en' ? 'Completion' : 'Completitud'}</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status toggles: All, Unlocked, Locked */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'All' : 'Todos'} ({badges.length})
          </button>
          <button
            onClick={() => setFilterStatus('unlocked')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterStatus === 'unlocked'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? 'Unlocked' : 'Desbloqueados'}</span> ({unlockedBadgesCount})
          </button>
          <button
            onClick={() => setFilterStatus('locked')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              filterStatus === 'locked'
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'Locked' : 'Bloqueados'}</span> ({totalBadgesCount - unlockedBadgesCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBadges.map((badge) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              language={language}
              onNavigateToUnit={(unit) => {
                if (onSelectUnit) onSelectUnit(unit);
                if (onNavigateToExercises) onNavigateToExercises();
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">
            {language === 'en' ? 'No badges match this filter' : 'No hay insignias con este filtro'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Try selecting a different category or status above.'
              : 'Intenta seleccionar otra categoría o estado arriba.'}
          </p>
        </div>
      )}

      {/* Quick Action Study Tips Banner */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'en' ? 'How to Earn More Badges?' : '¿Cómo Ganar Más Insignias?'}
            </h4>
            <p className="text-xs text-slate-600">
              {language === 'en'
                ? 'Complete exercises in the Exercises tab and take practice quizzes to automatically unlock 25%, 50%, and 100% unit badges!'
                : '¡Completa ejercicios en la pestaña Ejercicios y haz exámenes de prueba para desbloquear automáticamente insignias del 25%, 50% y 100%!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onNavigateToExercises && (
            <button
              onClick={onNavigateToExercises}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              {language === 'en' ? 'Practice Exercises' : 'Practicar Ejercicios'}
            </button>
          )}
          {onNavigateToQuizzes && (
            <button
              onClick={onNavigateToQuizzes}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
            >
              {language === 'en' ? 'Take Quizzes' : 'Hacer Exámenes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
