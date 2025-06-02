import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameScreen, GameMode, IncorrectlyAnsweredItem } from './types';
import { GAME_TITLE, POINTS_PER_CORRECT_ANSWER, QUESTIONS_PER_GAME, shuffleArray } from './constants';
import { loadQuestionsFromLocalStorage, saveQuestionsToLocalStorage } from './localStorageUtils';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreenComponent from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import SettingsScreen from './components/SettingsScreen';
import ReviewAnswersScreen from './components/ReviewAnswersScreen'; // New screen

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Welcome);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [allManagedQuestions, setAllManagedQuestions] = useState<Question[]>(loadQuestionsFromLocalStorage());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>("");
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState<IncorrectlyAnsweredItem[]>([]);

  useEffect(() => {
    saveQuestionsToLocalStorage(allManagedQuestions);
  }, [allManagedQuestions]);

  const prepareQuizQuestions = useCallback(() => {
    const availableQuestions = allManagedQuestions.length > 0 ? allManagedQuestions : loadQuestionsFromLocalStorage();
    if (availableQuestions.length === 0) {
        // This case should ideally not happen if INITIAL_QUESTIONS is used as fallback in loadQuestionsFromLocalStorage
        console.warn("No questions available to start the game.");
        return [];
    }
    const shuffled = shuffleArray(availableQuestions);
    return shuffled.slice(0, Math.min(QUESTIONS_PER_GAME, shuffled.length));
  }, [allManagedQuestions]);

  const startGame = useCallback((name: string, mode: GameMode) => {
    setPlayerName(name);
    setGameMode(mode);
    const questionsForQuiz = prepareQuizQuestions();
     if (questionsForQuiz.length === 0) {
      // Handle case where no questions could be prepared (e.g., show an error or prevent game start)
      setCurrentScreen(GameScreen.Welcome); // Or a specific error screen/message
      alert("Tidak ada soal yang tersedia untuk memulai permainan. Silakan tambahkan soal di menu Pengaturan.");
      return;
    }
    setQuizQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIncorrectlyAnswered([]);
    setCurrentScreen(GameScreen.Playing);
  }, [prepareQuizQuestions]);

  const handleAnswer = useCallback((isCorrect: boolean, question: Question, selectedOptionId: string) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + POINTS_PER_CORRECT_ANSWER);
    } else {
      setIncorrectlyAnswered(prev => [...prev, { question, userAnswerId: selectedOptionId }]);
    }
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentScreen(GameScreen.Results);
    }
  }, [currentQuestionIndex, quizQuestions.length]);

  const restartGame = useCallback(() => {
    setCurrentScreen(GameScreen.Welcome);
  }, []);

  const navigateToSettings = useCallback(() => {
    setCurrentScreen(GameScreen.Settings);
  }, []);

  const navigateToReview = useCallback(() => {
    setCurrentScreen(GameScreen.Review);
  }, []);

  const handleAddQuestion = useCallback((newQuestion: Question) => {
    setAllManagedQuestions(prevQuestions => [...prevQuestions, newQuestion]);
  }, []);

  const handleEditQuestion = useCallback((updatedQuestion: Question) => {
    setAllManagedQuestions(prevQuestions => 
      prevQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    setAllManagedQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId));
  }, []);


  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreen.Playing:
        if (quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
           // This should ideally be caught by startGame, but as a fallback:
          return <ResultsScreen 
                    score={score} 
                    totalQuestions={quizQuestions.length} 
                    onRestart={restartGame} 
                    playerName={playerName} 
                    incorrectlyAnswered={incorrectlyAnswered}
                    onNavigateToReview={navigateToReview}
                    gameMode={gameMode}
                 />;
        }
        return (
          <GameScreenComponent
            question={quizQuestions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizQuestions.length}
            onAnswerSelected={handleAnswer}
            onNext={handleNextQuestion}
            currentScore={score}
            gameMode={gameMode}
          />
        );
      case GameScreen.Results:
        return <ResultsScreen 
                  score={score} 
                  totalQuestions={quizQuestions.length} 
                  onRestart={restartGame} 
                  playerName={playerName}
                  incorrectlyAnswered={incorrectlyAnswered}
                  onNavigateToReview={navigateToReview}
                  gameMode={gameMode}
                />;
      case GameScreen.Settings:
        return <SettingsScreen 
                  currentQuestions={allManagedQuestions} 
                  onAddQuestion={handleAddQuestion}
                  onEditQuestion={handleEditQuestion}
                  onDeleteQuestion={handleDeleteQuestion}
                  onBackToWelcome={restartGame} 
                />;
      case GameScreen.Review:
        return <ReviewAnswersScreen
                  incorrectlyAnswered={incorrectlyAnswered}
                  onBackToWelcome={restartGame}
                />;
      case GameScreen.Welcome:
      default:
        return <WelcomeScreen 
                  onStartGame={startGame} 
                  gameTitle={GAME_TITLE}
                  onNavigateToSettings={navigateToSettings}
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900">
      <main className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-lg overflow-hidden">
        {renderScreen()}
      </main>
      <footer className="text-center mt-8 text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Kelas Praktikum 4D</p>
      </footer>
    </div>
  );
};

export default App;
