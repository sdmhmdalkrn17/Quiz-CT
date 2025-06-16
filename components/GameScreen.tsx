import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameMode } from '../types';
import { getTimePerQuestion } from '../constants';
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
  currentLevel: number; 
  lives: number;
  isGameOver: boolean;
  onGameOver?: () => void; // Callback untuk game over
}

const GameScreenComponent: React.FC<GameScreenProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswerSelected,
  onNext,
  currentScore,
  gameMode,
  currentLevel,
  lives,
  isGameOver,
  onGameOver,
}) => {
  
  // Get time per question based on current level
  const timePerQuestion = getTimePerQuestion(currentLevel);
  
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [, setIsAnswered] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(Date.now());
  const [currentTimeRemaining, setCurrentTimeRemaining] = useState<number>(timePerQuestion);
  
  // New states for transitions and game over
  const [showLevelTransition, setShowLevelTransition] = useState<boolean>(false);
  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);
  const [transitionLevel, setTransitionLevel] = useState<number>(currentLevel);
  const [lastKnownLevel, setLastKnownLevel] = useState<number>(currentLevel);
  
  // New states for exam mode feedback and game completion
  const [showExamFeedback, setShowExamFeedback] = useState<boolean>(false);
  const [showGameCompletionModal, setShowGameCompletionModal] = useState<boolean>(false);
  const [gameEndReason, setGameEndReason] = useState<'lives' | 'questions' | null>(null);
  const [waitingForCompletion, setWaitingForCompletion] = useState<boolean>(false);

  const handleOptionSelect = useCallback((optionId: string) => {
    if (isSubmitted || showLevelTransition) return; // Prevent selection during level transition
    setSelectedOptionId(optionId);
  }, [isSubmitted, showLevelTransition]);

  const proceedToNext = useCallback(() => {
    setShowFeedbackModal(false);
    setShowExamFeedback(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsSubmitted(false);
    setIsCorrect(null);
    setTimerKey(Date.now());
    setCurrentTimeRemaining(timePerQuestion);
    onNext();
  }, [onNext, timePerQuestion]);

  const handleSubmit = useCallback(() => {
    if (!selectedOptionId || isSubmitted || showLevelTransition) return; // Prevent submit during level transition

    setIsSubmitted(true);
    setIsAnswered(true);
    const correct = selectedOptionId === question.correctOptionId;
    setIsCorrect(correct);
    onAnswerSelected(correct, question, selectedOptionId, currentTimeRemaining);

    if (gameMode === 'practice') {
      setShowFeedbackModal(true);
    } else if (gameMode === 'exam') {
      // Show exam feedback for correct/incorrect without revealing answer
      setShowExamFeedback(true);
      setTimeout(() => {
        setShowExamFeedback(false);
        setTimeout(() => {
          proceedToNext();
        }, 300);
      }, 1500);
    }
  }, [selectedOptionId, isSubmitted, question, onAnswerSelected, gameMode, proceedToNext, currentTimeRemaining, showLevelTransition]);

  const handleTimeUp = useCallback(() => {
    if (!isSubmitted && !showLevelTransition) { // Don't trigger time up during level transition
      setIsSubmitted(true);
      setIsAnswered(true);
      setIsCorrect(false);
      onAnswerSelected(false, question, selectedOptionId || 'timed_out', 0); 
      
      if (gameMode === 'exam') {
        // Show wrong feedback for timeout in exam mode
        setShowExamFeedback(true);
        setTimeout(() => {
          setShowExamFeedback(false);
          setTimeout(() => {
            proceedToNext();
          }, 300);
        }, 1500);
      } else {
        // Immediately proceed to next question when time is up in practice mode
        proceedToNext();
      }
    }
  }, [isSubmitted, onAnswerSelected, question, selectedOptionId, proceedToNext, showLevelTransition, gameMode]);

  // Update current time remaining
  const handleTimeUpdate = useCallback((timeRemaining: number) => {
    setCurrentTimeRemaining(timeRemaining);
  }, []);

  // Handle level transition - improved logic with better state management
  useEffect(() => {
    // Only show level transition if level actually increased
    if (currentLevel > lastKnownLevel && !showLevelTransition) {
      console.log(`Level up detected: ${lastKnownLevel} -> ${currentLevel}`);
      setTransitionLevel(currentLevel);
      setShowLevelTransition(true);
      
      // Auto-hide transition after 2.5 seconds (reduced from 3 seconds)
      const timer = setTimeout(() => {
        console.log('Hiding level transition');
        setShowLevelTransition(false);
        setLastKnownLevel(currentLevel); // Update last known level after hiding
      }, 2500);
      
      return () => {
        clearTimeout(timer);
      };
    } else if (currentLevel !== lastKnownLevel && !showLevelTransition) {
      // Update last known level if it changed but didn't increase (shouldn't happen normally)
      setLastKnownLevel(currentLevel);
    }
  }, [currentLevel, lastKnownLevel, showLevelTransition]);

  // Handle game over when lives reach 0
  useEffect(() => {
    if (lives === 0 && !showGameOverModal && !showGameCompletionModal) {
      setGameEndReason('lives');
      setShowGameCompletionModal(true);
    }
  }, [lives, showGameOverModal, showGameCompletionModal]);

// Handle game completion when all questions are finished
  useEffect(() => {
    if (isGameOver && questionNumber >= totalQuestions && !showGameCompletionModal && !waitingForCompletion) {
      setGameEndReason('questions');
      setWaitingForCompletion(true); // Set waiting state instead of showing modal directly
    }
  }, [isGameOver, questionNumber, totalQuestions, showGameCompletionModal, waitingForCompletion]);

  // Reset states when question changes
  useEffect(() => {
    // Don't reset states during level transition
    if (showLevelTransition) return;
    
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowFeedbackModal(false);
    setShowExamFeedback(false);
    setTimerKey(Date.now());
    setCurrentTimeRemaining(timePerQuestion);
  }, [question, timePerQuestion, showLevelTransition]);

  const showSubmitButton = selectedOptionId && !isSubmitted && !showLevelTransition;
  const showNextButton = isSubmitted && gameMode === 'practice' && !showFeedbackModal && !showLevelTransition;

  const handleGameCompletionClose = () => {
    if (waitingForCompletion && gameEndReason === 'questions') {
      // First click shows the completion modal
      setWaitingForCompletion(false);
      setShowGameCompletionModal(true);
    } else {
      // Second click (or game over) goes to menu
      setShowGameCompletionModal(false);
      setShowGameOverModal(false);
      if (onGameOver) {
        onGameOver();
      }
    }
  };

  // Force close level transition (emergency button for debugging)
  const handleLevelTransitionClick = () => {
    console.log('Level transition clicked - force closing');
    setShowLevelTransition(false);
    setLastKnownLevel(currentLevel);
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
        <div className={`bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl transition-opacity duration-300 ${
          showLevelTransition || showExamFeedback ? 'opacity-50 pointer-events-none' : 'opacity-100'
        }`}>
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
              
              {/* Level Badge */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow-lg">
                Level {currentLevel}
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

          {/* Lives Display */}
          <div className="mb-6">
            <div className={`bg-white/10 backdrop-blur-sm border rounded-2xl px-6 py-3 shadow-lg transition-all duration-300 ${
              lives <= 1 ? 'border-red-500/50 bg-red-500/10' : 'border-white/20'
            }`}>
              <div className="flex items-center space-x-2">
                <svg className={`w-5 h-5 ${lives <= 1 ? 'text-red-400 animate-pulse' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-bold text-white">Nyawa: </span>
                <span className={`text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                  lives <= 1 ? 'from-red-400 to-red-300' : 'from-red-400 to-red-300'
                }`}>
                  {lives}
                </span>
                {lives <= 1 && (
                  <span className="text-red-400 text-sm animate-pulse ml-2">⚠️ Hati-hati!</span>
                )}
              </div>
            </div>
          </div>

          {/* Timer Section */}
          <div className="mb-6">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-lg">
              <Timer 
                duration={timePerQuestion} 
                onTimeUp={handleTimeUp} 
                onTimeUpdate={handleTimeUpdate}
                isPlaying={!isSubmitted && !showLevelTransition && !showExamFeedback} // Pause timer during level transition and exam feedback
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
            {gameMode === 'exam' && isSubmitted && !showLevelTransition && !showExamFeedback && (
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

      {/* Exam Mode Feedback Modal */}
      {showExamFeedback && gameMode === 'exam' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className={`p-8 rounded-3xl shadow-2xl text-center transform animate-scaleIn border-2 ${
            isCorrect 
              ? 'bg-gradient-to-br from-green-600 via-green-700 to-green-800 border-green-400/30' 
              : 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-red-400/30'
          }`}>
            <div className="mb-6">
              <div className={`w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center ${
                isCorrect ? 'animate-bounce' : 'animate-pulse'
              }`}>
                {isCorrect ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h2 className={`text-4xl font-bold text-white mb-2 ${
                isCorrect ? 'animate-pulse' : ''
              }`}>
                {isCorrect ? 'Benar!' : 'Salah!'}
              </h2>
              <p className={`text-xl ${isCorrect ? 'text-green-100' : 'text-red-100'}`}>
                {isCorrect ? 'Jawaban Anda tepat!' : 'Jawaban Anda kurang tepat!'}
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-white/70 mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-ping delay-75"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-ping delay-150"></div>
            </div>
          </div>
        </div>
      )}

      {/* Level Transition Modal */}
      {showLevelTransition && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div 
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-8 rounded-3xl shadow-2xl text-center transform animate-scaleIn border border-purple-400/30 cursor-pointer"
            onClick={handleLevelTransitionClick}
          >
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 animate-pulse">Level Up!</h2>
              <p className="text-xl text-purple-100">Selamat! Anda naik ke</p>
            </div>
            
            <div className="bg-white/20 rounded-2xl p-6 mb-6">
              <div className="text-6xl font-bold text-white mb-2 animate-pulse">
                Level {transitionLevel}
              </div>
              <p className="text-purple-100">Tingkat kesulitan meningkat!</p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-purple-100 mb-4">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-ping delay-75"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-ping delay-150"></div>
            </div>
            
            <p className="text-sm text-purple-200 opacity-75">Klik untuk melanjutkan</p>
          </div>
        </div>
      )}

      {/* Game Completion/Game Over Modal */}
      {showGameCompletionModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className={`p-8 rounded-3xl shadow-2xl text-center transform animate-scaleIn border-2 max-w-md mx-4 ${
            gameEndReason === 'lives' 
              ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-red-400/30'
              : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 border-blue-400/30'
          }`}>
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                {gameEndReason === 'lives' ? (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">
                {gameEndReason === 'lives' ? 'Game Over' : 'Game Selesai!'}
              </h2>
              <p className={`text-xl mb-4 ${
                gameEndReason === 'lives' ? 'text-red-100' : 'text-blue-100'
              }`}>
                {gameEndReason === 'lives' 
                  ? 'Nyawa Anda telah habis!' 
                  : 'Selamat! Anda telah menyelesaikan semua soal!'
                }
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-white/20 rounded-2xl p-4 mb-6">
              <p className="text-white/80 text-sm mb-1">Skor Akhir</p>
              <p className="text-3xl font-bold text-white">{currentScore}</p>
              <p className="text-white/60 text-sm">Level {currentLevel}</p>
            </div>

            {/* Tombol Selesai */}
            <button
              onClick={handleGameCompletionClose}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/30 text-lg w-full"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
      )}

      {/* Waiting for Completion Button */}
      {waitingForCompletion && gameEndReason === 'questions' && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 border-green-400/30 p-8 rounded-3xl shadow-2xl text-center transform animate-scaleIn border-2 max-w-md mx-4">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 animate-pulse">Selamat!</h2>
              <p className="text-xl text-green-100 mb-4">
                Anda telah menyelesaikan semua soal!
              </p>
            </div>
            
            <button
              onClick={handleGameCompletionClose}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/30 text-lg"
            >
              Lihat Hasil
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal for Practice Mode */}
      {gameMode === 'practice' && showFeedbackModal && !showLevelTransition && (
        <AnswerFeedbackModal
          isCorrect={isCorrect ?? false}
          explanation={question.explanation ?? "Tidak ada penjelasan tambahan untuk soal ini."}
          onClose={proceedToNext}
        />
      )}

      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        `}
      </style>
    </div>
  );
};

export default GameScreenComponent;