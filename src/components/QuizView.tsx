import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Volume2, Bookmark, BarChart3 } from 'lucide-react';
import { Language, UnitNumber, QuizQuestion } from '../types';
import { UNIT_QUIZZES } from '../data/curriculum';
import { speakText } from '../utils/speech';
import { useProgress } from '../context/ProgressContext';

interface QuizViewProps {
  selectedUnit: UnitNumber;
  language: Language;
}

export const QuizView: React.FC<QuizViewProps> = ({ selectedUnit, language }) => {
  const { completedQuizQuestions, markQuizQuestionComplete, resetQuiz } = useProgress();

  // Select active quiz based on selectedUnit or default to all
  const [activeQuizId, setActiveQuizId] = useState<string>(() => {
    if (selectedUnit === 1) return 'quiz-u1';
    if (selectedUnit === 2) return 'quiz-u2';
    if (selectedUnit === 3) return 'quiz-u3';
    return 'quiz-all';
  });

  // When selectedUnit changes from navbar filter, update activeQuizId
  useEffect(() => {
    if (selectedUnit === 1) setActiveQuizId('quiz-u1');
    else if (selectedUnit === 2) setActiveQuizId('quiz-u2');
    else if (selectedUnit === 3) setActiveQuizId('quiz-u3');
    else setActiveQuizId('quiz-all');
  }, [selectedUnit]);

  const activeQuiz = UNIT_QUIZZES.find((q) => q.id === activeQuizId) || UNIT_QUIZZES[0];

  // Quiz execution state
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Restore answers for activeQuiz when activeQuizId changes
  useEffect(() => {
    const restored: Record<number, number> = {};
    let answeredCount = 0;

    activeQuiz.questions.forEach((q, idx) => {
      if (completedQuizQuestions[q.id] !== undefined) {
        restored[idx] = completedQuizQuestions[q.id].selectedIndex;
        answeredCount++;
      }
    });

    setSelectedAnswers(restored);
    if (answeredCount === activeQuiz.questions.length && activeQuiz.questions.length > 0) {
      setIsCompleted(true);
      setQuestionIndex(0);
    } else {
      setIsCompleted(false);
      // Move to first unanswered question if partial
      const firstUnanswered = activeQuiz.questions.findIndex(
        (q) => completedQuizQuestions[q.id] === undefined
      );
      setQuestionIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
    }
  }, [activeQuizId]);

  const currentQuestion = activeQuiz.questions[questionIndex];

  const handleSelectOption = (optIndex: number) => {
    const isCorrect = optIndex === currentQuestion.correctIndex;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optIndex }));
    markQuizQuestionComplete(activeQuizId, currentQuestion.id, optIndex, isCorrect);
  };

  const handleNext = () => {
    if (questionIndex < activeQuiz.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    }
  };

  const restartQuiz = () => {
    resetQuiz(activeQuizId);
    setQuestionIndex(0);
    setSelectedAnswers({});
    setIsCompleted(false);
  };

  // Calculate score
  const score = activeQuiz.questions.reduce((acc, q, idx) => {
    return acc + (selectedAnswers[idx] === q.correctIndex ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / activeQuiz.questions.length) * 100);
  const passed = percentage >= 70;

  return (
    <div className="space-y-6">
      {/* Quiz selector pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === 'en' ? 'Select Mock Exam:' : 'Selecciona el Examen de Prueba:'}
          </span>
          <span className="text-xs text-blue-600 font-semibold">
            {language === 'en' ? 'Pass mark: 70%' : 'Nota de aprobación: 70%'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {UNIT_QUIZZES.map((quiz) => {
            const isSelected = activeQuizId === quiz.id;
            return (
              <button
                key={quiz.id}
                onClick={() => {
                  setActiveQuizId(quiz.id);
                  setQuestionIndex(0);
                  setSelectedAnswers({});
                  setIsCompleted(false);
                }}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {quiz.unit === 'all' ? 'Mega Review' : `Unit ${quiz.unit}`}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {quiz.questions.length} Qs
                  </span>
                </div>
                <h4 className="text-xs font-bold truncate">{quiz.title[language]}</h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Quiz Card */}
      {!isCompleted ? (
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          {/* Header & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider text-blue-700">
                {activeQuiz.title[language]}
              </span>
              <span className="font-mono">
                {language === 'en' ? 'Question' : 'Pregunta'} {questionIndex + 1} / {activeQuiz.questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((questionIndex + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {currentQuestion.topic}
              </span>
              <button
                onClick={() => speakText(currentQuestion.question.en)}
                className="text-slate-400 hover:text-blue-600 p-1 cursor-pointer"
                title="Listen to question"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question[language]}
            </h3>
            {language === 'es' && currentQuestion.question.en !== currentQuestion.question.es && (
              <p className="text-xs text-slate-400 italic">
                {currentQuestion.question.en}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[questionIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold shadow-2xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(option);
                    }}
                    className="text-slate-400 hover:text-blue-600 p-1"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={questionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {language === 'en' ? 'Previous' : 'Anterior'}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[questionIndex] === undefined}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
            >
              <span>
                {questionIndex === activeQuiz.questions.length - 1
                  ? language === 'en'
                    ? 'Finish & View Score'
                    : 'Finalizar y Ver Puntaje'
                  : language === 'en'
                  ? 'Next Question'
                  : 'Siguiente'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white ${
                passed ? 'bg-emerald-600 shadow-emerald-200 shadow-lg' : 'bg-rose-500'
              }`}
            >
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {passed
                  ? language === 'en'
                    ? 'Congratulations! You Passed!'
                    : '¡Felicitaciones! Has Aprobado'
                  : language === 'en'
                  ? 'Keep Practicing!'
                  : '¡Sigue Practicando!'}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {language === 'en'
                  ? `You answered ${score} out of ${activeQuiz.questions.length} questions correctly.`
                  : `Respondiste correctamente ${score} de ${activeQuiz.questions.length} preguntas.`}
              </p>
            </div>

            <div className="inline-block px-6 py-2 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-3xl font-black text-slate-900">{percentage}%</span>
              <span className="text-xs text-slate-500 ml-2 font-semibold">
                ({passed ? 'PASS' : 'NEEDS REVIEW'})
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'en' ? 'Retake This Quiz' : 'Reintentar Este Examen'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span>{language === 'en' ? 'Detailed Question Review' : 'Revisión Detallada de Preguntas'}</span>
              </h4>
              <span className="text-xs text-slate-500">
                {language === 'en' ? 'Check explanations & grammar tips' : 'Revisa explicaciones y reglas'}
              </span>
            </div>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-2.5 ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-rose-200 bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-slate-500">
                          #{idx + 1} • {q.topic}
                        </span>
                      </div>

                      <button
                        onClick={() => speakText(q.question.en)}
                        className="text-slate-400 hover:text-blue-600"
                        title="Listen to question"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {q.question[language]}
                    </p>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{language === 'en' ? 'Your answer:' : 'Tu respuesta:'}</span>
                        <span
                          className={`font-semibold ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-600 line-through'
                          }`}
                        >
                          {userChoice !== undefined ? q.options[userChoice] : 'None'}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{language === 'en' ? 'Correct answer:' : 'Respuesta correcta:'}</span>
                          <span className="font-bold text-emerald-700">
                            {q.options[q.correctIndex]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200/60">
                      <span className="font-bold text-slate-900">
                        {language === 'en' ? 'Explanation: ' : 'Explicación: '}
                      </span>
                      {q.explanation[language]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
