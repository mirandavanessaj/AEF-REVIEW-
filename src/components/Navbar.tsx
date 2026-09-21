import React, { useState } from 'react';
import { BookOpen, Layers, CheckSquare, Sparkles, Award, HelpCircle, BarChart2, CheckCircle2, Trophy } from 'lucide-react';
import { Language, UnitNumber } from '../types';
import { LanguageToggle } from './LanguageToggle';
import { useProgress } from '../context/ProgressContext';
import { ProgressModal } from './ProgressModal';

export type ActiveTab = 'grammar' | 'flashcards' | 'exercises' | 'third_person' | 'quizzes' | 'achievements';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedUnit: UnitNumber;
  setSelectedUnit: (unit: UnitNumber) => void;
  language: Language;
  toggleLanguage: () => void;
  onOpenHelp: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedUnit,
  setSelectedUnit,
  language,
  toggleLanguage,
  onOpenHelp,
}) => {
  const { unitProgressMap, overallProgress, unlockedBadgesCount, totalBadgesCount } = useProgress();
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const tabs = [
    {
      id: 'grammar' as ActiveTab,
      label: language === 'en' ? 'Grammar Review' : 'Repaso Gramatical',
      icon: BookOpen,
      badge: 'Units 1-3',
    },
    {
      id: 'flashcards' as ActiveTab,
      label: language === 'en' ? 'Vocabulary Flashcards' : 'Fichas de Vocabulario',
      icon: Layers,
      badge: 'Cards & Audio',
    },
    {
      id: 'exercises' as ActiveTab,
      label: language === 'en' ? 'Exercises' : 'Ejercicios Interactivos',
      icon: CheckSquare,
      badge: 'Practice',
    },
    {
      id: 'third_person' as ActiveTab,
      label: language === 'en' ? '3rd Person Generator' : 'Generador 3ra Persona',
      icon: Sparkles,
      badge: 'Present Simple',
      highlight: true,
    },
    {
      id: 'quizzes' as ActiveTab,
      label: language === 'en' ? 'Practice Quizzes' : 'Exámenes de Prueba',
      icon: Award,
      badge: 'Test Prep',
    },
    {
      id: 'achievements' as ActiveTab,
      label: language === 'en' ? 'Badges & Achievements' : 'Insignias y Logros',
      icon: Trophy,
      badge: `${unlockedBadgesCount}/${totalBadgesCount}`,
      isSpecialTrophy: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              AEF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  American English File 1
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Units 1–3
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {language === 'en'
                  ? 'Comprehensive Study & Test Preparation Suite'
                  : 'Plataforma de Estudio y Preparación para el Examen'}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Badges Button */}
            <button
              id="navbar-badges-btn"
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
                activeTab === 'achievements'
                  ? 'bg-amber-500 border-amber-600 text-white shadow-xs font-bold'
                  : 'bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-900'
              }`}
              title={
                language === 'en'
                  ? 'Click to view your earned digital badges & milestone trophies'
                  : 'Clic para ver tus insignias digitales y trofeos ganados'
              }
            >
              <Trophy
                className={`w-3.5 h-3.5 shrink-0 ${
                  activeTab === 'achievements' ? 'text-white' : 'text-amber-600'
                }`}
              />
              <span className="hidden sm:inline">
                {language === 'en' ? 'Badges:' : 'Insignias:'}
              </span>
              <span
                className={`font-mono font-bold ${
                  activeTab === 'achievements' ? 'text-white' : 'text-amber-700'
                }`}
              >
                {unlockedBadgesCount}/{totalBadgesCount}
              </span>
            </button>

            {/* Overall Progress pill button */}
            <button
              id="navbar-progress-btn"
              onClick={() => setIsProgressModalOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
              title={
                language === 'en'
                  ? 'Click to view complete study progress & task breakdown'
                  : 'Clic para ver el progreso de estudio completo y desglose'
              }
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden md:inline">
                {language === 'en' ? 'Progress:' : 'Progreso:'}
              </span>
              <span className="font-mono font-bold text-blue-700">{overallProgress.percentage}%</span>
              <div className="w-10 sm:w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    overallProgress.percentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${overallProgress.percentage}%` }}
                />
              </div>
            </button>

            <LanguageToggle language={language} onToggle={toggleLanguage} />

            <button
              id="help-guide-btn"
              onClick={onOpenHelp}
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title={language === 'en' ? 'Study guide & test syllabus' : 'Guía de estudio y temario'}
              aria-label="Study Guide"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unit selector with individual progress bars & Tab navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 pt-2 gap-3 border-t border-slate-100">
          {/* Unit filter chips with progress bars */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 mr-0.5 whitespace-nowrap">
              {language === 'en' ? 'Unit Progress:' : 'Progreso Unidad:'}
            </span>
            {(['all', 1, 2, 3] as UnitNumber[]).map((unit) => {
              const isActive = selectedUnit === unit;
              const prog = unitProgressMap[unit];

              return (
                <button
                  key={unit}
                  id={`unit-filter-${unit}`}
                  onClick={() => setSelectedUnit(unit)}
                  className={`group relative flex flex-col justify-center min-w-[94px] sm:min-w-[115px] px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  title={`${
                    unit === 'all'
                      ? language === 'en'
                        ? 'All Units'
                        : 'Todas las Unidades'
                      : `${language === 'en' ? 'Unit' : 'Unidad'} ${unit}`
                  }: ${prog.completedCount}/${prog.totalCount} ${language === 'en' ? 'completed' : 'completadas'} (${prog.exercisesCompleted}/${prog.exercisesTotal} ex, ${prog.quizzesCompleted}/${prog.quizzesTotal} quiz)`}
                >
                  <div className="flex items-center justify-between gap-1 w-full text-[11px] font-bold leading-tight">
                    <span className="truncate">
                      {unit === 'all'
                        ? language === 'en'
                          ? 'All Units'
                          : 'Todas'
                        : `${language === 'en' ? 'Unit' : 'Unidad'} ${unit}`}
                    </span>
                    <div className="flex items-center gap-1">
                      {prog.percentage === 100 && (
                        <CheckCircle2
                          className={`w-3 h-3 ${isActive ? 'text-emerald-400' : 'text-emerald-600'}`}
                        />
                      )}
                      <span
                        className={`font-mono text-[10px] ${
                          prog.percentage === 100
                            ? isActive
                              ? 'text-emerald-300 font-bold'
                              : 'text-emerald-600 font-bold'
                            : isActive
                            ? 'text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {prog.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar for each unit in navbar */}
                  <div
                    className={`w-full h-1.5 rounded-full overflow-hidden mt-1.5 ${
                      isActive ? 'bg-slate-800' : 'bg-slate-100'
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        prog.percentage === 100
                          ? 'bg-emerald-400'
                          : isActive
                          ? 'bg-blue-400'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${prog.percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Module navigation tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isAchievements = tab.id === 'achievements';

              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? isAchievements
                        ? 'bg-amber-600 text-white shadow-xs font-semibold'
                        : tab.highlight
                        ? 'bg-purple-600 text-white shadow-xs font-semibold'
                        : 'bg-blue-600 text-white shadow-xs font-semibold'
                      : isAchievements
                      ? 'text-amber-800 bg-amber-50 hover:bg-amber-100/80 font-medium'
                      : tab.highlight
                      ? 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {isAchievements && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-amber-200/80 text-amber-900'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                  {tab.highlight && !isActive && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-200 text-purple-800 font-bold uppercase tracking-wider">
                      Special
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Progress Breakdown Modal */}
      <ProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        language={language}
        onSelectUnit={(unit) => setSelectedUnit(unit)}
        onViewAchievements={() => setActiveTab('achievements')}
      />
    </header>
  );
};

