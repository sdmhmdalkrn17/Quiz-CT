export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation?: string;
  category?: string;
}

export enum GameScreen {
  Welcome,
  Playing,
  Results,
  Settings,
  Review,
  Leaderboard,
}

export type GameMode = 'practice' | 'exam';

export interface IncorrectlyAnsweredItem {
  question: Question;
  userAnswerId: string;
}