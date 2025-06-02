import React from 'react';
import { Question as QuestionType, GameMode } from '../types';

interface QuestionCardProps {
  question: QuestionType;
  onOptionSelect: (optionId: string) => void;
  selectedOptionId: string | null;
  isAnswered: boolean;
  correctOptionId: string;
  gameMode: GameMode; // Added gameMode
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onOptionSelect,
  selectedOptionId,
  isAnswered,
  correctOptionId,
  gameMode,
}) => {
  const getButtonClass = (optionId: string) => {
    let baseClass = "w-full text-left p-4 my-2 rounded-lg border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800";
    
    if (!isAnswered) {
      return `${baseClass} bg-slate-700 border-slate-600 hover:bg-sky-700 hover:border-sky-500 text-slate-100`;
    }

    // Common style for all answered options if not providing immediate feedback
    const answeredBaseStyle = `${baseClass} cursor-not-allowed opacity-80`;

    if (gameMode === 'exam') {
      if (optionId === selectedOptionId) {
        return `${answeredBaseStyle} bg-sky-700 border-sky-500 text-white`; // Neutral selection color
      }
      return `${answeredBaseStyle} bg-slate-600 border-slate-500 text-slate-300`;
    }

    // Practice mode: show correct/incorrect
    if (optionId === correctOptionId) {
      return `${baseClass} bg-green-600 border-green-500 text-white cursor-not-allowed`;
    }
    if (optionId === selectedOptionId && optionId !== correctOptionId) {
      return `${baseClass} bg-red-600 border-red-500 text-white cursor-not-allowed`;
    }
    return `${baseClass} bg-slate-600 border-slate-500 text-slate-300 cursor-not-allowed opacity-70`;
  };

  return (
    <div className="bg-slate-700/50 p-6 rounded-lg shadow-xl flex-grow flex flex-col">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-sky-300 leading-tight">
        {question.text}
      </h2>
      <div className="space-y-3 flex-grow">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionSelect(option.id)}
            disabled={isAnswered}
            className={getButtonClass(option.id)}
            aria-pressed={selectedOptionId === option.id}
          >
            <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;