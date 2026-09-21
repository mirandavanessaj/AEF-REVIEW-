import React, { useState } from 'react';
import { Sparkles, Volume2, Shuffle, ArrowRight, HelpCircle, Check, AlertCircle, BookmarkCheck, BookOpen } from 'lucide-react';
import { Language, ThirdPersonSubject } from '../types';
import {
  THIRD_PERSON_SUBJECTS,
  THIRD_PERSON_VERBS,
  generateThirdPersonSet,
  GeneratedSentenceSet,
  ExtendedVerb,
} from '../data/thirdPersonData';
import { speakText } from '../utils/speech';
import { AudioPronounceButton } from './AudioPronounceButton';

interface ThirdPersonGeneratorProps {
  language: Language;
}

export const ThirdPersonGenerator: React.FC<ThirdPersonGeneratorProps> = ({ language }) => {
  const [selectedSubject, setSelectedSubject] = useState<ThirdPersonSubject>(THIRD_PERSON_SUBJECTS[0]);
  const [selectedVerb, setSelectedVerb] = useState<ExtendedVerb>(THIRD_PERSON_VERBS[0]);
  const [complementIndex, setComplementIndex] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'generator' | 'practice' | 'spelling_rules'>('generator');

  // Generated results
  const [generatedSet, setGeneratedSet] = useState<GeneratedSentenceSet>(() =>
    generateThirdPersonSet(THIRD_PERSON_SUBJECTS[0], THIRD_PERSON_VERBS[0], 0)
  );

  // Drill State for practice mode
  const [drillTarget, setDrillTarget] = useState<{
    subject: ThirdPersonSubject;
    verb: ExtendedVerb;
    type: 'affirmative' | 'negative' | 'question';
    correctAnswer: string;
    explanation: string;
  } | null>(null);
  const [userDrillInput, setUserDrillInput] = useState('');
  const [drillFeedback, setDrillFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [drillScore, setDrillScore] = useState({ correct: 0, total: 0 });

  // Update generated sentence when selections change
  const handleUpdate = (
    subj = selectedSubject,
    verb = selectedVerb,
    compIdx = complementIndex
  ) => {
    setSelectedSubject(subj);
    setSelectedVerb(verb);
    const validIdx = compIdx < verb.complements.length ? compIdx : 0;
    setComplementIndex(validIdx);
    const set = generateThirdPersonSet(subj, verb, validIdx);
    setGeneratedSet(set);
  };

  const handleRandomize = () => {
    const randomSubj = THIRD_PERSON_SUBJECTS[Math.floor(Math.random() * THIRD_PERSON_SUBJECTS.length)];
    const randomVerb = THIRD_PERSON_VERBS[Math.floor(Math.random() * THIRD_PERSON_VERBS.length)];
    const randomCompIdx = Math.floor(Math.random() * randomVerb.complements.length);
    handleUpdate(randomSubj, randomVerb, randomCompIdx);
  };

  // Start or regenerate practice drill
  const generateNewDrill = () => {
    const subj = THIRD_PERSON_SUBJECTS[Math.floor(Math.random() * THIRD_PERSON_SUBJECTS.length)];
    const verb = THIRD_PERSON_VERBS[Math.floor(Math.random() * THIRD_PERSON_VERBS.length)];
    const comp = verb.complements[0];
    const types: ('affirmative' | 'negative' | 'question')[] = ['affirmative', 'negative', 'question'];
    const type = types[Math.floor(Math.random() * types.length)];

    let correctAnswer = '';
    let explanation = '';

    if (type === 'affirmative') {
      correctAnswer = `${subj.subject} ${verb.thirdPerson} ${comp.en}.`;
      explanation = `Affirmative: Use 3rd person singular verb form "${verb.thirdPerson}" (${verb.ruleExplanation[language]}).`;
    } else if (type === 'negative') {
      correctAnswer = `${subj.subject} doesn't ${verb.base} ${comp.en}.`;
      explanation = `Negative: Use "doesn't" + base verb "${verb.base}". Never say "doesn't ${verb.thirdPerson}"!`;
    } else {
      const lowerSubj = subj.subject.toLowerCase() === 'he' || subj.subject.toLowerCase() === 'she' || subj.subject.toLowerCase() === 'it'
        ? subj.subject.toLowerCase()
        : subj.subject;
      correctAnswer = `Does ${lowerSubj} ${verb.base} ${comp.en}?`;
      explanation = `Question: Use ASI structure (Does + Subject + Base verb "${verb.base}").`;
    }

    setDrillTarget({
      subject: subj,
      verb,
      type,
      correctAnswer,
      explanation,
    });
    setUserDrillInput('');
    setDrillFeedback(null);
  };

  const checkDrillAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!drillTarget || !userDrillInput.trim()) return;

    // Normalizing punctuation and spaces for fair evaluation
    const cleanUser = userDrillInput.trim().replace(/\s+/g, ' ').replace(/[.?!]$/, '').toLowerCase();
    const cleanTarget = drillTarget.correctAnswer.trim().replace(/\s+/g, ' ').replace(/[.?!]$/, '').toLowerCase();

    // Also accept contraction variants (does not vs doesn't)
    const cleanTargetAlt = cleanTarget.replace("doesn't", "does not");
    const cleanUserAlt = cleanUser.replace("doesn't", "does not");

    const isMatch = cleanUser === cleanTarget || cleanUserAlt === cleanTargetAlt;

    setDrillScore((prev) => ({
      correct: prev.correct + (isMatch ? 1 : 0),
      total: prev.total + 1,
    }));

    setDrillFeedback({
      isCorrect: isMatch,
      message: isMatch
        ? language === 'en'
          ? 'Excellent! Correct 3rd person structure.'
          : '¡Excelente! Estructura de 3ra persona correcta.'
        : language === 'en'
        ? `Not quite. Correct answer: "${drillTarget.correctAnswer}"`
        : `Casi. La respuesta correcta es: "${drillTarget.correctAnswer}"`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-white p-5 rounded-2xl border border-purple-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            {language === 'en' ? 'Unit 3 Dedicated Master Tool' : 'Herramienta Dedicada Unidad 3'}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'en'
              ? '3rd Person Singular Sentence & Question Generator'
              : 'Generador de Oraciones y Preguntas en 3ra Persona'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {language === 'en'
              ? 'Generate affirmative (+), negative (-), and question (?) structures for he/she/it with full spelling rules, audio, and bilingual analysis.'
              : 'Genera estructuras afirmativas (+), negativas (-) e interrogativas (?) para he/she/it con reglas ortográficas, audio y análisis bilingüe.'}
          </p>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex rounded-xl border border-purple-200 bg-white p-1 text-xs font-semibold shadow-2xs">
          <button
            id="subtab-generator"
            onClick={() => setActiveSubTab('generator')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'generator'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Interactive Generator' : 'Generador Interactivo'}
          </button>
          <button
            id="subtab-practice"
            onClick={() => {
              setActiveSubTab('practice');
              if (!drillTarget) generateNewDrill();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'practice'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Practice Drill' : 'Reto Práctico'}
          </button>
          <button
            id="subtab-rules"
            onClick={() => setActiveSubTab('spelling_rules')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'spelling_rules'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'en' ? 'Spelling Rules Guide' : 'Reglas Ortográficas'}
          </button>
        </div>
      </div>

      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {language === 'en' ? 'Sentence Builder Controls' : 'Configurar Elementos'}
              </h3>
              <button
                id="randomize-3rd-person-btn"
                onClick={handleRandomize}
                className="flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                title="Randomize combination"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Randomize' : 'Aleatorio'}</span>
              </button>
            </div>

            {/* 1. Subject Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                1. {language === 'en' ? 'Select 3rd Person Subject (he/she/it):' : 'Selecciona Sujeto (3ra persona):'}
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {THIRD_PERSON_SUBJECTS.map((subj) => {
                  const isSelected = selectedSubject.subject === subj.subject;
                  return (
                    <button
                      key={subj.subject}
                      onClick={() => handleUpdate(subj, selectedVerb, complementIndex)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div className="truncate">{subj.subject}</div>
                      <div className="text-[10px] text-slate-400 truncate">{subj.spanish}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Verb Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                2. {language === 'en' ? 'Select Verb (observe ending rule):' : 'Selecciona Verbo (observa la regla):'}
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {THIRD_PERSON_VERBS.map((verb) => {
                  const isSelected = selectedVerb.base === verb.base;
                  return (
                    <button
                      key={verb.base}
                      onClick={() => handleUpdate(selectedSubject, verb, 0)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <div>
                        <span className="font-semibold">{verb.base}</span>
                        <span className="text-slate-400 ml-1.5">({verb.spanish})</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          verb.ruleType === '-es'
                            ? 'bg-amber-100 text-amber-800'
                            : verb.ruleType === '-ies'
                            ? 'bg-rose-100 text-rose-800'
                            : verb.ruleType === 'irregular'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {verb.ruleType}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Complement Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                3. {language === 'en' ? 'Select Complement / Context:' : 'Selecciona Complemento / Contexto:'}
              </label>
              <div className="space-y-1">
                {selectedVerb.complements.map((comp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUpdate(selectedSubject, selectedVerb, idx)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
                      complementIndex === idx
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="truncate font-medium">{comp.en}</div>
                    <div className="text-[10px] text-slate-400 truncate">{comp.es}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Results & Explanations (Right) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Rule Indicator Badge */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase bg-purple-100 text-purple-800">
                  {generatedSet.ruleType} rule
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {language === 'en' ? 'Base Verb Conjugation' : 'Conjugación del Verbo Base'}
                  </h4>
                  <p className="text-sm font-bold text-slate-900">
                    {generatedSet.baseVerb} →{' '}
                    <span className="text-purple-700 underline font-black">
                      {generatedSet.thirdPersonVerb}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-600 max-w-sm">
                <span className="font-semibold text-slate-800">
                  {language === 'en' ? 'Rule explanation: ' : 'Explicación: '}
                </span>
                {generatedSet.ruleExplanation[language]}
              </div>
            </div>

            {/* Generated Structure 1: Affirmative (+) */}
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-emerald-500 border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span>+</span> {language === 'en' ? 'Affirmative Sentence' : 'Oración Afirmativa'}
                </span>
                <AudioPronounceButton
                  text={generatedSet.affirmative}
                  language={language}
                  size="sm"
                  variant="pill"
                  showSlowToggle={true}
                  label={language === 'en' ? 'Listen' : 'Escuchar'}
                />
              </div>

              <p className="text-lg font-bold text-slate-900 tracking-tight">
                {generatedSet.subject}{' '}
                <span className="text-emerald-700 underline decoration-2 font-black">
                  {generatedSet.thirdPersonVerb}
                </span>{' '}
                {generatedSet.complement}.
              </p>

              <p className="text-xs text-slate-500 italic">
                {generatedSet.affirmativeSpanish}
              </p>

              <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                <span className="font-bold">✓ Form:</span> Subject ({generatedSet.subject}) + Verb-s ({generatedSet.thirdPersonVerb}) + Complement.
              </div>
            </div>

            {/* Generated Structure 2: Negative (-) */}
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-rose-500 border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 flex items-center gap-1">
                  <span>–</span> {language === 'en' ? 'Negative Sentence' : 'Oración Negativa'}
                </span>
                <AudioPronounceButton
                  text={generatedSet.negative}
                  language={language}
                  size="sm"
                  variant="pill"
                  showSlowToggle={true}
                  label={language === 'en' ? 'Listen' : 'Escuchar'}
                />
              </div>

              <p className="text-lg font-bold text-slate-900 tracking-tight">
                {generatedSet.subject}{' '}
                <span className="text-rose-700 font-black">doesn't</span>{' '}
                <span className="text-slate-900 underline font-black">
                  {generatedSet.baseVerb}
                </span>{' '}
                {generatedSet.complement}.
              </p>

              <p className="text-xs text-slate-500 italic">
                {generatedSet.negativeSpanish}
              </p>

              <div className="text-[11px] text-rose-800 bg-rose-50/70 p-2 rounded-lg border border-rose-100 flex items-start gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{generatedSet.negativeGrammarNote[language]}</span>
              </div>
            </div>

            {/* Generated Structure 3: Yes/No Question (?) & Short Answers */}
            <div className="bg-white p-5 rounded-xl border-l-4 border-l-purple-500 border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-purple-100 text-purple-800 flex items-center gap-1">
                  <span>?</span> {language === 'en' ? 'Yes / No Question (ASI)' : 'Pregunta Sí / No (ASI)'}
                </span>
                <AudioPronounceButton
                  text={generatedSet.question}
                  language={language}
                  size="sm"
                  variant="pill"
                  showSlowToggle={true}
                  label={language === 'en' ? 'Listen' : 'Escuchar'}
                />
              </div>

              <p className="text-lg font-bold text-slate-900 tracking-tight">
                <span className="text-purple-700 font-black">Does</span>{' '}
                {generatedSet.subject.toLowerCase() === 'he' || generatedSet.subject.toLowerCase() === 'she' || generatedSet.subject.toLowerCase() === 'it'
                  ? generatedSet.subject.toLowerCase()
                  : generatedSet.subject}{' '}
                <span className="text-slate-900 underline font-black">
                  {generatedSet.baseVerb}
                </span>{' '}
                {generatedSet.complement}?
              </p>

              <p className="text-xs text-slate-500 italic">
                {generatedSet.questionSpanish}
              </p>

              {/* Short answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {language === 'en' ? 'Short Answer (+):' : 'Respuesta Corta (+):'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      {generatedSet.shortAnswerPositive}
                    </span>
                  </div>
                  <AudioPronounceButton
                    text={generatedSet.shortAnswerPositive}
                    language={language}
                    size="xs"
                    variant="icon"
                    showSlowToggle={true}
                    title={language === 'en' ? 'Listen to affirmative answer' : 'Escuchar respuesta afirmativa'}
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      {language === 'en' ? 'Short Answer (-):' : 'Respuesta Corta (-):'}
                    </span>
                    <span className="font-bold text-rose-700">
                      {generatedSet.shortAnswerNegative}
                    </span>
                  </div>
                  <AudioPronounceButton
                    text={generatedSet.shortAnswerNegative}
                    language={language}
                    size="xs"
                    variant="icon"
                    showSlowToggle={true}
                    title={language === 'en' ? 'Listen to negative answer' : 'Escuchar respuesta negativa'}
                  />
                </div>
              </div>

              <div className="text-[11px] text-purple-900 bg-purple-50/70 p-2 rounded-lg border border-purple-100">
                <span className="font-bold">ASI Formula:</span> Auxiliary (Does) + Subject ({generatedSet.subject}) + Infinitive ({generatedSet.baseVerb}).
              </div>
            </div>

            {/* Generated Structure 4: Wh- Question (QUASI) */}
            {generatedSet.whQuestion && (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-700 uppercase tracking-wider text-[11px]">
                    {language === 'en' ? 'Information Question (QUASI):' : 'Pregunta de Información (QUASI):'}
                  </span>
                  <AudioPronounceButton
                    text={generatedSet.whQuestion}
                    language={language}
                    size="sm"
                    variant="pill"
                    showSlowToggle={true}
                    label={language === 'en' ? 'Listen' : 'Escuchar'}
                  />
                </div>
                <p className="text-base font-bold text-slate-900">
                  {generatedSet.whQuestion}
                </p>
                {generatedSet.whQuestionSpanish && (
                  <p className="text-xs text-slate-500 italic">
                    {generatedSet.whQuestionSpanish}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Interactive Practice Drill */}
      {activeSubTab === 'practice' && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? '3rd Person Conjugation Drill' : 'Reto de Conjugación de 3ra Persona'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Form the exact sentence requested below. Watch out for spelling and auxiliary changes!'
                  : 'Arma la oración solicitada. ¡Cuidado con la ortografía y el uso de auxiliares!'}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block">SCORE</span>
              <span className="text-sm font-bold text-purple-700">
                {drillScore.correct} / {drillScore.total}
              </span>
            </div>
          </div>

          {drillTarget && (
            <div className="space-y-4">
              {/* Challenge Card */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                    {language === 'en' ? 'Target Structure' : 'Estructura Solicitada'}:
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      drillTarget.type === 'affirmative'
                        ? 'bg-emerald-100 text-emerald-800'
                        : drillTarget.type === 'negative'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {drillTarget.type === 'affirmative'
                      ? '(+) Affirmative'
                      : drillTarget.type === 'negative'
                      ? '(–) Negative'
                      : '(?) Question'}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-800 space-y-1">
                  <div>
                    <span className="text-slate-500 font-normal">Subject:</span>{' '}
                    <span className="text-purple-900 font-bold">{drillTarget.subject.subject}</span>{' '}
                    <span className="text-slate-400 text-xs">({drillTarget.subject.spanish})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-normal">Base Verb:</span>{' '}
                    <span className="text-purple-900 font-bold">{drillTarget.verb.base}</span>{' '}
                    <span className="text-slate-400 text-xs">({drillTarget.verb.spanish})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-normal">Complement:</span>{' '}
                    <span className="text-slate-700">{drillTarget.verb.complements[0].en}</span>
                  </div>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={checkDrillAnswer} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'en' ? 'Type the full sentence:' : 'Escribe la oración completa:'}
                  </label>
                  <input
                    type="text"
                    value={userDrillInput}
                    onChange={(e) => setUserDrillInput(e.target.value)}
                    placeholder={
                      drillTarget.type === 'affirmative'
                        ? `${drillTarget.subject.subject} ...`
                        : drillTarget.type === 'negative'
                        ? `${drillTarget.subject.subject} doesn't ...`
                        : `Does ${drillTarget.subject.subject.toLowerCase()} ...?`
                    }
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-purple-700 shadow-2xs transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Check Sentence' : 'Comprobar Oración'}
                  </button>

                  <button
                    type="button"
                    onClick={generateNewDrill}
                    className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    {language === 'en' ? 'Next Prompt' : 'Siguiente'}
                  </button>
                </div>
              </form>

              {/* Feedback */}
              {drillFeedback && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    drillFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {drillFeedback.isCorrect ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                    )}
                    <span>{drillFeedback.message}</span>
                  </div>

                  <p className="text-xs text-slate-700">
                    <span className="font-semibold">Rule:</span> {drillTarget.explanation}
                  </p>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => speakText(drillTarget.correctAnswer)}
                      className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-medium"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Listen to correct answer' : 'Escuchar respuesta correcta'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: Spelling Rules Reference Table */}
      {activeSubTab === 'spelling_rules' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'en'
                ? '3rd Person Singular Spelling Rules Cheat-Sheet'
                : 'Tabla Resumen de Reglas Ortográficas de la 3ra Persona'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'These spelling changes apply ONLY to affirmative sentences with he, she, and it.'
                : 'Estos cambios ortográficos se aplican ÚNICAMENTE en oraciones afirmativas con he, she e it.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rule 1 */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  1. General Rule: Add -s
                </span>
                <span className="text-xs font-mono font-bold text-blue-600">+s</span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'en'
                  ? 'Most verbs simply add -s to the base form.'
                  : 'La gran mayoría de los verbos simplemente agregan -s.'}
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100 text-xs font-mono text-slate-800 space-y-1">
                <div>work → <span className="font-bold text-blue-700">works</span></div>
                <div>live → <span className="font-bold text-blue-700">lives</span></div>
                <div>speak → <span className="font-bold text-blue-700">speaks</span></div>
                <div>drink → <span className="font-bold text-blue-700">drinks</span></div>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  2. Endings in -ch, -sh, -ss, -x, -o
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">+es</span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'en'
                  ? 'Add -es for pronunciation ease (/ɪz/).'
                  : 'Se agrega -es para facilitar la pronunciación (/ɪz/).'}
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-amber-100 text-xs font-mono text-slate-800 space-y-1">
                <div>watch → <span className="font-bold text-amber-700">watches</span></div>
                <div>teach → <span className="font-bold text-amber-700">teaches</span></div>
                <div>finish → <span className="font-bold text-amber-700">finishes</span></div>
                <div>go → <span className="font-bold text-amber-700">goes</span> / do → <span className="font-bold text-amber-700">does</span></div>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  3. Consonant + y vs. Vowel + y
                </span>
                <span className="text-xs font-mono font-bold text-rose-600">-ies vs. -s</span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'en'
                  ? 'Consonant + y changes to -ies. Vowel + y just adds -s.'
                  : 'Consonante + y cambia a -ies. Vocal + y solo agrega -s.'}
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-rose-100 text-xs font-mono text-slate-800 space-y-1">
                <div>study → <span className="font-bold text-rose-700">studies</span> (d + y)</div>
                <div>fly → <span className="font-bold text-rose-700">flies</span> (l + y)</div>
                <div className="pt-1 text-slate-500">BUT: play → <span className="font-bold text-emerald-700">plays</span> (a + y, vowel!)</div>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-800">
                  4. Irregular 3rd Person
                </span>
                <span className="text-xs font-mono font-bold text-purple-600">have → has</span>
              </div>
              <p className="text-xs text-slate-600">
                {language === 'en'
                  ? 'Key irregular verb in Unit 3: have becomes has (NEVER haves!).'
                  : 'Verbo irregular clave en la Unidad 3: have se convierte en has (¡JAMÁS haves!).'}
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-purple-100 text-xs font-mono text-slate-800 space-y-1">
                <div>have → <span className="font-bold text-purple-700">has</span></div>
                <div>be → <span className="font-bold text-purple-700">is</span></div>
                <div className="text-[11px] text-slate-500">Example: He has a new car.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
