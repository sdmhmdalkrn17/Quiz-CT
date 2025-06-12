import React, { useState, useCallback } from 'react';
import { Question, GameScreen, GameMode, IncorrectlyAnsweredItem } from './types';
import { GAME_TITLE, QUESTIONS_PER_GAME, INITIAL_QUESTIONS, shuffleArray } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreenComponent from './components/GameScreen';
import ResultsScreen from './components/ResultsScreen';
import SettingsScreen from './components/SettingsScreen';
import ReviewAnswersScreen from './components/ReviewAnswersScreen';
import LeaderboardScreen from './components/LeaderboardScreen';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>(GameScreen.Welcome);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [allManagedQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [playerName, setPlayerName] = useState<string>("");
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState<IncorrectlyAnsweredItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const prepareQuizQuestions = useCallback(() => {
    if (allManagedQuestions.length === 0) {
      console.warn("No questions available to start the game.");
      return [];
    }
    const shuffled = shuffleArray(allManagedQuestions);
    return shuffled.slice(0, Math.min(QUESTIONS_PER_GAME, shuffled.length));
  }, [allManagedQuestions]);

  const handleScreenTransition = useCallback((newScreen: GameScreen) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(newScreen);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 200);
  }, []);

  const startGame = useCallback((name: string, mode: GameMode) => {
    setPlayerName(name);
    setGameMode(mode);
    const questionsForQuiz = prepareQuizQuestions();
    if (questionsForQuiz.length === 0) {
      handleScreenTransition(GameScreen.Welcome);
      setTimeout(() => {
        alert("Tidak ada soal yang tersedia untuk memulai permainan. Silakan tambahkan soal di menu Pengaturan.");
      }, 300);
      return;
    }
    setQuizQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIncorrectlyAnswered([]);
    handleScreenTransition(GameScreen.Playing);
  }, [prepareQuizQuestions, handleScreenTransition]);

  // Updated scoring logic based on time remaining
  const calculatePoints = useCallback((isCorrect: boolean, timeRemaining: number) => {
    if (!isCorrect) return 0; // Wrong answer = 0 points
    
    // Correct answer scoring based on time remaining
    if (timeRemaining >= 20) {
      return 10; // Full points for answering with 20+ seconds remaining
    } else {
      return 5;  // Half points for answering with less than 20 seconds
    }
  }, []);

  const handleAnswer = useCallback((isCorrect: boolean, question: Question, selectedOptionId: string, timeRemaining: number = 0) => {
    const points = calculatePoints(isCorrect, timeRemaining);
    
    // Add points to score
    setScore(prevScore => prevScore + points);
    
    // Track incorrect answers
    if (!isCorrect) {
      setIncorrectlyAnswered(prev => [...prev, { 
        question, 
        userAnswerId: selectedOptionId,
        timeRemaining: timeRemaining 
      }]);
    }

    // Log scoring for debugging (can be removed in production)
    console.log(`Answer: ${isCorrect ? 'Correct' : 'Wrong'}, Time: ${timeRemaining}s, Points: ${points}`);
  }, [calculatePoints]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleScreenTransition(GameScreen.Results);
    }
  }, [currentQuestionIndex, quizQuestions.length, handleScreenTransition]);

  const restartGame = useCallback(() => {
    handleScreenTransition(GameScreen.Welcome);
  }, [handleScreenTransition]);

  const navigateToSettings = useCallback(() => {
    handleScreenTransition(GameScreen.Settings);
  }, [handleScreenTransition]);

  const navigateToReview = useCallback(() => {
    handleScreenTransition(GameScreen.Review);
  }, [handleScreenTransition]);

  const navigateToLeaderboard = useCallback(() => {
    handleScreenTransition(GameScreen.Leaderboard);
  }, [handleScreenTransition]);

  const renderScreen = () => {
    switch (currentScreen) {
      case GameScreen.Playing:
        if (quizQuestions.length === 0 || currentQuestionIndex >= quizQuestions.length) {
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
                  onBackToWelcome={restartGame} 
                />;
      case GameScreen.Review:
        return <ReviewAnswersScreen
                  incorrectlyAnswered={incorrectlyAnswered}
                  onBackToWelcome={restartGame}
                />;
      case GameScreen.Leaderboard:
        return <LeaderboardScreen onBack={restartGame} />;
      case GameScreen.Welcome:
      default:
        return <WelcomeScreen 
                  onStartGame={startGame} 
                  gameTitle={GAME_TITLE}
                  onNavigateToSettings={navigateToSettings}
                  onNavigateToLeaderboard={navigateToLeaderboard}
                  playerName={playerName}
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-300/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <main className={`w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-slate-700/50 relative z-10 transition-all duration-300 ease-out transform ${
        isTransitioning ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-sky-900/20 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {renderScreen()}
        </div>
      </main>
      
      <footer className="text-center mt-8 text-slate-400/80 text-sm relative z-10 animate-fade-in animation-delay-1000">
        <p className="hover:text-sky-300 transition-colors duration-300">
          &copy; {new Date().getFullYear()} Kelas Praktikum 4D
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-15px) translateX(15px);
            opacity: 0.7;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        /* Enhanced glassmorphism effect */
        main::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent);
          z-index: 1;
        }

        /* Subtle glow effect */
        main {
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(148, 163, 184, 0.1),
            inset 0 1px 0 rgba(148, 163, 184, 0.1);
        }

        main:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 32px 64px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(148, 163, 184, 0.15),
            inset 0 1px 0 rgba(148, 163, 184, 0.15);
        }
        `
      }} />
    </div>
  );
};

export default App;