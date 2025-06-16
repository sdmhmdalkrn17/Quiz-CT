export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
  category?: string;
  level?: number;
}

export interface Option {
  id: string;
  text: string;
}

export enum GameScreen {
  Welcome,
  Playing,
  Results,
  Settings,
  Review,
  Leaderboard,
  Material = 'material',
}

export type GameMode = 'practice' | 'exam';

export interface IncorrectlyAnsweredItem {
  question: Question;
  userAnswerId: string;
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  answers: GameAnswer[];
  gameMode: GameMode;
  currentLevel: number; // Add current level
  lives: number; // Add lives
  isGameOver: boolean; // Add game over state
  maxLevel: number; // Add max level reached
}

export interface GameAnswer {
  question: Question;
  selectedOptionId: string;
  isCorrect: boolean;
  timeRemaining?: number;
  pointsEarned: number;
}

export interface GameLevel {
  level: number;
  name: string;
  timePerQuestion: number;
  questionsPerLevel: number;
  description: string;
}

export interface GameStats {
  totalGamesPlayed: number;
  bestScore: number;
  maxLevelReached: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
}