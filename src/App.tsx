import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { GrammarReview } from './components/GrammarReview';
import { Flashcards } from './components/Flashcards';
import { Exercises } from './components/Exercises';
import { ThirdPersonGenerator } from './components/ThirdPersonGenerator';
import { QuizView } from './components/QuizView';
import { AchievementsView } from './components/AchievementsView';
import { AchievementToast } from './components/AchievementToast';
import { HelpModal } from './components/HelpModal';
import { Language, UnitNumber } from './types';
import { Languages } from 'lucide-react';
import { ProgressProvider, useProgress } from './context/ProgressContext';

function AppContent() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aef_lang');
      if (saved === 'en' || saved === 'es') return saved;
    }
    return 'en';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('third_person');
  const [selectedUnit, setSelectedUnit] = useState<UnitNumber>('all');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const { recentUnlockedBadge, clearRecentUnlockedBadge } = useProgress();

  useEffect(() => {
    localStorage.setItem('aef_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        language={language}
        toggleLanguage={toggleLanguage}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Active View Rendering */}
        {activeTab === 'grammar' && (
          <GrammarReview selectedUnit={selectedUnit} language={language} />
        )}

        {activeTab === 'flashcards' && (
          <Flashcards selectedUnit={selectedUnit} language={language} />
        )}

        {activeTab === 'exercises' && (
          <Exercises selectedUnit={selectedUnit} language={language} />
        )}

        {activeTab === 'third_person' && (
          <ThirdPersonGenerator language={language} />
        )}

        {activeTab === 'quizzes' && (
          <QuizView selectedUnit={selectedUnit} language={language} />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            language={language}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
            onNavigateToExercises={() => setActiveTab('exercises')}
            onNavigateToQuizzes={() => setActiveTab('quizzes')}
          />
        )}
      </main>

      {/* Celebration Unlock Toast */}
      <AchievementToast
        badge={recentUnlockedBadge}
        language={language}
        onClose={clearRecentUnlockedBadge}
        onViewAchievements={() => setActiveTab('achievements')}
      />

      {/* Help & Syllabus Modal */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        language={language}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">American English File 1</span>
            <span>•</span>
            <span>Units 1, 2 & 3 Review & Test Prep</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? 'Switch Language (Español)'
                  : 'Cambiar Idioma (English)'}
              </span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="hover:text-slate-800 font-medium cursor-pointer"
            >
              {language === 'en' ? 'Syllabus & Tips' : 'Temario y Consejos'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
