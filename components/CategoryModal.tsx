import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Word } from '../types';
import { getWordDetail } from '../wordFacts';

interface CategoryModalProps {
  category: Category | null;
  words?: Word[];
  onClose: () => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  category,
  words = [],
  onClose
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!category) return null;

  // Filter words that belong to this category (or use empty if not supplied)
  const categoryWords = words.filter(w => w.categoryId === category.id);
  const wordList = categoryWords.length > 0 
    ? categoryWords.map(w => w.text) 
    : (category.wordFacts ? Object.keys(category.wordFacts) : []);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-amber-100 flex flex-col my-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header with category banner */}
          <div 
            className="p-5 sm:p-6 text-white relative shadow-md"
            style={{ backgroundColor: category.color }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer"
              title="إغلاق"
              aria-label="إغلاق"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl sm:text-4xl filter drop-shadow">{category.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black drop-shadow-sm">{category.title}</h2>
                  <span className="bg-white/25 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/30 backdrop-blur-xs">
                    مجموعة مكتملة ✓
                  </span>
                </div>
                <p className="text-white/90 text-xs sm:text-sm font-medium mt-0.5">
                  {category.description}
                </p>
              </div>
            </div>
          </div>

          {/* Subheader hint */}
          <div className="bg-amber-50/70 px-5 py-2.5 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-bold">
            <span className="flex items-center gap-1.5">
              <span>💡</span>
              <span>معاني وفوائد كلمات هذه المجموعة:</span>
            </span>
            <span className="text-[11px] text-amber-700/80 bg-white px-2 py-0.5 rounded-lg border border-amber-100">
              {wordList.length} كلمات
            </span>
          </div>

          {/* Content: List of words and their details */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 divide-y divide-slate-100/80">
            {wordList.map((wordText, idx) => {
              const detail = getWordDetail(wordText, category);
              return (
                <div 
                  key={idx} 
                  className={`pt-3.5 first:pt-0 flex flex-col gap-2 rounded-2xl p-3 sm:p-3.5 transition-colors bg-slate-50/70 hover:bg-amber-50/40 border border-slate-100/80`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-lg font-black text-slate-800 tracking-wide font-sans">
                        {wordText}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      كلمة {idx + 1}
                    </span>
                  </div>

                  {/* Definition */}
                  <div className="text-xs text-slate-700 leading-relaxed pr-1 flex items-start gap-2">
                    <span className="text-slate-400 text-xs shrink-0 select-none font-bold">📖 المعنى:</span>
                    <span className="font-medium text-slate-600">{detail.definition}</span>
                  </div>

                  {/* Interesting Fact */}
                  {detail.fact && (
                    <div className="text-xs text-amber-950 bg-amber-100/40 border border-amber-200/50 rounded-xl p-2.5 leading-relaxed flex items-start gap-2">
                      <span className="text-amber-600 text-sm shrink-0 select-none">✨</span>
                      <div>
                        <span className="font-bold text-amber-800 ml-1">معلومة شيقة:</span>
                        <span className="font-normal text-slate-700">{detail.fact}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>متابعة اللعب</span>
              <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
