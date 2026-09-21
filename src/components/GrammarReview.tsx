import React, { useState } from 'react';
import { Volume2, AlertTriangle, Lightbulb, ChevronDown, ChevronUp, BookOpen, CheckCircle2 } from 'lucide-react';
import { Language, UnitNumber, GrammarRule } from '../types';
import { GRAMMAR_RULES } from '../data/curriculum';
import { speakText } from '../utils/speech';
import { AudioPronounceButton } from './AudioPronounceButton';

interface GrammarReviewProps {
  selectedUnit: UnitNumber;
  language: Language;
}

export const GrammarReview: React.FC<GrammarReviewProps> = ({ selectedUnit, language }) => {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(GRAMMAR_RULES[0]?.id || null);

  const filteredRules = selectedUnit === 'all'
    ? GRAMMAR_RULES
    : GRAMMAR_RULES.filter((rule) => rule.unit === selectedUnit);

  const toggleExpand = (id: string) => {
    setExpandedRuleId(expandedRuleId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white p-5 rounded-2xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-800 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            {language === 'en' ? 'Core Grammatical Structures Review' : 'Repaso de Estructuras Gramaticales Clave'}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {selectedUnit === 'all'
              ? language === 'en'
                ? 'Units 1, 2, and 3 Comprehensive Grammar'
                : 'Gramática Completa de las Unidades 1, 2 y 3'
              : `${language === 'en' ? 'Unit' : 'Unidad'} ${selectedUnit} ${
                  selectedUnit === 1
                    ? '• Verb be & Possessives'
                    : selectedUnit === 2
                    ? '• Nouns, a/an, Adjectives & Imperatives'
                    : '• Present Simple & Question Order (ASI/QUASI)'
                }`}
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {language === 'en'
              ? 'Study formulas, conjugation tables, and pronunciation of every example sentence tested on American English File Level 1 exams.'
              : 'Estudia las fórmulas, tablas de conjugación y la pronunciación de cada ejemplo evaluado en los exámenes de American English File 1.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-500">
            {language === 'en' ? 'Audio Tip:' : 'Consejo de Audio:'}
          </span>
          <AudioPronounceButton
            text="Remember: Does Carlos speak English? Not Does Carlos speaks English!"
            language={language}
            size="sm"
            variant="pill"
            showSlowToggle={true}
            label={language === 'en' ? 'Play Sample Tip' : 'Escuchar Consejo'}
          />
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-4">
        {filteredRules.map((rule: GrammarRule) => {
          const isExpanded = expandedRuleId === rule.id;

          return (
            <div
              key={rule.id}
              id={`grammar-rule-${rule.id}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
            >
              {/* Header / Click to expand */}
              <button
                onClick={() => toggleExpand(rule.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start sm:items-center gap-3 flex-1">
                  <span className="shrink-0 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
                    Unit {rule.unit}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {rule.title[language]}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {rule.summary[language]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rule.formula && (
                    <span className="hidden lg:inline-block px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 text-slate-700 border border-slate-200">
                      {rule.formula}
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-5 bg-slate-50/50">
                  {/* Formula banner with Audio */}
                  {rule.formula && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-blue-900 text-white rounded-xl font-mono text-xs sm:text-sm shadow-2xs">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans text-blue-300 text-xs uppercase tracking-wider font-bold">
                          {language === 'en' ? 'Formula' : 'Fórmula'}:
                        </span>
                        <span className="font-semibold text-white">{rule.formula}</span>
                      </div>
                      <AudioPronounceButton
                        text={rule.formula}
                        language={language}
                        size="xs"
                        variant="pill"
                        label={language === 'en' ? 'Listen to Formula' : 'Escuchar Fórmula'}
                        className="self-end sm:self-auto"
                      />
                    </div>
                  )}

                  {/* Core explanation */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'en' ? 'Grammar Rule Explanation' : 'Explicación de la Regla Gramatical'}
                      </h4>
                      <AudioPronounceButton
                        text={rule.explanation.en}
                        language={language}
                        size="xs"
                        variant="subtle"
                        label={language === 'en' ? 'Listen in English' : 'Escuchar en inglés'}
                      />
                    </div>
                    <p>{rule.explanation[language]}</p>
                    {language === 'es' && (
                      <p className="pt-2 border-t border-slate-100 text-xs text-slate-500 italic">
                        English reference: {rule.explanation.en}
                      </p>
                    )}
                  </div>

                  {/* Table with audio for every example sentence & note */}
                  {rule.tableHeaders && rule.tableRows && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            {rule.tableHeaders.map((header, idx) => (
                              <th key={idx} className="px-4 py-2.5">
                                {header[language]}
                              </th>
                            ))}
                            {rule.tableHeaders.length === 2 && !rule.tableRows[0]?.note && (
                              <th className="px-4 py-2.5 text-right">
                                {language === 'en' ? 'Audio' : 'Audio'}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rule.tableRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-900 align-top">
                                {row.label[language]}
                              </td>
                              <td className="px-4 py-3 text-slate-700 font-medium align-top">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="text-slate-900">{row.example[language]}</span>
                                    {row.example.en !== row.example[language] && (
                                      <span className="block text-xs text-slate-500 font-normal mt-0.5">
                                        {row.example.en}
                                      </span>
                                    )}
                                  </div>
                                  <AudioPronounceButton
                                    text={row.example.en}
                                    language={language}
                                    size="xs"
                                    variant="icon"
                                    showSlowToggle={true}
                                    title={
                                      language === 'en'
                                        ? `Listen to: "${row.example.en}"`
                                        : `Escuchar: "${row.example.en}"`
                                    }
                                  />
                                </div>
                              </td>
                              {row.note && (
                                <td className="px-4 py-3 text-slate-600 align-top">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <span>{row.note[language]}</span>
                                      {row.note.en !== row.note[language] && (
                                        <span className="block text-xs text-slate-400 font-normal mt-0.5">
                                          {row.note.en}
                                        </span>
                                      )}
                                    </div>
                                    {row.note.en && (
                                      <AudioPronounceButton
                                        text={row.note.en}
                                        language={language}
                                        size="xs"
                                        variant="icon"
                                        showSlowToggle={true}
                                        title={
                                          language === 'en'
                                            ? `Listen to: "${row.note.en}"`
                                            : `Escuchar: "${row.note.en}"`
                                        }
                                      />
                                    )}
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Spelling Tips if available */}
                  {rule.spellingTips && rule.spellingTips.length > 0 && (
                    <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        {language === 'en' ? 'Crucial Spelling Rules' : 'Reglas de Ortografía Cruciales'}
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-900">
                        {rule.spellingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{tip[language]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Common Exam Traps / Mistakes with Audio for Correct Sentences */}
                  {rule.commonMistakes && rule.commonMistakes.length > 0 && (
                    <div className="bg-rose-50/80 border border-rose-200 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        {language === 'en' ? 'Common Test Mistakes to Avoid' : 'Errores Típicos de Examen a Evitar'}
                      </div>
                      <div className="space-y-2">
                        {rule.commonMistakes.map((mistake, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3.5 rounded-lg border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="line-through text-rose-600 font-semibold">
                                  {mistake.wrong}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className="text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                                  {mistake.correct}
                                </span>
                              </div>
                              <p className="text-slate-500">
                                <span className="font-semibold text-slate-700">
                                  {language === 'en' ? 'Why:' : 'Por qué:'}{' '}
                                </span>
                                {mistake.reason[language]}
                              </p>
                            </div>

                            <div className="shrink-0 self-end sm:self-center">
                              <AudioPronounceButton
                                text={mistake.correct}
                                language={language}
                                size="sm"
                                variant="pill"
                                showSlowToggle={true}
                                label={language === 'en' ? 'Listen Correct' : 'Escuchar Correcto'}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Practice Tip with Audio */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-blue-800 bg-blue-50/90 p-3.5 rounded-lg border border-blue-200">
                    <div className="flex items-start sm:items-center gap-2">
                      <Lightbulb className="w-4 h-4 shrink-0 text-blue-600 mt-0.5 sm:mt-0" />
                      <span>{rule.practiceTip[language]}</span>
                    </div>
                    <AudioPronounceButton
                      text={rule.practiceTip.en}
                      language={language}
                      size="xs"
                      variant="subtle"
                      label={language === 'en' ? 'Listen to Tip' : 'Escuchar Consejo'}
                      className="self-end sm:self-auto shrink-0"
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
