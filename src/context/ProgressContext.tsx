import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UnitNumber, UnitProgress, ExerciseProgressRecord, QuizQuestionProgressRecord, AchievementBadge } from '../types';
import { INTERACTIVE_EXERCISES, UNIT_QUIZZES } from '../data/curriculum';
import { BADGE_DEFINITIONS } from '../data/achievements';

interface ProgressContextType {
  completedExercises: Record<string, ExerciseProgressRecord>;
  completedQuizQuestions: Record<string, QuizQuestionProgressRecord>;
  markExerciseComplete: (exerciseId: string, isCorrect: boolean, userAnswer?: string) => void;
  resetExercise: (exerciseId: string) => void;
  resetExercisesForUnit: (unit: UnitNumber) => void;
  markQuizQuestionComplete: (quizId: string, questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  resetQuiz: (quizId: string) => void;
  resetAllProgress: () => void;
  getProgressForUnit: (unit: UnitNumber) => UnitProgress;
  unitProgressMap: Record<UnitNumber, UnitProgress>;
  overallProgress: UnitProgress;
  badges: AchievementBadge[];
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  recentUnlockedBadge: AchievementBadge | null;
  clearRecentUnlockedBadge: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'aef_progress_tracker_v2';
const ACHIEVEMENTS_KEY = 'aef_unlocked_badges_v1';

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedExercises, setCompletedExercises] = useState<Record<string, ExerciseProgressRecord>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.exercises || {};
        }
      } catch (err) {
        console.error('Error loading progress from localStorage:', err);
      }
    }
    return {};
  });

  const [completedQuizQuestions, setCompletedQuizQuestions] = useState<Record<string, QuizQuestionProgressRecord>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.quizzes || {};
        }
      } catch (err) {
        console.error('Error loading quiz progress from localStorage:', err);
      }
    }
    return {};
  });

  // Track timestamps of when badges were unlocked
  const [unlockedBadgesMap, setUnlockedBadgesMap] = useState<Record<string, number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Error loading achievements from localStorage:', err);
      }
    }
    return {};
  });

  // Toast / celebration banner for the most recently unlocked badge
  const [recentUnlockedBadge, setRecentUnlockedBadge] = useState<AchievementBadge | null>(null);

  // Sync state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            exercises: completedExercises,
            quizzes: completedQuizQuestions,
          })
        );
      } catch (err) {
        console.error('Error saving progress to localStorage:', err);
      }
    }
  }, [completedExercises, completedQuizQuestions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlockedBadgesMap));
      } catch (err) {
        console.error('Error saving achievements to localStorage:', err);
      }
    }
  }, [unlockedBadgesMap]);

  const markExerciseComplete = useCallback((exerciseId: string, isCorrect: boolean, userAnswer?: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [exerciseId]: {
        isChecked: true,
        isCorrect,
        userAnswer,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const resetExercise = useCallback((exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = { ...prev };
      delete next[exerciseId];
      return next;
    });
  }, []);

  const resetExercisesForUnit = useCallback((unit: UnitNumber) => {
    setCompletedExercises((prev) => {
      const next = { ...prev };
      INTERACTIVE_EXERCISES.forEach((ex) => {
        if (unit === 'all' || ex.unit === unit) {
          delete next[ex.id];
        }
      });
      return next;
    });
  }, []);

  const markQuizQuestionComplete = useCallback(
    (quizId: string, questionId: string, selectedIndex: number, isCorrect: boolean) => {
      setCompletedQuizQuestions((prev) => ({
        ...prev,
        [questionId]: {
          quizId,
          questionId,
          selectedIndex,
          isCorrect,
          timestamp: Date.now(),
        },
      }));
    },
    []
  );

  const resetQuiz = useCallback((quizId: string) => {
    setCompletedQuizQuestions((prev) => {
      const next = { ...prev };
      const quiz = UNIT_QUIZZES.find((q) => q.id === quizId);
      if (quiz) {
        quiz.questions.forEach((q) => {
          delete next[q.id];
        });
      }
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setCompletedExercises({});
    setCompletedQuizQuestions({});
    setUnlockedBadgesMap({});
    setRecentUnlockedBadge(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACHIEVEMENTS_KEY);
      } catch (err) {
        console.error('Error clearing progress & achievements:', err);
      }
    }
  }, []);

  // Compute progress per unit
  const computeUnitProgress = useCallback(
    (unit: UnitNumber): UnitProgress => {
      if (unit === 'all') {
        const exercisesTotal = INTERACTIVE_EXERCISES.length;
        const exercisesCompleted = INTERACTIVE_EXERCISES.filter(
          (ex) => completedExercises[ex.id]?.isChecked
        ).length;

        // All quiz questions across all 4 quizzes
        const allQuizQuestions = UNIT_QUIZZES.flatMap((q) => q.questions);
        const quizzesTotal = allQuizQuestions.length;
        const quizzesCompleted = allQuizQuestions.filter(
          (q) => completedQuizQuestions[q.id] !== undefined
        ).length;

        const totalCount = exercisesTotal + quizzesTotal;
        const completedCount = exercisesCompleted + quizzesCompleted;
        const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        return {
          unit: 'all',
          completedCount,
          totalCount,
          percentage,
          exercisesCompleted,
          exercisesTotal,
          quizzesCompleted,
          quizzesTotal,
          isComplete: totalCount > 0 && completedCount === totalCount,
        };
      }

      // Specific unit 1, 2, or 3
      const unitExercises = INTERACTIVE_EXERCISES.filter((ex) => ex.unit === unit);
      const exercisesTotal = unitExercises.length;
      const exercisesCompleted = unitExercises.filter(
        (ex) => completedExercises[ex.id]?.isChecked
      ).length;

      // Primary mastery quiz for unit: quiz-u1, quiz-u2, quiz-u3
      const primaryQuizId = `quiz-u${unit}`;
      const primaryQuiz = UNIT_QUIZZES.find((q) => q.id === primaryQuizId);
      const unitQuizQuestions = primaryQuiz ? primaryQuiz.questions : [];
      const quizzesTotal = unitQuizQuestions.length;
      const quizzesCompleted = unitQuizQuestions.filter(
        (q) => completedQuizQuestions[q.id] !== undefined
      ).length;

      const totalCount = exercisesTotal + quizzesTotal;
      const completedCount = exercisesCompleted + quizzesCompleted;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return {
        unit,
        completedCount,
        totalCount,
        percentage,
        exercisesCompleted,
        exercisesTotal,
        quizzesCompleted,
        quizzesTotal,
        isComplete: totalCount > 0 && completedCount === totalCount,
      };
    },
    [completedExercises, completedQuizQuestions]
  );

  const getProgressForUnit = useCallback(
    (unit: UnitNumber): UnitProgress => {
      return computeUnitProgress(unit);
    },
    [computeUnitProgress]
  );

  const unitProgressMap = useMemo<Record<UnitNumber, UnitProgress>>(() => {
    return {
      all: computeUnitProgress('all'),
      1: computeUnitProgress(1),
      2: computeUnitProgress(2),
      3: computeUnitProgress(3),
    };
  }, [computeUnitProgress]);

  const overallProgress = unitProgressMap.all;

  // Evaluate Achievement Badges
  const badges = useMemo<AchievementBadge[]>(() => {
    const totalExercisesCompleted = Object.values(completedExercises).filter((e) => e.isChecked).length;
    const totalExercisesCorrect = Object.values(completedExercises).filter((e) => e.isCorrect).length;
    const totalQuizzesCompleted = Object.keys(completedQuizQuestions).length;
    const totalTasksCompleted = totalExercisesCompleted + totalQuizzesCompleted;

    // Check if any quiz has 100% correct score
    const hasPerfectQuizScore = UNIT_QUIZZES.some((quiz) => {
      if (quiz.questions.length === 0) return false;
      return quiz.questions.every(
        (q) => completedQuizQuestions[q.id] && completedQuizQuestions[q.id].isCorrect
      );
    });

    return BADGE_DEFINITIONS.map((def) => {
      let isUnlocked = false;
      let progress = 0;
      let currentValue = 0;
      let targetValue = 100;

      // Unit 1 milestones
      if (def.id === 'u1_25') {
        currentValue = unitProgressMap[1].percentage;
        targetValue = 25;
        isUnlocked = currentValue >= 25;
        progress = Math.min(100, Math.round((currentValue / 25) * 100));
      } else if (def.id === 'u1_50') {
        currentValue = unitProgressMap[1].percentage;
        targetValue = 50;
        isUnlocked = currentValue >= 50;
        progress = Math.min(100, Math.round((currentValue / 50) * 100));
      } else if (def.id === 'u1_100') {
        currentValue = unitProgressMap[1].percentage;
        targetValue = 100;
        isUnlocked = currentValue >= 100;
        progress = currentValue;
      }

      // Unit 2 milestones
      else if (def.id === 'u2_25') {
        currentValue = unitProgressMap[2].percentage;
        targetValue = 25;
        isUnlocked = currentValue >= 25;
        progress = Math.min(100, Math.round((currentValue / 25) * 100));
      } else if (def.id === 'u2_50') {
        currentValue = unitProgressMap[2].percentage;
        targetValue = 50;
        isUnlocked = currentValue >= 50;
        progress = Math.min(100, Math.round((currentValue / 50) * 100));
      } else if (def.id === 'u2_100') {
        currentValue = unitProgressMap[2].percentage;
        targetValue = 100;
        isUnlocked = currentValue >= 100;
        progress = currentValue;
      }

      // Unit 3 milestones
      else if (def.id === 'u3_25') {
        currentValue = unitProgressMap[3].percentage;
        targetValue = 25;
        isUnlocked = currentValue >= 25;
        progress = Math.min(100, Math.round((currentValue / 25) * 100));
      } else if (def.id === 'u3_50') {
        currentValue = unitProgressMap[3].percentage;
        targetValue = 50;
        isUnlocked = currentValue >= 50;
        progress = Math.min(100, Math.round((currentValue / 50) * 100));
      } else if (def.id === 'u3_100') {
        currentValue = unitProgressMap[3].percentage;
        targetValue = 100;
        isUnlocked = currentValue >= 100;
        progress = currentValue;
      }

      // Overall & Special milestones
      else if (def.id === 'first_step') {
        currentValue = totalTasksCompleted;
        targetValue = 1;
        isUnlocked = totalTasksCompleted >= 1;
        progress = isUnlocked ? 100 : 0;
      } else if (def.id === 'halfway_hero') {
        currentValue = overallProgress.percentage;
        targetValue = 50;
        isUnlocked = currentValue >= 50;
        progress = Math.min(100, Math.round((currentValue / 50) * 100));
      } else if (def.id === 'course_100') {
        currentValue = overallProgress.percentage;
        targetValue = 100;
        isUnlocked = currentValue >= 100;
        progress = currentValue;
      } else if (def.id === 'quiz_ace') {
        currentValue = hasPerfectQuizScore ? 1 : 0;
        targetValue = 1;
        isUnlocked = hasPerfectQuizScore;
        progress = hasPerfectQuizScore ? 100 : 0;
      } else if (def.id === 'grammar_detective') {
        currentValue = totalExercisesCorrect;
        targetValue = 5;
        isUnlocked = totalExercisesCorrect >= 5;
        progress = Math.min(100, Math.round((totalExercisesCorrect / 5) * 100));
      }

      const unlockedAt = unlockedBadgesMap[def.id];

      return {
        ...def,
        isUnlocked,
        progress,
        currentValue,
        targetValue,
        unlockedAt,
      };
    });
  }, [completedExercises, completedQuizQuestions, unitProgressMap, overallProgress, unlockedBadgesMap]);

  // Check for newly unlocked badges to record timestamp and display celebration toast
  useEffect(() => {
    const newlyUnlocked: AchievementBadge[] = [];
    const updatedMap = { ...unlockedBadgesMap };
    let hasChanges = false;

    badges.forEach((b) => {
      if (b.isUnlocked && !unlockedBadgesMap[b.id]) {
        const now = Date.now();
        updatedMap[b.id] = now;
        newlyUnlocked.push({ ...b, unlockedAt: now });
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setUnlockedBadgesMap(updatedMap);
      if (newlyUnlocked.length > 0) {
        // Show the highest tier badge among the new ones
        setRecentUnlockedBadge(newlyUnlocked[newlyUnlocked.length - 1]);
      }
    }
  }, [badges, unlockedBadgesMap]);

  const clearRecentUnlockedBadge = useCallback(() => {
    setRecentUnlockedBadge(null);
  }, []);

  const unlockedBadgesCount = useMemo(() => {
    return badges.filter((b) => b.isUnlocked).length;
  }, [badges]);

  const totalBadgesCount = badges.length;

  return (
    <ProgressContext.Provider
      value={{
        completedExercises,
        completedQuizQuestions,
        markExerciseComplete,
        resetExercise,
        resetExercisesForUnit,
        markQuizQuestionComplete,
        resetQuiz,
        resetAllProgress,
        getProgressForUnit,
        unitProgressMap,
        overallProgress,
        badges,
        unlockedBadgesCount,
        totalBadgesCount,
        recentUnlockedBadge,
        clearRecentUnlockedBadge,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
