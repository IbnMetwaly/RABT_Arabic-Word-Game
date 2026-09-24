
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Word, Category } from '../types';

interface WordCardProps {
  word: Word;
  category?: Category;
  isSelected: boolean;
  isWrong: boolean;
  isSuccess?: boolean;
  onClick: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, category, isSelected, isWrong, isSuccess, onClick }) => {
  const getStyles = () => {
    if (word.isSolved && category) {
      return "opacity-90 cursor-default shadow-sm animate-solve-pop z-0";
    }
    if (isWrong) {
      return "bg-rose-500 border-rose-700 text-white animate-shake glossy-3d z-20";
    }
    if (isSuccess) {
      return "bg-emerald-500 border-emerald-700 text-white shadow-xl animate-solve-pop glossy-3d z-20 ring-4 ring-emerald-300";
    }
    if (isSelected) {
      return "bg-amber-400 border-amber-600 text-black shadow-xl glossy-3d z-10 ring-4 ring-amber-300/80 word-card-selected";
    }
    return "bg-white border-amber-100 text-slate-700 hover:border-amber-300 hover:shadow-md cursor-pointer glossy-3d";
  };

  const solvedStyle = word.isSolved && category ? {
    backgroundColor: `${category.color}20`,
    borderColor: category.color,
    color: category.color,
    borderBottomWidth: '2px'
  } : {};

  return (
    <motion.button
      type="button"
      data-selected={isSelected ? "true" : undefined}
      onClick={!word.isSolved ? onClick : undefined}
      disabled={word.isSolved}
      style={{
        ...solvedStyle,
        ...(isSelected ? {
          backgroundColor: '#FBBF24',
          borderColor: '#D97706',
          color: '#000000',
          WebkitTextFillColor: '#000000',
          forcedColorAdjust: 'none',
          colorScheme: 'only light'
        } : {})
      }}
      animate={{
        scale: isSelected ? 1.03 : 1,
        y: isSelected ? -2.5 : 0,
      }}
      whileHover={!word.isSolved ? { scale: isSelected ? 1.04 : 1.02, y: isSelected ? -3 : -1 } : undefined}
      whileTap={!word.isSolved ? { scale: 0.94, y: 0 } : undefined}
      transition={{
        type: "spring",
        stiffness: 480,
        damping: 22,
        mass: 0.7,
      }}
      className={`
        relative ${getStyles()}
        w-full aspect-square flex flex-col items-center justify-center p-1.5 sm:p-2.5
        border-b-2 sm:border-b-[3px] rounded-2xl sm:rounded-[1.25rem] select-none
        transition-colors duration-150 ease-out outline-none focus:outline-none
      `}
    >
      {/* Beginner Category Dot */}
      {!word.isSolved && category && (
        <div 
          className="absolute bottom-1.5 left-2 w-2 h-2 rounded-full shadow-sm ring-1 ring-white/50"
          style={{ backgroundColor: category.color }}
        />
      )}

      {/* Solved Icon */}
      {word.isSolved && category && (
        <div 
          className="absolute top-1 right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white/80 backdrop-blur shadow-sm flex items-center justify-center text-[10px] sm:text-xs border border-black/5"
        >
          {category.icon}
        </div>
      )}

      {/* Selection Tick with spring pop */}
      <AnimatePresence>
        {isSelected && !word.isSolved && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            style={{ forcedColorAdjust: 'none', colorScheme: 'only light' }}
            className="absolute top-1.5 right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-slate-950 text-amber-300 rounded-full flex items-center justify-center shadow-sm pointer-events-none text-[8px] sm:text-[9px] font-black leading-none"
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
      
      <span 
        style={isSelected ? {
          color: '#000000',
          WebkitTextFillColor: '#000000',
          forcedColorAdjust: 'none',
          colorScheme: 'only light'
        } : undefined}
        className={`
          font-black 
          leading-tight
          whitespace-nowrap
          text-center
          w-full
          px-1
          text-xs sm:text-sm md:text-base
          ${isSelected ? 'text-black word-card-selected-text' : ''}
          ${word.isSolved ? 'scale-90 opacity-70' : ''}
        `}
      >
        {word.text}
      </span>
    </motion.button>
  );
};
