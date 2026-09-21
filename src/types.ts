export type Language = 'en' | 'es';

export type UnitNumber = 1 | 2 | 3 | 'all';

export interface BilingualText {
  en: string;
  es: string;
}

export interface GrammarRule {
  id: string;
  unit: 1 | 2 | 3;
  title: BilingualText;
  summary: BilingualText;
  formula?: string;
  explanation: BilingualText;
  tableHeaders?: BilingualText[];
  tableRows?: {
    label: BilingualText;
    example: BilingualText;
    note?: BilingualText;
  }[];
  spellingTips?: BilingualText[];
  commonMistakes: {
    wrong: string;
    correct: string;
    reason: BilingualText;
  }[];
  practiceTip: BilingualText;
}

export interface Flashcard {
  id: string;
  unit: 1 | 2 | 3;
  category: 'countries_nationalities' | 'days_numbers' | 'classroom' | 'things' | 'adjectives' | 'feelings' | 'verbs' | 'jobs';
  categoryLabel: BilingualText;
  term: string;
  translation: string;
  phonetic?: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
  notes?: BilingualText;
}

export type ExerciseType = 'fill_blank' | 'unscramble' | 'fix_mistake' | 'multiple_choice';

export interface ExerciseItem {
  id: string;
  unit: 1 | 2 | 3;
  category: 'grammar' | 'vocabulary';
  type: ExerciseType;
  instruction: BilingualText;
  question: BilingualText;
  options?: string[]; // for multiple_choice
  scrambledWords?: string[]; // for unscramble
  sentenceWithMistake?: string; // for fix_mistake
  targetBlank?: string; // for fill_blank
  correctAnswer: string;
  alternativeAnswers?: string[];
  explanation: BilingualText;
  hint?: BilingualText;
}

export interface QuizQuestion {
  id: string;
  unit: 1 | 2 | 3;
  topic: string;
  question: BilingualText;
  options: string[];
  correctIndex: number;
  explanation: BilingualText;
  ruleReference?: string;
}

export interface ThirdPersonVerb {
  base: string;
  thirdPerson: string;
  ruleType: '-s' | '-es' | '-ies' | 'irregular';
  ruleExplanation: BilingualText;
  spanish: string;
  exampleComplement: string;
  exampleComplementSpanish: string;
}

export interface ThirdPersonSubject {
  subject: string;
  type: 'he' | 'she' | 'it' | 'name' | 'noun';
  spanish: string;
}

export interface UnitProgress {
  unit: UnitNumber;
  completedCount: number;
  totalCount: number;
  percentage: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  quizzesCompleted: number;
  quizzesTotal: number;
  isComplete: boolean;
}

export interface ExerciseProgressRecord {
  isChecked: boolean;
  isCorrect: boolean;
  userAnswer?: string;
  timestamp?: number;
}

export interface QuizQuestionProgressRecord {
  quizId: string;
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timestamp?: number;
}

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface AchievementBadge {
  id: string;
  title: BilingualText;
  description: BilingualText;
  tier: BadgeTier;
  category: 'unit1' | 'unit2' | 'unit3' | 'overall' | 'mastery';
  unit?: UnitNumber;
  targetPercentage?: number;
  iconName: string;
  unlockedAt?: number;
  progress: number; // 0 to 100
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
}
