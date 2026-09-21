import React, { useState, useMemo, useEffect } from 'react';
import { Volume2, RotateCcw, Shuffle, Star, CheckCircle, ChevronLeft, ChevronRight, Search, BookOpen, Layers, List, LayoutGrid, Sparkles } from 'lucide-react';
import { Language, UnitNumber, Flashcard } from '../types';
import { VOCABULARY_FLASHCARDS } from '../data/curriculum';
import { speakText, stopSpeech } from '../utils/speech';
import { AudioPronounceButton } from './AudioPronounceButton';

interface FlashcardsProps {
  selectedUnit: UnitNumber;
  language: Language;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ selectedUnit, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<'all' | 'starred' | 'mastered'>('all');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

  // Filter cards by unit, category, search query, and study mode
  const filteredCards = useMemo(() => {
    let list = VOCABULARY_FLASHCARDS;

    if (selectedUnit !== 'all') {
      list = list.filter((c) => c.unit === selectedUnit);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.term.toLowerCase().includes(q) ||
          c.translation.toLowerCase().includes(q) ||
          c.exampleSentence.toLowerCase().includes(q)
      );
    }

    if (filterMode === 'starred') {
      list = list.filter((c) => starredIds.has(c.id));
    } else if (filterMode === 'mastered') {
      list = list.filter((c) => masteredIds.has(c.id));
    }

    return list;
  }, [selectedUnit, selectedCategory, searchQuery, filterMode, starredIds, masteredIds]);

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const toggleStarred = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleMastered = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const shuffleCards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    VOCABULARY_FLASHCARDS.forEach((c) => cats.add(c.category));
    return Array.from(cats);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            {language === 'en' ? 'Interactive Vocabulary Flashcards' : 'Fichas Interactivas de Vocabulario'}
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {language === 'en'
              ? 'Units 1–3 Essential Word Bank'
              : 'Banco de Palabras Esenciales: Unidades 1 a 3'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Flip to check translations, listen to authentic American pronunciation, and track your mastered terms.'
              : 'Gira para ver la traducción, escucha la pronunciación auténtica y marca tus palabras dominadas.'}
          </p>
        </div>

        {/* Mastered Progress tracker */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-medium">
              {language === 'en' ? 'Mastered Progress' : 'Progreso Dominado'}
            </div>
            <div className="text-sm font-bold text-emerald-700">
              {masteredIds.size} / {VOCABULARY_FLASHCARDS.length} ({Math.round((masteredIds.size / VOCABULARY_FLASHCARDS.length) * 100)}%)
            </div>
          </div>
          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(masteredIds.size / VOCABULARY_FLASHCARDS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search word, translation, or example...'
                  : 'Buscar palabra, traducción o ejemplo...'
              }
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">
              {language === 'en' ? 'All Categories' : 'Todas las Categorías'}
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Study Mode Filter */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'en' ? 'All' : 'Todas'}
            </button>
            <button
              onClick={() => setFilterMode('starred')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors ${
                filterMode === 'starred'
                  ? 'bg-white text-amber-600 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>({starredIds.size})</span>
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors ${
                filterMode === 'mastered'
                  ? 'bg-white text-emerald-600 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>({masteredIds.size})</span>
            </button>
          </div>

          {/* View Mode Toggle: Single Card vs Audio Word Bank */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs self-start sm:self-auto">
            <button
              onClick={() => setViewMode('card')}
              className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'en' ? 'Flashcard Flip Mode' : 'Modo Ficha Interactiva'}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Cards' : 'Fichas'}</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title={language === 'en' ? 'Audio Word Bank List View' : 'Lista de Pronunciación'}
            >
              <List className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Audio Bank' : 'Banco Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Flashcard Card */}
      {filteredCards.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-700">
            {language === 'en' ? 'No flashcards found' : 'No se encontraron fichas'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'en'
              ? 'Try changing your search term or filter selection.'
              : 'Intenta cambiar los términos de búsqueda o el filtro.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setFilterMode('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
          >
            {language === 'en' ? 'Reset Filters' : 'Restablecer Filtros'}
          </button>
        </div>
      ) : viewMode === 'card' ? (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card Container with 3D Flip effect */}
          <div
            id={`flashcard-${currentCard.id}`}
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative min-h-[320px] sm:min-h-[340px] bg-white rounded-2xl border border-slate-300 shadow-md cursor-pointer hover:border-blue-300 transition-all p-6 sm:p-8 flex flex-col justify-between select-none"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
                  Unit {currentCard.unit}
                </span>
                <span className="text-slate-600 font-medium">
                  {currentCard.categoryLabel[language]}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => toggleStarred(currentCard.id, e)}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    starredIds.has(currentCard.id)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-400'
                  }`}
                  title="Star for review"
                >
                  <Star className={`w-4 h-4 ${starredIds.has(currentCard.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => toggleMastered(currentCard.id, e)}
                  className={`p-1.5 rounded-md hover:bg-slate-100 transition-colors ${
                    masteredIds.has(currentCard.id)
                      ? 'text-emerald-600 fill-emerald-600'
                      : 'text-slate-400'
                  }`}
                  title="Mark as mastered"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card Body */}
            {!isFlipped ? (
              // FRONT SIDE: English term & pronunciation audio
              <div className="my-auto text-center space-y-4">
                <span className="text-xs uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {currentCard.partOfSpeech}
                </span>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {currentCard.term}
                  </h3>

                  {currentCard.phonetic && (
                    <p className="text-sm font-mono text-slate-500 font-medium">
                      {currentCard.phonetic}
                    </p>
                  )}
                </div>

                {/* Pronunciation Audio Action Bar */}
                <div
                  className="flex items-center justify-center gap-2 pt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AudioPronounceButton
                    text={currentCard.term}
                    language={language}
                    size="md"
                    variant="pill"
                    label={language === 'en' ? 'Listen' : 'Escuchar'}
                    showSlowToggle={true}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(`${currentCard.term}. Example: ${currentCard.exampleSentence}`);
                    }}
                    className="px-2.5 py-1 text-xs rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium cursor-pointer transition-colors"
                    title={
                      language === 'en'
                        ? 'Listen to both word and example sentence'
                        : 'Escuchar palabra y oración completa'
                    }
                  >
                    {language === 'en' ? 'Word + Sentence' : 'Palabra + Oración'}
                  </button>
                </div>

                <p className="text-xs text-slate-400 pt-3">
                  {language === 'en'
                    ? 'Tap card to flip for translation & example sentence'
                    : 'Toca la ficha para ver la traducción y oración de ejemplo'}
                </p>
              </div>
            ) : (
              // BACK SIDE: Spanish translation & contextual example with audio
              <div className="my-auto text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {language === 'en' ? 'Translation & Usage' : 'Traducción y Uso'}
                  </span>
                  {/* English pronunciation replay shortcut on back */}
                  <AudioPronounceButton
                    text={currentCard.term}
                    language={language}
                    size="xs"
                    variant="badge"
                    label={currentCard.term}
                  />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-emerald-700">
                  {currentCard.translation}
                </h3>

                {/* Example sentence with dedicated text-to-speech button */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-slate-500">
                      {language === 'en' ? 'Example in Context:' : 'Ejemplo en Contexto:'}
                    </span>
                    <AudioPronounceButton
                      text={currentCard.exampleSentence}
                      language={language}
                      size="sm"
                      variant="pill"
                      label={language === 'en' ? 'Listen to sentence' : 'Escuchar oración'}
                      showSlowToggle={true}
                    />
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    "{currentCard.exampleSentence}"
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    "{currentCard.exampleTranslation}"
                  </p>
                </div>

                {/* Notes if any */}
                {currentCard.notes && (
                  <p className="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg text-left border border-amber-200">
                    <span className="font-bold">Tip: </span>
                    {currentCard.notes[language]}
                  </p>
                )}
              </div>
            )}

            {/* Card Footer / Flip trigger hint */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <RotateCcw className="w-3.5 h-3.5" />
                {language === 'en' ? 'Click card to flip' : 'Clic en la tarjeta para voltear'}
              </span>
              <span className="font-mono">
                {currentIndex + 1} / {filteredCards.length}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 px-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Previous' : 'Anterior'}</span>
            </button>

            <button
              onClick={shuffleCards}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              title="Reset to first card"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
            >
              <span>{language === 'en' ? 'Next' : 'Siguiente'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Audio Word Bank List Mode */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                {language === 'en'
                  ? `Pronunciation Word Bank (${filteredCards.length} terms)`
                  : `Banco de Pronunciación (${filteredCards.length} términos)`}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {language === 'en'
                ? 'Click speaker to hear pronunciation & sentences'
                : 'Haz clic en el altavoz para escuchar pronunciaciones y oraciones'}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredCards.map((card, idx) => (
              <div
                key={card.id}
                className="p-4 hover:bg-blue-50/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Term, phonetic, audio button */}
                <div className="space-y-1 md:w-1/3">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      U{card.unit}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{card.term}</h4>
                    {card.phonetic && (
                      <span className="text-xs font-mono text-slate-400">
                        {card.phonetic}
                      </span>
                    )}
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {card.partOfSpeech}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <AudioPronounceButton
                      text={card.term}
                      language={language}
                      size="sm"
                      variant="pill"
                      showSlowToggle={true}
                      label={language === 'en' ? 'Word' : 'Palabra'}
                    />
                    <span className="text-xs font-medium text-emerald-700">
                      = {card.translation}
                    </span>
                  </div>
                </div>

                {/* Middle: Example sentence with audio */}
                <div className="space-y-1 md:flex-1 md:px-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-slate-800">
                      "{card.exampleSentence}"
                    </p>
                    <AudioPronounceButton
                      text={card.exampleSentence}
                      language={language}
                      size="xs"
                      variant="subtle"
                      label={language === 'en' ? 'Sentence' : 'Oración'}
                      showSlowToggle={true}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    "{card.exampleTranslation}"
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => toggleStarred(card.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      starredIds.has(card.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Star card"
                  >
                    <Star className={`w-3.5 h-3.5 ${starredIds.has(card.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleMastered(card.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      masteredIds.has(card.id)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600 font-bold'
                        : 'border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                    title="Mark mastered"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
