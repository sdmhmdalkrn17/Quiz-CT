import React, { useState, useEffect, useRef } from 'react';
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

// Interface untuk data yang akan dikirim ke server
interface GameResultData {
  playerName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  gameMode: GameMode;
  incorrectlyAnswered: IncorrectlyAnsweredItem[];
  completedAt: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Flag untuk mencegah double submission
  const hasSubmittedRef = useRef(false);
  const submissionInProgressRef = useRef(false);

  const correctAnswers = totalQuestions > 0 ? score / POINTS_PER_CORRECT_ANSWER : 0;
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
  
  if (totalQuestions === 0) {
    feedbackMessage = "Tidak ada pertanyaan yang dijawab.";
    feedbackColor = "text-slate-400";
  }

  // Fungsi untuk mengirim hasil ke server dengan proteksi double submission
  const submitResultsToServer = async (resultData: GameResultData) => {
    // Cek apakah sudah pernah berhasil submit atau sedang dalam proses
    if (hasSubmittedRef.current || submissionInProgressRef.current) {
      console.log('Submission blocked: Already submitted or in progress');
      return;
    }

    // Set flag bahwa submission sedang berlangsung
    submissionInProgressRef.current = true;
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Tambahkan timestamp unik untuk mencegah duplicate di server
      const uniqueResultData = {
        ...resultData,
        submissionId: `${playerName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        submissionTimestamp: new Date().toISOString()
      };

      // Ganti URL ini dengan endpoint server Node.js Anda
      const response = await fetch('https://leaderboard-online.vercel.app/api/game-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Tambahkan header authorization jika diperlukan
          // 'Authorization': `Bearer ${yourToken}`,
        },
        body: JSON.stringify(uniqueResultData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Results submitted successfully:', responseData);
      
      // Mark sebagai berhasil submit
      hasSubmittedRef.current = true;
      setSubmitStatus('success');
    } catch (error) {
      console.error('Failed to submit results:', error);
      setSubmitStatus('error');
      // Reset flag jika gagal, agar bisa dicoba lagi
      submissionInProgressRef.current = false;
    } finally {
      setIsSubmitting(false);
      // Jika berhasil, jangan reset submissionInProgressRef
      if (!hasSubmittedRef.current) {
        submissionInProgressRef.current = false;
      }
    }
  };

  // Otomatis kirim hasil ke server hanya untuk mode ujian
  useEffect(() => {
    if (totalQuestions > 0 && gameMode === 'exam' && !hasSubmittedRef.current) {
      const resultData: GameResultData = {
        playerName,
        score,
        totalQuestions,
        correctAnswers: numCorrectAnswers,
        percentage,
        gameMode,
        incorrectlyAnswered,
        completedAt: new Date().toISOString(),
      };

      // Otomatis kirim untuk mode ujian
      submitResultsToServer(resultData);
    }
  }, []);

  // Fungsi untuk manual submit (dipanggil dari tombol)
  const handleManualSubmit = () => {
    // Double check untuk mencegah submission jika sudah berhasil
    if (hasSubmittedRef.current) {
      console.log('Manual submission blocked: Already successfully submitted');
      return;
    }

    const resultData: GameResultData = {
      playerName,
      score,
      totalQuestions,
      correctAnswers: numCorrectAnswers,
      percentage,
      gameMode,
      incorrectlyAnswered,
      completedAt: new Date().toISOString(),
    };

    submitResultsToServer(resultData);
  };

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

      <p className={`text-xl font-semibold mb-4 ${feedbackColor}`}>{feedbackMessage}</p>
      
      {/* Status indicator untuk submit ke server - hanya tampil di mode ujian */}
      {gameMode === 'exam' && submitStatus === 'success' && (
        <div className="bg-green-600/20 border border-green-500 text-green-300 px-4 py-2 rounded-lg mb-4">
          ✅ Hasil ujian berhasil dikirim ke server!
        </div>
      )}
      
      {gameMode === 'exam' && submitStatus === 'error' && !hasSubmittedRef.current && (
        <div className="bg-red-600/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg mb-4">
          ❌ Gagal mengirim hasil ujian ke server. Silakan coba lagi.
        </div>
      )}

      {gameMode === 'exam' && incorrectlyAnswered.length > 0 && (
        <p className="text-sm text-amber-300 mb-4">
          {hasSubmittedRef.current ? 
            "Ini adalah mode ujian. Hasil Anda telah disimpan ke server. Tinjau jawaban Anda untuk melihat penjelasan." :
            "Ini adalah mode ujian. Mengirim hasil ke server..."
          }
        </p>
      )}

      {gameMode !== 'exam' && incorrectlyAnswered.length > 0 && (
        <p className="text-sm text-amber-300 mb-4">
          Mode latihan. Tinjau jawaban Anda untuk melihat penjelasan.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button
          onClick={onRestart}
          className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
        >
          Main Lagi
        </button>
        
        {/* Tombol untuk manual submit ke server - hanya tampil di mode ujian jika auto-submit gagal dan belum berhasil submit */}
        {gameMode === 'exam' && submitStatus === 'error' && !hasSubmittedRef.current && (
          <button
            onClick={handleManualSubmit}
            disabled={isSubmitting || submissionInProgressRef.current}
            className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ulang ke Server'}
          </button>
        )}
        
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