import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, RotateCcw, Volume2, Sparkles, Filter, CheckSquare } from 'lucide-react';
import { Language, UnitNumber, ExerciseItem } from '../types';
import { INTERACTIVE_EXERCISES } from '../data/curriculum';
import { speakText } from '../utils/speech';
import { AudioPronounceButton } from './AudioPronounceButton';
import { useProgress } from '../context/ProgressContext';

interface ExercisesProps {
  selectedUnit: UnitNumber;
  language: Language;
}

export const Exercises: React.FC<ExercisesProps> = ({ selectedUnit, language }) => {
  const {
    completedExercises,
    markExerciseComplete,
    resetExercise,
    resetExercisesForUnit,
  } = useProgress();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'grammar' | 'vocabulary'>('all');
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [unscrambledPicks, setUnscrambledPicks] = useState<Record<string, string[]>>({});
  const [checkedState, setCheckedState] = useState<Record<string, { isChecked: boolean; isCorrect: boolean }>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // Sync state from completedExercises on mount / when completedExercises changes
  useEffect(() => {
    const newChecked: Record<string, { isChecked: boolean; isCorrect: boolean }> = {};
    const newInputs: Record<string, string> = {};
    const newPicks: Record<string, string[]> = {};

    Object.entries(completedExercises).forEach(([id, record]) => {
      newChecked[id] = { isChecked: record.isChecked, isCorrect: record.isCorrect };
      if (record.userAnswer) {
        newInputs[id] = record.userAnswer;
        const ex = INTERACTIVE_EXERCISES.find((e) => e.id === id);
        if (ex?.type === 'unscramble') {
          newPicks[id] = record.userAnswer.split(' ');
        }
      }
    });

    setCheckedState(newChecked);
    setUserInputs((prev) => ({ ...newInputs, ...prev }));
    setUnscrambledPicks((prev) => ({ ...newPicks, ...prev }));
  }, [completedExercises]);

  const filteredExercises = useMemo(() => {
    let list = INTERACTIVE_EXERCISES;
    if (selectedUnit !== 'all') {
      list = list.filter((ex) => ex.unit === selectedUnit);
    }
    if (selectedCategory !== 'all') {
      list = list.filter((ex) => ex.category === selectedCategory);
    }
    return list;
  }, [selectedUnit, selectedCategory]);

  const handleInputChange = (id: string, val: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: val }));
    // Reset checked state on change
    if (checkedState[id]) {
      resetExercise(id);
      setCheckedState((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleCheck = (item: ExerciseItem) => {
    let userVal = '';

    if (item.type === 'unscramble') {
      const picks = unscrambledPicks[item.id] || [];
      userVal = picks.join(' ');
    } else {
      userVal = (userInputs[item.id] || '').trim();
    }

    if (!userVal) return;

    // Normalize for comparison
    const normUser = userVal.toLowerCase().replace(/\s+/g, ' ').replace(/[.?!]$/, '');
    const normCorrect = item.correctAnswer.toLowerCase().replace(/\s+/g, ' ').replace(/[.?!]$/, '');
    
    let isCorrect = normUser === normCorrect;

    if (!isCorrect && item.alternativeAnswers) {
      isCorrect = item.alternativeAnswers.some(
        (alt) => alt.toLowerCase().replace(/\s+/g, ' ').replace(/[.?!]$/, '') === normUser
      );
    }

    setCheckedState((prev) => ({
      ...prev,
      [item.id]: { isChecked: true, isCorrect },
    }));

    markExerciseComplete(item.id, isCorrect, userVal);
  };

  // Unscramble tile selection
  const handlePickWord = (exerciseId: string, word: string, wordIndex: number, originalWords: string[]) => {
    const current = unscrambledPicks[exerciseId] || [];
    setUnscrambledPicks((prev) => ({
      ...prev,
      [exerciseId]: [...current, word],
    }));
  };

  const handleRemovePickedWord = (exerciseId: string, indexToRemove: number) => {
    const current = unscrambledPicks[exerciseId] || [];
    const updated = current.filter((_, idx) => idx !== indexToRemove);
    setUnscrambledPicks((prev) => ({
      ...prev,
      [exerciseId]: updated,
    }));
  };

  const toggleHint = (id: string) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = () => {
    resetExercisesForUnit(selectedUnit);
    setUserInputs({});
    setUnscrambledPicks({});
    setCheckedState({});
    setRevealedHints({});
  };

  // Compute stats
  const totalAnswered = Object.keys(checkedState).length;
  const totalCorrect = Object.values(checkedState).filter((s) => s.isCorrect).length;

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            {language === 'en' ? 'Interactive Practice Drills' : 'Ejercicios Prácticos Interactivos'}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'en'
              ? 'Grammar & Vocabulary Workouts'
              : 'Entrenamiento de Gramática y Vocabulario'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Fill in blanks, fix test errors, unscramble questions, and check multiple-choice items with instant grading.'
              : 'Completa espacios, corrige errores típicos de prueba, ordena oraciones y resuelve opciones múltiples con corrección inmediata.'}
          </p>
        </div>

        {/* Score tracker & Reset */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {language === 'en' ? 'Accuracy Score' : 'Puntaje'}
            </div>
            <div className="text-sm font-bold text-emerald-700">
              {totalCorrect} / {totalAnswered} ({totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%)
            </div>
          </div>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Reset exercises"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Reset' : 'Reiniciar'}</span>
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs text-xs">
        <Filter className="w-4 h-4 text-slate-400 ml-2" />
        <span className="font-semibold text-slate-600 mr-2">
          {language === 'en' ? 'Category:' : 'Categoría:'}
        </span>
        {(['all', 'grammar', 'vocabulary'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all capitalize ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {cat === 'all'
              ? language === 'en'
                ? 'All Exercises'
                : 'Todos'
              : cat === 'grammar'
              ? language === 'en'
                ? 'Grammar Focus'
                : 'Gramática'
              : language === 'en'
              ? 'Vocabulary Focus'
              : 'Vocabulario'}
          </button>
        ))}
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {filteredExercises.map((exercise, index) => {
          const checkStatus = checkedState[exercise.id];
          const hasChecked = checkStatus?.isChecked;
          const isCorrect = checkStatus?.isCorrect;
          const isHintOpen = revealedHints[exercise.id];

          return (
            <div
              key={exercise.id}
              id={`exercise-card-${exercise.id}`}
              className={`bg-white p-5 rounded-2xl border transition-all shadow-2xs space-y-4 ${
                hasChecked
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Exercise Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-slate-100 text-slate-700">
                    #{index + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800">
                    Unit {exercise.unit}
                  </span>
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                    {exercise.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {exercise.hint && (
                    <button
                      onClick={() => toggleHint(exercise.id)}
                      className="text-amber-600 hover:text-amber-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Hint' : 'Pista'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => speakText(exercise.question.en)}
                    className="text-slate-400 hover:text-blue-600 cursor-pointer"
                    title="Pronounce question"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instructions & Prompt */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  {exercise.instruction[language]}
                </p>
                {exercise.sentenceWithMistake && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm font-semibold text-amber-900 mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-amber-700 block mb-0.5">
                      {language === 'en' ? 'Original Sentence with Mistake:' : 'Oración Original con Error:'}
                    </span>
                    <span className="line-through decoration-rose-500 decoration-2">
                      {exercise.sentenceWithMistake}
                    </span>
                  </div>
                )}
                <h3 className="text-base font-bold text-slate-900">
                  {exercise.question[language]}
                </h3>
                {language === 'es' && exercise.question.en !== exercise.question.es && (
                  <p className="text-xs text-slate-400 italic mt-0.5">
                    {exercise.question.en}
                  </p>
                )}
              </div>

              {/* Hint dropdown */}
              {isHintOpen && exercise.hint && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  <span className="font-bold">💡 {language === 'en' ? 'Clue:' : 'Pista:'} </span>
                  {exercise.hint[language]}
                </div>
              )}

              {/* Interactive Inputs based on Type */}
              {exercise.type === 'multiple_choice' && exercise.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {exercise.options.map((opt) => {
                    const isSelected = userInputs[exercise.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleInputChange(exercise.id, opt)}
                        disabled={hasChecked}
                        className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        } ${hasChecked ? 'cursor-not-allowed opacity-90' : ''}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {exercise.type === 'fill_blank' && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={userInputs[exercise.id] || ''}
                    onChange={(e) => handleInputChange(exercise.id, e.target.value)}
                    disabled={hasChecked}
                    placeholder={language === 'en' ? 'Type your answer here...' : 'Escribe tu respuesta aquí...'}
                    className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheck(exercise);
                    }}
                  />
                </div>
              )}

              {exercise.type === 'fix_mistake' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userInputs[exercise.id] || ''}
                    onChange={(e) => handleInputChange(exercise.id, e.target.value)}
                    disabled={hasChecked}
                    placeholder={
                      language === 'en'
                        ? 'Type the corrected sentence...'
                        : 'Escribe la oración corregida...'
                    }
                    className="w-full px-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCheck(exercise);
                    }}
                  />
                </div>
              )}

              {exercise.type === 'unscramble' && exercise.scrambledWords && (
                <div className="space-y-3">
                  {/* Selected Words Line */}
                  <div className="min-h-[50px] p-3 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 flex flex-wrap items-center gap-2">
                    {(unscrambledPicks[exercise.id] || []).length === 0 ? (
                      <span className="text-xs text-slate-400 italic">
                        {language === 'en'
                          ? 'Click word chips below in order to construct the sentence...'
                          : 'Haz clic en las palabras de abajo en orden para formar la oración...'}
                      </span>
                    ) : (
                      (unscrambledPicks[exercise.id] || []).map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => !hasChecked && handleRemovePickedWord(exercise.id, idx)}
                          disabled={hasChecked}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-2xs hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Click to remove word"
                        >
                          {word}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Word bank to choose from */}
                  <div className="flex flex-wrap gap-2">
                    {exercise.scrambledWords.map((word, idx) => {
                      const countInPicks = (unscrambledPicks[exercise.id] || []).filter((w) => w === word).length;
                      const countInOriginal = exercise.scrambledWords!.filter((w) => w === word).length;
                      const isUsedUp = countInPicks >= countInOriginal;

                      return (
                        <button
                          key={idx}
                          onClick={() => !isUsedUp && !hasChecked && handlePickWord(exercise.id, word, idx, exercise.scrambledWords!)}
                          disabled={isUsedUp || hasChecked}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isUsedUp
                              ? 'opacity-30 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 text-slate-800 shadow-2xs'
                          }`}
                        >
                          {word}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action check button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {!hasChecked ? (
                  <button
                    onClick={() => handleCheck(exercise)}
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    {language === 'en' ? 'Check Answer' : 'Comprobar Respuesta'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      resetExercise(exercise.id);
                      setCheckedState((prev) => {
                        const copy = { ...prev };
                        delete copy[exercise.id];
                        return copy;
                      });
                      setUserInputs((prev) => {
                        const copy = { ...prev };
                        delete copy[exercise.id];
                        return copy;
                      });
                      setUnscrambledPicks((prev) => {
                        const copy = { ...prev };
                        delete copy[exercise.id];
                        return copy;
                      });
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Try Again' : 'Reintentar'}</span>
                  </button>
                )}
              </div>

              {/* Feedback banner */}
              {hasChecked && (
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{language === 'en' ? 'Correct!' : '¡Correcto!'}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>
                          {language === 'en' ? 'Incorrect.' : 'Incorrecto.'}{' '}
                          <span className="font-semibold text-slate-800">
                            {language === 'en' ? 'Correct Answer:' : 'Respuesta Correcta:'}{' '}
                            <span className="underline font-bold text-emerald-700">
                              {exercise.correctAnswer}
                            </span>
                          </span>
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-700">
                    <span className="font-bold">
                      {language === 'en' ? 'Explanation:' : 'Explicación:'}{' '}
                    </span>
                    {exercise.explanation[language]}
                  </p>

                  <div className="pt-1 flex items-center justify-end">
                    <AudioPronounceButton
                      text={exercise.correctAnswer}
                      language={language}
                      size="sm"
                      variant="pill"
                      showSlowToggle={true}
                      label={language === 'en' ? 'Listen to Correct Sentence' : 'Escuchar Oración Correcta'}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
