import { AchievementBadge } from '../types';

export interface BadgeDefinition {
  id: string;
  title: { en: string; es: string };
  description: { en: string; es: string };
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  category: 'unit1' | 'unit2' | 'unit3' | 'overall' | 'mastery';
  unit?: 1 | 2 | 3;
  targetPercentage?: number;
  iconName: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // Unit 1 Milestones
  {
    id: 'u1_25',
    title: { en: 'Unit 1 Starter', es: 'Iniciador Unidad 1' },
    description: {
      en: 'Reach 25% completion in Unit 1 (Verb Be, Countries & Introductions).',
      es: 'Alcanza el 25% de completado en la Unidad 1 (Verbo Be, Países y Presentaciones).',
    },
    tier: 'bronze',
    category: 'unit1',
    unit: 1,
    targetPercentage: 25,
    iconName: 'Compass',
  },
  {
    id: 'u1_50',
    title: { en: 'Unit 1 Explorer', es: 'Explorador Unidad 1' },
    description: {
      en: 'Reach 50% completion in Unit 1.',
      es: 'Alcanza el 50% de completado en la Unidad 1.',
    },
    tier: 'silver',
    category: 'unit1',
    unit: 1,
    targetPercentage: 50,
    iconName: 'BookOpen',
  },
  {
    id: 'u1_100',
    title: { en: 'Unit 1 Master', es: 'Maestro Unidad 1' },
    description: {
      en: 'Reach 100% completion in Unit 1! All exercises and quiz questions finished.',
      es: '¡Alcanza el 100% en la Unidad 1! Todos los ejercicios y preguntas de examen completados.',
    },
    tier: 'gold',
    category: 'unit1',
    unit: 1,
    targetPercentage: 100,
    iconName: 'Award',
  },

  // Unit 2 Milestones
  {
    id: 'u2_25',
    title: { en: 'Unit 2 Starter', es: 'Iniciador Unidad 2' },
    description: {
      en: 'Reach 25% completion in Unit 2 (Nouns, Colors, Adjectives & Feelings).',
      es: 'Alcanza el 25% de completado en la Unidad 2 (Sustantivos, Colores, Adjetivos y Sentimientos).',
    },
    tier: 'bronze',
    category: 'unit2',
    unit: 2,
    targetPercentage: 25,
    iconName: 'Compass',
  },
  {
    id: 'u2_50',
    title: { en: 'Unit 2 Explorer', es: 'Explorador Unidad 2' },
    description: {
      en: 'Reach 50% completion in Unit 2.',
      es: 'Alcanza el 50% de completado en la Unidad 2.',
    },
    tier: 'silver',
    category: 'unit2',
    unit: 2,
    targetPercentage: 50,
    iconName: 'BookOpen',
  },
  {
    id: 'u2_100',
    title: { en: 'Unit 2 Master', es: 'Maestro Unidad 2' },
    description: {
      en: 'Reach 100% completion in Unit 2! All exercises and quiz questions finished.',
      es: '¡Alcanza el 100% en la Unidad 2! Todos los ejercicios y preguntas de examen completados.',
    },
    tier: 'gold',
    category: 'unit2',
    unit: 2,
    targetPercentage: 100,
    iconName: 'Award',
  },

  // Unit 3 Milestones
  {
    id: 'u3_25',
    title: { en: 'Unit 3 Starter', es: 'Iniciador Unidad 3' },
    description: {
      en: 'Reach 25% completion in Unit 3 (Present Simple & Question Order).',
      es: 'Alcanza el 25% de completado en la Unidad 3 (Presente Simple y Orden de Preguntas).',
    },
    tier: 'bronze',
    category: 'unit3',
    unit: 3,
    targetPercentage: 25,
    iconName: 'Compass',
  },
  {
    id: 'u3_50',
    title: { en: 'Unit 3 Explorer', es: 'Explorador Unidad 3' },
    description: {
      en: 'Reach 50% completion in Unit 3.',
      es: 'Alcanza el 50% de completado en la Unidad 3.',
    },
    tier: 'silver',
    category: 'unit3',
    unit: 3,
    targetPercentage: 50,
    iconName: 'BookOpen',
  },
  {
    id: 'u3_100',
    title: { en: 'Unit 3 Master', es: 'Maestro Unidad 3' },
    description: {
      en: 'Reach 100% completion in Unit 3! All exercises and quiz questions finished.',
      es: '¡Alcanza el 100% en la Unidad 3! Todos los ejercicios y preguntas de examen completados.',
    },
    tier: 'gold',
    category: 'unit3',
    unit: 3,
    targetPercentage: 100,
    iconName: 'Award',
  },

  // Course Milestones & Special Achievements
  {
    id: 'first_step',
    title: { en: 'First Step', es: 'Primer Paso' },
    description: {
      en: 'Complete your first exercise or quiz question in the study suite.',
      es: 'Completa tu primer ejercicio o pregunta de examen en la plataforma.',
    },
    tier: 'bronze',
    category: 'overall',
    iconName: 'Sparkles',
  },
  {
    id: 'halfway_hero',
    title: { en: 'Halfway Champion', es: 'Campeón de Mitad de Curso' },
    description: {
      en: 'Reach 50% overall completion across the entire curriculum.',
      es: 'Alcanza el 50% de progreso total en todo el curso.',
    },
    tier: 'silver',
    category: 'overall',
    targetPercentage: 50,
    iconName: 'Target',
  },
  {
    id: 'course_100',
    title: { en: 'Grand Master (100%)', es: 'Gran Maestro (100%)' },
    description: {
      en: 'Achieve 100% completion across all units and mock exams! Ready for top marks!',
      es: '¡Alcanza el 100% en todas las unidades y simulacros! ¡Listo para la máxima nota!',
    },
    tier: 'diamond',
    category: 'overall',
    targetPercentage: 100,
    iconName: 'Crown',
  },
  {
    id: 'quiz_ace',
    title: { en: 'Quiz Ace (100% Score)', es: 'As del Examen (100%)' },
    description: {
      en: 'Earn a flawless 100% score on any Unit Mastery Quiz.',
      es: 'Consigue una puntuación perfecta del 100% en cualquier examen de unidad.',
    },
    tier: 'gold',
    category: 'mastery',
    iconName: 'Trophy',
  },
  {
    id: 'grammar_detective',
    title: { en: 'Grammar Detective', es: 'Detective Gramatical' },
    description: {
      en: 'Solve at least 5 interactive exercises correctly.',
      es: 'Resuelve al menos 5 ejercicios interactivos correctamente.',
    },
    tier: 'silver',
    category: 'mastery',
    iconName: 'Zap',
  },
];
