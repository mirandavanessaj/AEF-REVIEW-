import React from 'react';
import { X, BookOpen, CheckCircle, Lightbulb, Languages, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {language === 'en' ? 'American English File 1 • Exam Syllabus' : 'Temario del Examen • Unidades 1 a 3'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'en' ? 'Test Review Guide for Units 1, 2, and 3' : 'Guía de Repaso para el Examen'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Modules */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Unit 1 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {language === 'en' ? 'Unit 1: Grammar & Vocabulary' : 'Unidad 1: Gramática y Vocabulario'}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><span className="font-semibold">Grammar:</span> Verb <em>be</em> (+, -, ?, short answers); Subject pronouns (I, you, he...) vs. Possessive adjectives (my, your, his, her...).</li>
              <li><span className="font-semibold">Vocabulary:</span> Days of the week, numbers 0-20, countries & nationalities (the US/American, Mexico/Mexican, Spain/Spanish), classroom phrases.</li>
            </ul>
          </div>

          {/* Unit 2 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {language === 'en' ? 'Unit 2: Grammar & Vocabulary' : 'Unidad 2: Gramática y Vocabulario'}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><span className="font-semibold">Grammar:</span> Singular & plural nouns (-s, -es, irregulars like child/children, person/people); articles <em>a / an</em>; demonstratives (<em>this, that, these, those</em>); Adjectives (never add -s; place before noun or after <em>be</em>); Imperatives and <em>Let's</em>.</li>
              <li><span className="font-semibold">Vocabulary:</span> Everyday objects (keys, wallet, umbrella, watch, glasses); feelings (hungry, thirsty, tired, cold, hot); opposites (cheap/expensive, easy/difficult).</li>
            </ul>
          </div>

          {/* Unit 3 */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              {language === 'en' ? 'Unit 3: Present Simple & 3rd Person Focus' : 'Unidad 3: Presente Simple y Enfoque 3ra Persona'}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
              <li><span className="font-semibold">Grammar:</span> Present Simple affirmative (+s, -es, -ies, has); negative (<em>don't / doesn't + base verb</em>); questions & word order (<strong>ASI</strong> = Aux + Subj + Inf; <strong>QUASI</strong> = Q-word + Aux + Subj + Inf).</li>
              <li><span className="font-semibold">Vocabulary:</span> Common verb phrases (live in an apartment, drink coffee, listen to music, play soccer); jobs & professions (doctor, nurse, teacher, waiter).</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-xs text-amber-900">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              {language === 'en' ? 'Top 3 Test Traps to Remember:' : 'Las 3 Trampas Clave del Examen:'}
            </div>
            <ol className="list-decimal list-inside space-y-1">
              <li><strong>Affirmative short answers with BE:</strong> Never contract! Say <em>"Yes, I am"</em> (NOT <em>"Yes, I'm"</em>).</li>
              <li><strong>Adjectives in plural:</strong> Adjectives never change! Say <em>"two blue pens"</em> (NOT <em>"two blues pens"</em>).</li>
              <li><strong>3rd person negative and questions:</strong> The verb returns to base form after <em>doesn't</em> and <em>does</em>! Say <em>"She doesn't work"</em> (NOT <em>"She doesn't works"</em>).</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Languages className="w-4 h-4 text-blue-600" />
            <span>
              {language === 'en'
                ? 'Use the EN/ES toggle anytime you need Spanish explanations.'
                : 'Usa el botón EN/ES en cualquier momento para explicaciones en español.'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            {language === 'en' ? 'Got it!' : '¡Entendido!'}
          </button>
        </div>
      </div>
    </div>
  );
};
