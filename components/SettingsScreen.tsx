import React, { useState, useEffect } from 'react';
import { GameMode } from '../types';
import { ADMIN_CODE } from '../constants';

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

interface SettingsScreenProps {
  onBackToWelcome: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBackToWelcome 
}) => {
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string>('');
  const [clearingData, setClearingData] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdminAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Kode admin salah.');
      setIsAdminAuthenticated(false);
    }
  };

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError('');
    
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
      setLeaderboardError(err instanceof Error ? err.message : 'Gagal memuat papan peringkat');
    } finally {
      setLeaderboardLoading(false);
    }
  };

  // Function to clear all leaderboard data
const clearAllLeaderboardData = async () => {
  if (!window.confirm('Apakah Anda yakin ingin menghapus SEMUA data leaderboard? Tindakan ini tidak dapat dibatalkan!')) {
    return;
  }

  setClearingData(true);
  try {
    const response = await fetch('https://leaderboard-online.vercel.app/api/clear-all-data', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confirmToken: 'CLEAR_ALL_DATA_CONFIRM'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    setSuccessMessage(`Semua data leaderboard berhasil dihapus! (${result.deletedCount})`);
    setLeaderboardData([]); // Clear local data
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (err) {
    console.error('Failed to clear leaderboard data:', err);
    setLeaderboardError(err instanceof Error ? err.message : 'Gagal menghapus data leaderboard');
    setTimeout(() => setLeaderboardError(''), 5000);
  } finally {
    setClearingData(false);
  }
};

  // Load leaderboard on component mount
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchLeaderboard();
    }
  }, [isAdminAuthenticated]);

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

  // Get rank badge color
  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-50 shadow-lg';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-50 shadow-lg';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-amber-50 shadow-lg';
    return 'bg-gradient-to-r from-slate-600 to-slate-700 text-slate-200 shadow-md';
  };

  // Get percentage badge color
  const getPercentageBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-green-50 shadow-lg';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-yellow-50 shadow-lg';
    if (percentage >= 40) return 'bg-gradient-to-r from-orange-500 to-red-500 text-orange-50 shadow-lg';
    return 'bg-gradient-to-r from-red-600 to-red-700 text-red-50 shadow-lg';
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 01-2-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Akses Admin</h2>
              <p className="text-slate-400 text-sm">Masukkan kode admin untuk melanjutkan</p>
            </div>
            
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-slate-300 mb-2">Kode Admin</label>
                <input
                  type="password"
                  id="adminCode"
                  value={adminCodeInput}
                  onChange={(e) => setAdminCodeInput(e.target.value)}
                  className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 placeholder-slate-500"
                  placeholder="Masukkan kode admin"
                />
              </div>
              
              {authError && (
                <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm" role="alert">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Masuk
              </button>
            </form>
            
            <button
              onClick={onBackToWelcome}
              className="w-full mt-4 bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 font-medium py-3 px-6 rounded-xl backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
            >
              Kembali ke Menu Utama
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sort leaderboard data by percentage (descending), then by score (descending)
  const sortedLeaderboardData = [...leaderboardData].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return b.score - a.score;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 p-6 border-b border-slate-700/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              Panel Admin - Kelola Leaderboard
            </h2>
          </div>

          <div className="p-6">
            {/* Alert Messages */}
            {leaderboardError && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {leaderboardError}
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-6 p-4 bg-green-900/50 border border-green-500/50 rounded-xl text-green-300 text-sm backdrop-blur-sm" role="status">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {successMessage}
                </div>
              </div>
            )}

            {/* Leaderboard Management Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-xl font-semibold text-sky-300 flex items-center">
                <span className="w-2 h-6 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full mr-3"></span>
                Leaderboard ({leaderboardData.length} Pemain)
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={fetchLeaderboard}
                  disabled={leaderboardLoading}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  {leaderboardLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={clearAllLeaderboardData}
                  disabled={clearingData || leaderboardData.length === 0}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  {clearingData ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span className="hidden sm:inline">Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span className="hidden sm:inline">Hapus Semua</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {leaderboardLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-500/30 border-t-sky-500 mb-6"></div>
                <p className="text-slate-300 text-lg">Memuat data leaderboard...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center p-12 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-400 text-lg">Belum ada data leaderboard</p>
              </div>
            ) : (
              <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50 overflow-hidden">
                {/* Mobile Card View */}
                <div className="block sm:hidden">
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-600/50">
                    {sortedLeaderboardData.map((entry, index) => {
                      const rank = index + 1;
                      return (
                        <div key={entry.id || `${entry.playerName}-${entry.completedAt}`} className="p-4 hover:bg-slate-600/20 transition-all duration-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(rank)}`}>
                                {rank}
                              </span>
                              <div>
                                <div className="text-slate-200 font-medium">{entry.playerName}</div>
                                <div className="text-xs text-slate-400">{formatDate(entry.completedAt)}</div>
                              </div>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPercentageBadgeColor(entry.percentage)}`}>
                              {entry.percentage}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-amber-400 font-semibold">Skor: {entry.score}</span>
                            <span className="text-slate-400">{entry.correctAnswers}/{entry.totalQuestions} benar</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden sm:block max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900/50 sticky top-0 backdrop-blur-sm">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Skor</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Akurasi</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-600/50">
                      {sortedLeaderboardData.map((entry, index) => {
                        const rank = index + 1;
                        return (
                          <tr key={entry.id || `${entry.playerName}-${entry.completedAt}`} className="hover:bg-slate-600/20 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRankBadgeColor(rank)}`}>
                                {rank}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-slate-200 font-medium">{entry.playerName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-amber-400 font-semibold">{entry.score}</div>
                              <div className="text-xs text-slate-400">{entry.correctAnswers}/{entry.totalQuestions}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPercentageBadgeColor(entry.percentage)}`}>
                                {entry.percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                              {formatDate(entry.completedAt)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={onBackToWelcome}
              className="w-full mt-8 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Kembali ke Menu Utama</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;