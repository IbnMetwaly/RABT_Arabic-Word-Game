
import React from 'react';
import { Word, Category } from '../types';

interface WordCardProps {
  word: Word;
  category?: Category;
  isSelected: boolean;
  isWrong: boolean;
  onClick: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, category, isSelected, isWrong, onClick }) => {
  const getStyles = () => {
    if (word.isSolved && category) {
      return "opacity-90 cursor-default shadow-sm animate-solve-pop z-0";
    }
    if (isWrong) {
      return "bg-rose-500 border-rose-700 text-white animate-shake glossy-3d z-20";
    }
    if (isSelected) {
      return "bg-amber-400 border-amber-600 text-amber-900 shadow-xl animate-selection-bounce glossy-3d z-10 ring-4 ring-amber-200/50";
    }
    return "bg-white border-amber-100 text-slate-700 hover:border-amber-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer glossy-3d active:scale-95";
  };

  const solvedStyle = word.isSolved && category ? {
    backgroundColor: `${category.color}20`,
    borderColor: category.color,
    color: category.color,
    borderBottomWidth: '4px'
  } : {};

  return (
    <div
      onClick={!word.isSolved ? onClick : undefined}
      style={solvedStyle}
      className={`
        relative ${getStyles()}
        h-full w-full flex items-center justify-center py-0.5 px-1 sm:py-1 sm:px-2
        border-b-2 sm:border-b-3 rounded-xl select-none
        transform transition-all duration-150 ease-out
      `}
    >
      {/* Beginner Category Dot */}
      {!word.isSolved && category && (
        <div 
          className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full shadow-sm ring-1 ring-white/50"
          style={{ backgroundColor: category.color }}
        />
      )}

      {/* Solved Icon */}
      {word.isSolved && category && (
        <div 
          className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[10px] border border-black/5"
        >
          {category.icon}
        </div>
      )}

      {/* Selection Tick */}
      {isSelected && !word.isSolved && (
        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm">
          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
        </div>
      )}
      
      <span className={`
        font-black 
        leading-tight
        whitespace-nowrap
        text-center
        w-full
        text-xs sm:text-sm md:text-base
        ${word.isSolved ? 'scale-90 opacity-70' : ''}
      `}>
        {word.text}
      </span>
    </div>
  );
};
