import React, { useState, useEffect } from 'react';
import { GameMode } from '../types';

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  gameMode: GameMode;
  completedAt: string;
  submissionId?: string;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://leaderboard-online.vercel.app/api/leaderboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setLeaderboardData(data);
      } else if (data.leaderboard && Array.isArray(data.leaderboard)) {
        setLeaderboardData(data.leaderboard);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat papan peringkat');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Sort by percentage (descending), then by score (descending)
  const sortedData = [...leaderboardData].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.score - a.score;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  // Get rank badge styling
  const getRankBadge = (rank: number) => {
    if (rank === 1) return {
      gradient: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600',
      text: 'text-yellow-900',
      glow: 'shadow-lg shadow-yellow-500/30',
      icon: '👑'
    };
    if (rank === 2) return {
      gradient: 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500',
      text: 'text-slate-800',
      glow: 'shadow-lg shadow-slate-400/30',
      icon: '🥈'
    };
    if (rank === 3) return {
      gradient: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800',
      text: 'text-amber-100',
      glow: 'shadow-lg shadow-amber-600/30',
      icon: '🥉'
    };
    return {
      gradient: 'bg-gradient-to-br from-slate-600 to-slate-700',
      text: 'text-slate-200',
      glow: 'shadow-md shadow-slate-600/20',
      icon: ''
    };
  };

  // Get percentage styling
  const getPercentageStyle = (percentage: number) => {
    if (percentage >= 90) return {
      gradient: 'bg-gradient-to-r from-emerald-500 to-green-600',
      text: 'text-white',
      glow: 'shadow-lg shadow-green-500/30'
    };
    if (percentage >= 80) return {
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-600',
      text: 'text-white',
      glow: 'shadow-lg shadow-green-500/20'
    };
    if (percentage >= 70) return {
      gradient: 'bg-gradient-to-r from-yellow-500 to-amber-600',
      text: 'text-white',
      glow: 'shadow-lg shadow-yellow-500/20'
    };
    if (percentage >= 60) return {
      gradient: 'bg-gradient-to-r from-orange-500 to-yellow-600',
      text: 'text-white',
      glow: 'shadow-lg shadow-orange-500/20'
    };
    return {
      gradient: 'bg-gradient-to-r from-red-500 to-rose-600',
      text: 'text-white',
      glow: 'shadow-lg shadow-red-500/20'
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl min-h-[500px] backdrop-blur-lg border border-slate-600/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-600/30 border-t-sky-500 border-r-sky-400 mb-6"></div>
          <div className="absolute inset-0 animate-pulse rounded-full h-20 w-20 bg-sky-500/10"></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-300 text-xl font-medium">Memuat papan peringkat...</p>
          <p className="text-slate-400 text-sm">Mengambil data terbaru</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl min-h-[500px] backdrop-blur-lg border border-slate-600/50">
        <div className="text-red-400 mb-8">
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500/20 to-rose-600/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-red-300">Gagal Memuat Data</h3>
          <p className="text-red-400/80 text-sm max-w-md mx-auto leading-relaxed">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={fetchLeaderboard}
            className="group bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Coba Lagi
            </span>
          </button>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-slate-500/25 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 sm:p-8 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl min-h-[600px] max-w-6xl mx-auto backdrop-blur-lg border border-slate-600/50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left mb-6 sm:mb-0">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-3">
            <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-2xl shadow-lg shadow-yellow-500/30">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Papan Peringkat
              </h2>
              <p className="text-slate-400 text-sm mt-1">Hall of Fame</p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-300">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm">Total {leaderboardData.length} Game</p>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="group bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-slate-500/25 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </span>
        </button>
      </div>

      {/* Leaderboard */}
      {sortedData.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-600/20 to-slate-700/20 rounded-full flex items-center justify-center">
            <span className="text-4xl opacity-50">📊</span>
          </div>
          <p className="text-slate-400 text-xl">Belum ada data permainan</p>
          <p className="text-slate-500 text-sm mt-2">Jadilah yang pertama untuk bermain!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 3 Podium */}
          {sortedData.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-600/30">
              {/* 2nd Place */}
              <div className="md:order-1 flex flex-col items-center p-4 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-600/20">
                <div className={`w-16 h-16 rounded-full ${getRankBadge(2).gradient} ${getRankBadge(2).glow} flex items-center justify-center mb-3 text-2xl font-bold ${getRankBadge(2).text}`}>
                  {getRankBadge(2).icon}
                </div>
                <h3 className="font-bold text-slate-200 text-center mb-1">{sortedData[1].playerName}</h3>
                <p className="text-amber-400 font-semibold text-lg">{sortedData[1].score}</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getPercentageStyle(sortedData[1].percentage).gradient} ${getPercentageStyle(sortedData[1].percentage).text} ${getPercentageStyle(sortedData[1].percentage).glow}`}>
                  {sortedData[1].percentage}%
                </span>
              </div>

              {/* 1st Place - Highlighted */}
              <div className="md:order-2 flex flex-col items-center p-6 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-600/10 rounded-xl backdrop-blur-sm border-2 border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                <div className={`w-20 h-20 rounded-full ${getRankBadge(1).gradient} ${getRankBadge(1).glow} flex items-center justify-center mb-4 text-3xl font-bold ${getRankBadge(1).text} relative z-10`}>
                  {getRankBadge(1).icon}
                </div>
                <h3 className="font-bold text-white text-center mb-2 text-lg relative z-10">{sortedData[0].playerName}</h3>
                <p className="text-amber-400 font-bold text-2xl relative z-10">{sortedData[0].score}</p>
                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full mt-3 ${getPercentageStyle(sortedData[0].percentage).gradient} ${getPercentageStyle(sortedData[0].percentage).text} ${getPercentageStyle(sortedData[0].percentage).glow} relative z-10`}>
                  {sortedData[0].percentage}%
                </span>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 flex flex-col items-center p-4 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-xl backdrop-blur-sm border border-slate-600/20">
                <div className={`w-16 h-16 rounded-full ${getRankBadge(3).gradient} ${getRankBadge(3).glow} flex items-center justify-center mb-3 text-2xl font-bold ${getRankBadge(3).text}`}>
                  {getRankBadge(3).icon}
                </div>
                <h3 className="font-bold text-slate-200 text-center mb-1">{sortedData[2].playerName}</h3>
                <p className="text-amber-400 font-semibold text-lg">{sortedData[2].score}</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mt-2 ${getPercentageStyle(sortedData[2].percentage).gradient} ${getPercentageStyle(sortedData[2].percentage).text} ${getPercentageStyle(sortedData[2].percentage).glow}`}>
                  {sortedData[2].percentage}%
                </span>
              </div>
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-600/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600/30">Peringkat</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600/30">Pemain</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600/30">Skor</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600/30">Akurasi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-600/30">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {sortedData.map((entry, index) => {
                    const rank = index + 1;
                    const rankBadge = getRankBadge(rank);
                    const percentageStyle = getPercentageStyle(entry.percentage);
                    
                    return (
                      <tr key={entry.id || `${entry.playerName}-${entry.completedAt}`} className="hover:bg-slate-600/20 transition-all duration-300 group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className={`w-10 h-10 rounded-full ${rankBadge.gradient} ${rankBadge.glow} flex items-center justify-center text-sm font-bold ${rankBadge.text} group-hover:scale-110 transition-transform duration-300`}>
                            {rank <= 3 ? rankBadge.icon : rank}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-sky-500/20 to-cyan-600/20 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <span className="text-sky-400 font-bold text-sm">{entry.playerName.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <div className="text-slate-200 font-semibold text-base group-hover:text-white transition-colors duration-300">{entry.playerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-amber-400 font-bold text-lg group-hover:text-amber-300 transition-colors duration-300">{entry.score}</div>
                          <div className="text-xs text-slate-400 mt-1">{entry.correctAnswers}/{entry.totalQuestions} benar</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-full ${percentageStyle.gradient} ${percentageStyle.text} ${percentageStyle.glow} group-hover:scale-105 transition-transform duration-300`}>
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                          {formatDate(entry.completedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={fetchLeaderboard}
          className="group bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5"
        >
          <span className="flex items-center gap-3">
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </span>
        </button>
      </div>
    </div>
  );
};

export default LeaderboardScreen;