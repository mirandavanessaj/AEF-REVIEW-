import { ThirdPersonVerb, ThirdPersonSubject, BilingualText } from '../types';

export const THIRD_PERSON_SUBJECTS: ThirdPersonSubject[] = [
  { subject: 'He', type: 'he', spanish: 'Él' },
  { subject: 'She', type: 'she', spanish: 'Ella' },
  { subject: 'Carlos', type: 'name', spanish: 'Carlos' },
  { subject: 'Emma', type: 'name', spanish: 'Emma' },
  { subject: 'My brother', type: 'noun', spanish: 'Mi hermano' },
  { subject: 'My sister', type: 'noun', spanish: 'Mi hermana' },
  { subject: 'The teacher', type: 'noun', spanish: 'El profesor / La profesora' },
  { subject: 'The doctor', type: 'noun', spanish: 'El médico / La médica' },
  { subject: 'That student', type: 'noun', spanish: 'Ese estudiante' },
  { subject: 'The dog', type: 'it', spanish: 'El perro' },
];

export interface ComplementOption {
  en: string;
  es: string;
  whQuestion?: {
    word: string;
    questionEnd: string;
    translation: string;
  };
}

export interface ExtendedVerb extends ThirdPersonVerb {
  complements: ComplementOption[];
}

export const THIRD_PERSON_VERBS: ExtendedVerb[] = [
  // -s rule
  {
    base: 'work',
    thirdPerson: 'works',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Most verbs add -s in the 3rd person singular affirmative.',
      es: 'La mayoría de los verbos agregan -s en la 3ra persona singular afirmativa.',
    },
    spanish: 'trabajar',
    exampleComplement: 'in a modern hospital',
    exampleComplementSpanish: 'en un hospital moderno',
    complements: [
      { en: 'in a modern hospital', es: 'en un hospital moderno', whQuestion: { word: 'Where', questionEnd: 'work', translation: '¿Dónde trabaja?' } },
      { en: 'from home on Mondays', es: 'desde casa los lunes', whQuestion: { word: 'When', questionEnd: 'work from home', translation: '¿Cuándo trabaja desde casa?' } },
      { en: 'long hours in an office', es: 'muchas horas en una oficina', whQuestion: { word: 'How many hours', questionEnd: 'work', translation: '¿Cuántas horas trabaja?' } },
    ],
  },
  {
    base: 'live',
    thirdPerson: 'lives',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Verbs ending in -e simply add -s.',
      es: 'Los verbos que terminan en -e simplemente agregan -s.',
    },
    spanish: 'vivir',
    exampleComplement: 'in a big apartment downtown',
    exampleComplementSpanish: 'en un departamento grande en el centro',
    complements: [
      { en: 'in a big apartment downtown', es: 'en un departamento grande en el centro', whQuestion: { word: 'Where', questionEnd: 'live', translation: '¿Dónde vive?' } },
      { en: 'with two roommates', es: 'con dos compañeros de cuarto', whQuestion: { word: 'Who', questionEnd: 'live with', translation: '¿Con quién vive?' } },
      { en: 'near the university', es: 'cerca de la universidad', whQuestion: { word: 'Where', questionEnd: 'live', translation: '¿Dónde vive?' } },
    ],
  },
  {
    base: 'drink',
    thirdPerson: 'drinks',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Regular consonant ending: add -s.',
      es: 'Terminación en consonante regular: agrega -s.',
    },
    spanish: 'beber / tomar',
    exampleComplement: 'two cups of coffee in the morning',
    exampleComplementSpanish: 'dos tazas de café en la mañana',
    complements: [
      { en: 'two cups of coffee every morning', es: 'dos tazas de café cada mañana', whQuestion: { word: 'What', questionEnd: 'drink in the morning', translation: '¿Qué toma en la mañana?' } },
      { en: 'green tea with honey', es: 'té verde con miel', whQuestion: { word: 'What kind of tea', questionEnd: 'drink', translation: '¿Qué tipo de té toma?' } },
      { en: 'a lot of water during exercise', es: 'mucha agua durante el ejercicio', whQuestion: { word: 'How much water', questionEnd: 'drink', translation: '¿Cuánta agua toma?' } },
    ],
  },
  {
    base: 'speak',
    thirdPerson: 'speaks',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Regular consonant ending: add -s.',
      es: 'Terminación en consonante regular: agrega -s.',
    },
    spanish: 'hablar',
    exampleComplement: 'English and Spanish fluently',
    exampleComplementSpanish: 'inglés y español con fluidez',
    complements: [
      { en: 'English and Spanish fluently', es: 'inglés y español con fluidez', whQuestion: { word: 'How many languages', questionEnd: 'speak', translation: '¿Cuántos idiomas habla?' } },
      { en: 'three languages at work', es: 'tres idiomas en el trabajo', whQuestion: { word: 'Where', questionEnd: 'speak three languages', translation: '¿Dónde habla tres idiomas?' } },
      { en: 'very quietly on the phone', es: 'muy bajito por teléfono', whQuestion: { word: 'How', questionEnd: 'speak on the phone', translation: '¿Cómo habla por teléfono?' } },
    ],
  },
  {
    base: 'play',
    thirdPerson: 'plays',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Vowel + y (a-y): do NOT change to -ies. Just add -s (plays, NOT plaies).',
      es: 'Vocal + y (a-y): NO cambia a -ies. Solo agrega -s (plays, NO plaies).',
    },
    spanish: 'jugar / tocar (instrumento)',
    exampleComplement: 'the guitar in a rock band',
    exampleComplementSpanish: 'la guitarra en una banda de rock',
    complements: [
      { en: 'the guitar in a rock band', es: 'la guitarra en una banda de rock', whQuestion: { word: 'What instrument', questionEnd: 'play', translation: '¿Qué instrumento toca?' } },
      { en: 'tennis every Saturday morning', es: 'tenis todos los sábados por la mañana', whQuestion: { word: 'When', questionEnd: 'play tennis', translation: '¿Cuándo juega al tenis?' } },
      { en: 'video games after school', es: 'videojuegos después de la escuela', whQuestion: { word: 'What', questionEnd: 'play after school', translation: '¿A qué juega después de la escuela?' } },
    ],
  },
  {
    base: 'read',
    thirdPerson: 'reads',
    ruleType: '-s',
    ruleExplanation: {
      en: 'Add -s to regular verbs.',
      es: 'Agrega -s a los verbos regulares.',
    },
    spanish: 'leer',
    exampleComplement: 'the newspaper on Sunday',
    exampleComplementSpanish: 'el periódico los domingos',
    complements: [
      { en: 'the newspaper on Sunday morning', es: 'el periódico los domingos por la mañana', whQuestion: { word: 'What', questionEnd: 'read on Sundays', translation: '¿Qué lee los domingos?' } },
      { en: 'books on the train', es: 'libros en el tren', whQuestion: { word: 'Where', questionEnd: 'read books', translation: '¿Dónde lee libros?' } },
    ],
  },

  // -es rule: -ch, -sh, -ss, -x, -o
  {
    base: 'watch',
    thirdPerson: 'watches',
    ruleType: '-es',
    ruleExplanation: {
      en: 'Verbs ending in -ch, -sh, -ss, -x add -es for pronunciation /ɪz/.',
      es: 'Los verbos terminados en -ch, -sh, -ss, -x agregan -es para facilitar la pronunciación /ɪz/.',
    },
    spanish: 'mirar / ver',
    exampleComplement: 'movies on Netflix in the evening',
    exampleComplementSpanish: 'películas en Netflix por la tarde',
    complements: [
      { en: 'movies on Netflix in the evening', es: 'películas en Netflix por la tarde', whQuestion: { word: 'What', questionEnd: 'watch in the evening', translation: '¿Qué mira por la tarde?' } },
      { en: 'the news before breakfast', es: 'las noticias antes del desayuno', whQuestion: { word: 'When', questionEnd: 'watch the news', translation: '¿Cuándo mira las noticias?' } },
      { en: 'soccer matches on weekends', es: 'partidos de fútbol los fines de semana', whQuestion: { word: 'What sports', questionEnd: 'watch', translation: '¿Qué deportes mira?' } },
    ],
  },
  {
    base: 'teach',
    thirdPerson: 'teaches',
    ruleType: '-es',
    ruleExplanation: {
      en: 'Verbs ending in -ch add -es.',
      es: 'Los verbos terminados en -ch agregan -es.',
    },
    spanish: 'enseñar',
    exampleComplement: 'mathematics at a secondary school',
    exampleComplementSpanish: 'matemáticas en una escuela secundaria',
    complements: [
      { en: 'mathematics at a secondary school', es: 'matemáticas en una escuela secundaria', whQuestion: { word: 'What subject', questionEnd: 'teach', translation: '¿Qué materia enseña?' } },
      { en: 'English to beginner students', es: 'inglés a estudiantes principiantes', whQuestion: { word: 'Who', questionEnd: 'teach English to', translation: '¿A quién le enseña inglés?' } },
    ],
  },
  {
    base: 'finish',
    thirdPerson: 'finishes',
    ruleType: '-es',
    ruleExplanation: {
      en: 'Verbs ending in -sh add -es.',
      es: 'Los verbos terminados en -sh agregan -es.',
    },
    spanish: 'terminar',
    exampleComplement: 'work at 6:00 PM every day',
    exampleComplementSpanish: 'el trabajo a las 6:00 PM todos los días',
    complements: [
      { en: 'work at 6:00 PM every day', es: 'el trabajo a las 6:00 PM todos los días', whQuestion: { word: 'What time', questionEnd: 'finish work', translation: '¿A qué hora termina el trabajo?' } },
      { en: 'classes early on Friday', es: 'las clases temprano los viernes', whQuestion: { word: 'When', questionEnd: 'finish classes early', translation: '¿Cuándo termina las clases temprano?' } },
    ],
  },
  {
    base: 'go',
    thirdPerson: 'goes',
    ruleType: '-es',
    ruleExplanation: {
      en: 'Verbs ending in -o (go, do) add -es.',
      es: 'Los verbos terminados en -o (go, do) agregan -es.',
    },
    spanish: 'ir',
    exampleComplement: 'to the gym three times a week',
    exampleComplementSpanish: 'al gimnasio tres veces por semana',
    complements: [
      { en: 'to the gym three times a week', es: 'al gimnasio tres veces por semana', whQuestion: { word: 'How often', questionEnd: 'go to the gym', translation: '¿Con qué frecuencia va al gimnasio?' } },
      { en: 'to work by subway', es: 'al trabajo en metro', whQuestion: { word: 'How', questionEnd: 'go to work', translation: '¿Cómo va al trabajo?' } },
      { en: 'to bed at 11:00 PM', es: 'a la cama a las 11:00 PM', whQuestion: { word: 'What time', questionEnd: 'go to bed', translation: '¿A qué hora se va a la cama?' } },
    ],
  },
  {
    base: 'do',
    thirdPerson: 'does',
    ruleType: '-es',
    ruleExplanation: {
      en: 'Verb ending in -o adds -es (pronounced /dʌz/).',
      es: 'El verbo terminado en -o agrega -es (se pronuncia /dʌz/).',
    },
    spanish: 'hacer',
    exampleComplement: 'yoga in the park on Sundays',
    exampleComplementSpanish: 'yoga en el parque los domingos',
    complements: [
      { en: 'yoga in the park on Sundays', es: 'yoga en el parque los domingos', whQuestion: { word: 'Where', questionEnd: 'do yoga', translation: '¿Dónde hace yoga?' } },
      { en: 'homework after dinner', es: 'la tarea después de cenar', whQuestion: { word: 'When', questionEnd: 'do homework', translation: '¿Cuándo hace la tarea?' } },
    ],
  },

  // -ies rule: consonant + y
  {
    base: 'study',
    thirdPerson: 'studies',
    ruleType: '-ies',
    ruleExplanation: {
      en: 'Consonant + y (d-y): change y to i and add -es (studies).',
      es: 'Consonante + y (d-y): cambia la y por i y agrega -es (studies).',
    },
    spanish: 'estudiar',
    exampleComplement: 'economics at the university',
    exampleComplementSpanish: 'economía en la universidad',
    complements: [
      { en: 'economics at the university', es: 'economía en la universidad', whQuestion: { word: 'What', questionEnd: 'study at university', translation: '¿Qué estudia en la universidad?' } },
      { en: 'in the library every afternoon', es: 'en la biblioteca todas las tardes', whQuestion: { word: 'Where', questionEnd: 'study in the afternoon', translation: '¿Dónde estudia por la tarde?' } },
      { en: 'for English exams with flashcards', es: 'para los exámenes de inglés con fichas', whQuestion: { word: 'How', questionEnd: 'study for exams', translation: '¿Cómo estudia para los exámenes?' } },
    ],
  },

  // Irregular
  {
    base: 'have',
    thirdPerson: 'has',
    ruleType: 'irregular',
    ruleExplanation: {
      en: 'Irregular 3rd person: have -> has (NOT haves).',
      es: 'Tercera persona irregular: have -> has (NO haves).',
    },
    spanish: 'tener / tomar (comida)',
    exampleComplement: 'a big breakfast with eggs and toast',
    exampleComplementSpanish: 'un desayuno abundante con huevos y tostadas',
    complements: [
      { en: 'a big breakfast with eggs and toast', es: 'un desayuno abundante con huevos y tostadas', whQuestion: { word: 'What', questionEnd: 'have for breakfast', translation: '¿Qué desayuna?' } },
      { en: 'a fast red car', es: 'un auto rojo rápido', whQuestion: { word: 'What kind of car', questionEnd: 'have', translation: '¿Qué tipo de auto tiene?' } },
      { en: 'two brothers and a cat', es: 'dos hermanos y un gato', whQuestion: { word: 'How many brothers', questionEnd: 'have', translation: '¿Cuántos hermanos tiene?' } },
    ],
  },
];

export interface GeneratedSentenceSet {
  subject: string;
  pronoun: 'he' | 'she' | 'it';
  baseVerb: string;
  thirdPersonVerb: string;
  complement: string;
  complementSpanish: string;
  ruleType: string;
  ruleExplanation: BilingualText;
  
  // Affirmative (+)
  affirmative: string;
  affirmativeSpanish: string;
  
  // Negative (-)
  negative: string;
  negativeSpanish: string;
  negativeGrammarNote: BilingualText;
  
  // Question (?)
  question: string;
  questionSpanish: string;
  questionGrammarNote: BilingualText;
  
  // Short Answers
  shortAnswerPositive: string;
  shortAnswerNegative: string;
  
  // Wh- question
  whQuestion?: string;
  whQuestionSpanish?: string;
}

export function generateThirdPersonSet(
  selectedSubject?: ThirdPersonSubject,
  selectedVerb?: ExtendedVerb,
  selectedComplementIndex?: number
): GeneratedSentenceSet {
  const subj = selectedSubject || THIRD_PERSON_SUBJECTS[Math.floor(Math.random() * THIRD_PERSON_SUBJECTS.length)];
  const verb = selectedVerb || THIRD_PERSON_VERBS[Math.floor(Math.random() * THIRD_PERSON_VERBS.length)];
  
  const compIndex = selectedComplementIndex !== undefined && selectedComplementIndex < verb.complements.length
    ? selectedComplementIndex
    : Math.floor(Math.random() * verb.complements.length);
  const comp = verb.complements[compIndex];

  // Determine pronoun for short answers
  let pronoun: 'he' | 'she' | 'it' = 'he';
  if (subj.type === 'she' || subj.subject === 'Emma' || subj.subject === 'My sister') {
    pronoun = 'she';
  } else if (subj.type === 'it' || subj.subject === 'The dog') {
    pronoun = 'it';
  } else if (subj.subject === 'Carlos' || subj.subject === 'My brother' || subj.type === 'he') {
    pronoun = 'he';
  } else {
    // defaults to he or she
    pronoun = 'she';
  }

  const affirmative = `${subj.subject} ${verb.thirdPerson} ${comp.en}.`;
  const negative = `${subj.subject} doesn't ${verb.base} ${comp.en}.`;
  const question = `Does ${subj.subject.toLowerCase() === 'he' || subj.subject.toLowerCase() === 'she' || subj.subject.toLowerCase() === 'it' ? subj.subject.toLowerCase() : subj.subject} ${verb.base} ${comp.en}?`;

  const affirmativeSpanish = `${subj.spanish} ${verb.spanish.toLowerCase()} ${comp.es}.`;
  const negativeSpanish = `${subj.spanish} no ${verb.spanish.toLowerCase()} ${comp.es}.`;
  const questionSpanish = `¿${subj.spanish} ${verb.spanish.toLowerCase()} ${comp.es}?`;

  let whQuestion: string | undefined;
  let whQuestionSpanish: string | undefined;

  if (comp.whQuestion) {
    const s = subj.subject.toLowerCase() === 'he' || subj.subject.toLowerCase() === 'she' || subj.subject.toLowerCase() === 'it' 
      ? subj.subject.toLowerCase() 
      : subj.subject;
    whQuestion = `${comp.whQuestion.word} does ${s} ${comp.whQuestion.questionEnd}?`;
    whQuestionSpanish = comp.whQuestion.translation;
  }

  return {
    subject: subj.subject,
    pronoun,
    baseVerb: verb.base,
    thirdPersonVerb: verb.thirdPerson,
    complement: comp.en,
    complementSpanish: comp.es,
    ruleType: verb.ruleType,
    ruleExplanation: verb.ruleExplanation,
    affirmative,
    affirmativeSpanish,
    negative,
    negativeSpanish,
    negativeGrammarNote: {
      en: `In negative sentences, use DOESN'T + base verb (${verb.base}). Do NOT say: "${subj.subject} doesn't ${verb.thirdPerson}"!`,
      es: `En oraciones negativas, usa DOESN'T + verbo base (${verb.base}). ¡NO digas: "${subj.subject} doesn't ${verb.thirdPerson}"!`,
    },
    question,
    questionSpanish,
    questionGrammarNote: {
      en: `In questions, use DOES + subject + base verb (${verb.base}) [ASI pattern: Aux + Subj + Inf]. Do NOT add -s to the main verb!`,
      es: `En preguntas, usa DOES + sujeto + verbo base (${verb.base}) [Estructura ASI: Auxiliar + Sujeto + Infinitivo]. ¡NO agregues -s al verbo principal!`,
    },
    shortAnswerPositive: `Yes, ${pronoun} does.`,
    shortAnswerNegative: `No, ${pronoun} doesn't.`,
    whQuestion,
    whQuestionSpanish,
  };
}
