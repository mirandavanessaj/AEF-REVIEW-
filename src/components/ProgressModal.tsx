import React, { useState } from 'react';
import { X, CheckCircle2, Award, RotateCcw, BarChart2, BookOpen, CheckSquare, Sparkles } from 'lucide-react';
import { Language, UnitNumber } from '../types';
import { useProgress } from '../context/ProgressContext';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectUnit?: (unit: UnitNumber) => void;
  onViewAchievements?: () => void;
}

export const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectUnit,
  onViewAchievements,
}) => {
  const { unitProgressMap, overallProgress, resetAllProgress, badges, unlockedBadgesCount, totalBadgesCount } = useProgress();
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const getStatusBadge = (percentage: number) => {
    if (percentage === 100) {
      return {
        label: language === 'en' ? 'Mastered' : 'Dominado',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    if (percentage >= 70) {
      return {
        label: language === 'en' ? 'Proficient' : 'Avanzado',
        bg: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    }
    if (percentage > 0) {
      return {
        label: language === 'en' ? 'In Progress' : 'En Progreso',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
      };
    }
    return {
      label: language === 'en' ? 'Not Started' : 'Sin Iniciar',
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  };

  const handleReset = () => {
    resetAllProgress();
    setShowConfirmReset(false);
  };

  const units: UnitNumber[] = [1, 2, 3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'en' ? 'Study Progress Dashboard' : 'Panel de Progreso de Estudio'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Tracks your completed exercises and quiz questions'
                  : 'Rastrea tus ejercicios y preguntas de examen completados'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overall Progress Banner */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              {language === 'en' ? 'Total Course Completion' : 'Progreso Total del Curso'}
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-2xs">
              {overallProgress.completedCount} / {overallProgress.totalCount}{' '}
              {language === 'en' ? 'Tasks' : 'Tareas'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900">{overallProgress.percentage}%</span>
            <span className="text-xs text-slate-600 font-medium">
              {overallProgress.percentage === 100
                ? language === 'en'
                  ? 'All units completed! Ready for the exam!'
                  : '¡Todas las unidades completadas! ¡Listo para el examen!'
                : language === 'en'
                ? `${overallProgress.totalCount - overallProgress.completedCount} tasks remaining`
                : `${overallProgress.totalCount - overallProgress.completedCount} tareas restantes`}
            </span>
          </div>

          {/* Large Overall Progress Bar */}
          <div className="w-full h-3 bg-blue-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${overallProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Unit Breakdown Cards */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === 'en' ? 'Progress by Unit:' : 'Progreso por Unidad:'}
          </h4>

          {units.map((unit) => {
            const prog = unitProgressMap[unit];
            const badge = getStatusBadge(prog.percentage);

            return (
              <div
                key={unit}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {language === 'en' ? `Unit ${unit}` : `Unidad ${unit}`}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {prog.percentage}%
                    </span>
                    {onSelectUnit && (
                      <button
                        onClick={() => {
                          onSelectUnit(unit);
                          onClose();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {language === 'en' ? 'View' : 'Ver'} →
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Unit */}
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      prog.percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${prog.percentage}%` }}
                  />
                </div>

                {/* Sub-breakdown (Exercises vs Quizzes) */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <div className="flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {language === 'en' ? 'Exercises:' : 'Ejercicios:'}{' '}
                      <strong className="text-slate-700">
                        {prog.exercisesCompleted} / {prog.exercisesTotal}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {language === 'en' ? 'Quiz Questions:' : 'Preguntas Examen:'}{' '}
                      <strong className="text-slate-700">
                        {prog.quizzesCompleted} / {prog.quizzesTotal}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Digital Badges Summary Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>{language === 'en' ? 'Digital Study Badges' : 'Insignias Digitales'}</span>
            </div>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {unlockedBadgesCount} / {totalBadgesCount} {language === 'en' ? 'Earned' : 'Ganadas'}
            </span>
          </div>

          <p className="text-xs text-amber-950/80">
            {language === 'en'
              ? 'Awarded at 25%, 50%, and 100% completion per unit, perfect quiz scores, and course milestones.'
              : 'Otorgadas al 25%, 50% y 100% de cada unidad, notas perfectas y metas del curso.'}
          </p>

          <div className="flex items-center justify-between pt-1">
            <div className="flex -space-x-1.5 overflow-hidden">
              {badges.map((b) => (
                <div
                  key={b.id}
                  title={`${b.title[language]} (${b.isUnlocked ? (language === 'en' ? 'Unlocked' : 'Desbloqueada') : (language === 'en' ? 'Locked' : 'Bloqueada')})`}
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                    b.isUnlocked
                      ? b.tier === 'diamond'
                        ? 'bg-cyan-500 text-white shadow-xs'
                        : b.tier === 'gold'
                        ? 'bg-amber-400 text-amber-950 shadow-xs'
                        : b.tier === 'silver'
                        ? 'bg-slate-400 text-white'
                        : 'bg-amber-700 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {b.isUnlocked ? '★' : '•'}
                </div>
              ))}
            </div>

            {onViewAchievements && (
              <button
                onClick={() => {
                  onClose();
                  onViewAchievements();
                }}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
              >
                {language === 'en' ? 'View All Badges →' : 'Ver Todas las Insignias →'}
              </button>
            )}
          </div>
        </div>

        {/* Footer & Reset Progress */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Reset Progress' : 'Reiniciar Progreso'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-rose-600 font-bold">
                {language === 'en' ? 'Clear all progress?' : '¿Borrar todo el progreso?'}
              </span>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 rounded-md bg-rose-600 text-white font-bold hover:bg-rose-700"
              >
                {language === 'en' ? 'Yes, Reset' : 'Sí, Borrar'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200"
              >
                {language === 'en' ? 'Cancel' : 'Cancelar'}
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-2xs"
          >
            {language === 'en' ? 'Close' : 'Cerrar'}
          </button>
        </div>
      </div>
    </div>
  );
};
