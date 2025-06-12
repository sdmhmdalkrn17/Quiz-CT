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
  onAnswerSelected: (isCorrect: boolean, question: Question, selectedOptionId: string, timeRemaining?: number) => void;
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
  const [, setIsAnswered] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(Date.now());
  const [currentTimeRemaining, setCurrentTimeRemaining] = useState<number>(TIME_PER_QUESTION);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  }, [isSubmitted]);

  const proceedToNext = useCallback(() => {
    setShowFeedbackModal(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsSubmitted(false);
    setIsCorrect(null);
    setTimerKey(Date.now());
    setCurrentTimeRemaining(TIME_PER_QUESTION);
    onNext();
  }, [onNext]);

  const handleSubmit = useCallback(() => {
    if (!selectedOptionId || isSubmitted) return;

    setIsSubmitted(true);
    setIsAnswered(true);
    const correct = selectedOptionId === question.correctOptionId;
    setIsCorrect(correct);
    onAnswerSelected(correct, question, selectedOptionId, currentTimeRemaining);

    if (gameMode === 'practice') {
      setShowFeedbackModal(true);
    } else if (gameMode === 'exam') {
      setTimeout(() => {
        proceedToNext();
      }, 1500);
    }
  }, [selectedOptionId, isSubmitted, question, onAnswerSelected, gameMode, proceedToNext, currentTimeRemaining]);

  const handleTimeUp = useCallback(() => {
    if (!isSubmitted) {
      setIsSubmitted(true);
      setIsAnswered(true);
      setIsCorrect(false);
      onAnswerSelected(false, question, selectedOptionId || 'timed_out', 0); 
      
      // Immediately proceed to next question when time is up
      proceedToNext();
    }
  }, [isSubmitted, onAnswerSelected, question, selectedOptionId, proceedToNext]);

  // Update current time remaining
  const handleTimeUpdate = useCallback((timeRemaining: number) => {
    setCurrentTimeRemaining(timeRemaining);
  }, []);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowFeedbackModal(false);
    setTimerKey(Date.now());
    setCurrentTimeRemaining(TIME_PER_QUESTION);
  }, [question]);

  const showSubmitButton = selectedOptionId && !isSubmitted;
  const showNextButton = isSubmitted && gameMode === 'practice' && !showFeedbackModal;

  // Calculate points preview based on current time
  const getPointsPreview = () => {
    if (!selectedOptionId) return 0;
    if (currentTimeRemaining >= 20) return 10;
    return 5;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Main Game Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            {/* Question Progress */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-lg">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Pertanyaan {questionNumber}/{totalQuestions}</span>
                </span>
              </div>
              
              {/* Game Mode Badge */}
              <div className={`px-3 py-1 rounded-xl text-xs font-semibold border-2 ${
                gameMode === 'practice' 
                  ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                  : 'bg-orange-500/20 border-orange-500/50 text-orange-300'
              }`}>
                {gameMode === 'practice' ? 'Mode Latihan' : 'Mode Ujian'}
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-bold text-white">Skor: </span>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
                  {currentScore}
                </span>
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
              <Timer 
                duration={TIME_PER_QUESTION} 
                onTimeUp={handleTimeUp} 
                onTimeUpdate={handleTimeUpdate}
                isPlaying={!isSubmitted} 
                key={timerKey} 
              />
            </div>
          </div>

          {/* Question Content */}
          <div className="mb-8">
            <QuestionCard
              question={question}
              onOptionSelect={handleOptionSelect}
              selectedOptionId={selectedOptionId}
              isAnswered={isSubmitted}
              correctOptionId={question.correctOptionId}
              gameMode={gameMode}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {/* Submit Button */}
            {showSubmitButton && (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Jawaban</span>
                </span>
              </button>
            )}

            {/* Next Button - Only for Practice Mode */}
            {showNextButton && (
              <button
                onClick={proceedToNext}
                className="bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>{questionNumber === totalQuestions ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'}</span>
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            )}

            {/* Auto Next Indicator for Exam Mode */}
            {gameMode === 'exam' && isSubmitted && (
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Melanjutkan otomatis...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {gameMode === 'practice' && showFeedbackModal && (
        <AnswerFeedbackModal
          isCorrect={isCorrect ?? false}
          explanation={question.explanation ?? "Tidak ada penjelasan tambahan untuk soal ini."}
          onClose={proceedToNext}
        />
      )}
    </div>
  );
};

export default GameScreenComponent;