import React from 'react';
import { POINTS_PER_CORRECT_ANSWER } from '../constants';
import { IncorrectlyAnsweredItem, GameMode } from '../types';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  playerName: string;
  incorrectlyAnswered: IncorrectlyAnsweredItem[];
  onNavigateToReview: () => void;
  gameMode: GameMode;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  score, 
  totalQuestions, 
  onRestart, 
  playerName, 
  incorrectlyAnswered, 
  onNavigateToReview,
  gameMode
}) => {
  const correctAnswers = totalQuestions > 0 ? score / POINTS_PER_CORRECT_ANSWER : 0;
  // Ensure correctAnswers is an integer for display, e.g. if points system changes
  const numCorrectAnswers = Math.max(0, Math.floor(correctAnswers)); 
  const percentage = totalQuestions > 0 ? Math.round((numCorrectAnswers / totalQuestions) * 100) : 0;

  let feedbackMessage = "";
  let feedbackColor = "text-sky-400";

  if (percentage >= 80) {
    feedbackMessage = "Luar Biasa! Pengetahuan CT Scan Anda sangat baik!";
    feedbackColor = "text-green-400";
  } else if (percentage >= 60) {
    feedbackMessage = "Bagus! Anda memiliki pemahaman yang baik tentang CT Scan.";
    feedbackColor = "text-yellow-400";
  } else if (percentage >= 40) {
    feedbackMessage = "Cukup Baik. Terus belajar untuk meningkatkan pemahaman Anda.";
    feedbackColor = "text-orange-400";
  } else {
    feedbackMessage = "Perlu belajar lebih giat lagi. Jangan menyerah!";
    feedbackColor = "text-red-400";
  }
  
  // Handle case where totalQuestions might be 0 if quiz couldn't start
  if (totalQuestions === 0) {
    feedbackMessage = "Tidak ada pertanyaan yang dijawab.";
    feedbackColor = "text-slate-400";
  }


  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-800 rounded-lg min-h-[500px]">
      <img 
        src={percentage >= 60 ? "https://picsum.photos/seed/ctscanwinner/150/150" : "https://picsum.photos/seed/ctscanstudy/150/150"} 
        alt="Result Icon" 
        className="w-24 h-24 md:w-32 md:h-32 mb-6 rounded-full shadow-lg border-4 border-sky-500" 
      />
      <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-sky-400">Permainan Selesai!</h2>
      <p className="text-xl text-slate-300 mb-6">Terima kasih sudah bermain, {playerName}!</p>
      
      <div className="bg-slate-700/50 p-6 rounded-lg shadow-inner w-full max-w-md mb-8">
        <p className="text-2xl font-semibold text-amber-400 mb-2">Skor Akhir Anda: {score}</p>
        {totalQuestions > 0 && (
          <p className="text-lg text-slate-300">
            Anda menjawab {numCorrectAnswers} dari {totalQuestions} pertanyaan dengan benar. ({percentage}%)
          </p>
        )}
         {totalQuestions === 0 && (
          <p className="text-lg text-slate-300">Tidak ada pertanyaan yang dimuat.</p>
        )}
      </div>

      <p className={`text-xl font-semibold mb-8 ${feedbackColor}`}>{feedbackMessage}</p>
      
      {gameMode === 'exam' && incorrectlyAnswered.length > 0 && (
        <p className="text-sm text-amber-300 mb-4">Ini adalah mode ujian. Tinjau jawaban Anda untuk melihat penjelasan.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onRestart}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
        >
          Main Lagi
        </button>
        {incorrectlyAnswered.length > 0 && (
          <button
            onClick={onNavigateToReview}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
          >
            Tinjau Jawaban Salah ({incorrectlyAnswered.length})
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsScreen;