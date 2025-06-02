import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameMode } from '../types';
import { TIME_PER_QUESTION } from '../constants';
import QuestionCard from './QuestionCard';
import Timer from './Timer';
import AnswerFeedbackModal from './AnswerFeedbackModal';

interface GameScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelected: (isCorrect: boolean, question: Question, selectedOptionId: string) => void;
  onNext: () => void;
  currentScore: number;
  gameMode: GameMode;
}

const GameScreenComponent: React.FC<GameScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onNext,
  currentScore,
  gameMode,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(Date.now());

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isAnswered) return;

    setSelectedOptionId(optionId);
    setIsAnswered(true);
    const correct = optionId === question.correctOptionId;
    setIsCorrect(correct);
    onAnswerSelected(correct, question, optionId);

    if (gameMode === 'practice') {
      setShowFeedbackModal(true);
    }
  }, [isAnswered, question, onAnswerSelected, gameMode]);
  
  const handleTimeUp = useCallback(() => {
    if (!isAnswered) {
      setIsAnswered(true);
      setIsCorrect(false);
      // For time up, we don't have a user-selected option, pass a placeholder or handle appropriately
      onAnswerSelected(false, question, 'timed_out'); 
      if (gameMode === 'practice') {
        setShowFeedbackModal(true);
      }
    }
  }, [isAnswered, onAnswerSelected, question, gameMode]);

  const proceedToNext = useCallback(() => {
    setShowFeedbackModal(false); // Ensure modal is closed if it was open
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setTimerKey(Date.now());
    onNext();
  }, [onNext]);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowFeedbackModal(false);
    setTimerKey(Date.now());
  }, [question]);

  const showNextButton = isAnswered && (gameMode === 'exam' || (gameMode === 'practice' && !showFeedbackModal));

  return (
    <div className="p-6 sm:p-8 bg-slate-800 min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-sky-400 font-semibold">
          Pertanyaan {questionNumber}/{totalQuestions}
        </div>
        <div className="text-lg font-bold text-amber-400">Skor: {currentScore}</div>
      </div>
        <div className="text-sm text-center mb-1 font-medium text-slate-400 capitalize">
          Mode: {gameMode === 'practice' ? 'Latihan' : 'Ujian'}
        </div>
      <div className="mb-6">
        <Timer duration={TIME_PER_QUESTION} onTimeUp={handleTimeUp} isPlaying={!isAnswered} key={timerKey} />
      </div>

      <QuestionCard
        question={question}
        onOptionSelect={handleOptionSelect}
        selectedOptionId={selectedOptionId}
        isAnswered={isAnswered}
        correctOptionId={question.correctOptionId}
        gameMode={gameMode} // Pass gameMode to QuestionCard
      />
      
      {gameMode === 'practice' && showFeedbackModal && (
        <AnswerFeedbackModal
          isCorrect={isCorrect ?? false}
          explanation={question.explanation ?? "Tidak ada penjelasan tambahan untuk soal ini."}
          onClose={proceedToNext}
        />
      )}
       {showNextButton && (
         <div className="mt-auto pt-6 text-center">
            <button
            onClick={proceedToNext}
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
            {questionNumber === totalQuestions ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'}
            </button>
        </div>
       )}
    </div>
  );
};

export default GameScreenComponent;