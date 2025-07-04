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
  profileImageUrl?: string;
}

interface LeaderboardScreenProps {
  onBack: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showAll, setShowAll] = useState(false); // State untuk toggle tampilan
  const [totalRecords, setTotalRecords] = useState(0); // Total records di database

  // Function to fetch leaderboard data
  const fetchLeaderboard = async (showAllData: boolean = false) => {
    setLoading(true);
    setError('');
    
    try {
      // Tambahkan parameter limit berdasarkan showAll state
      const limitParam = showAllData ? '' : '?limit=10';
      const response = await fetch(`https://leaderboard-online.vercel.app/api/leaderboard${limitParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Pastikan data adalah array
      if (Array.isArray(data)) {
        setLeaderboardData(data);
        setTotalRecords(data.length);
      } else if (data.leaderboard && Array.isArray(data.leaderboard)) {
        setLeaderboardData(data.leaderboard);
        setTotalRecords(data.total || data.leaderboard.length);
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
    fetchLeaderboard(showAll);
  }, [showAll]);

  // Handler untuk toggle tampilan
  const handleToggleView = () => {
    setShowAll(!showAll);
  };

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
        year: 'numeric'
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  // Get rank badge styles with modern gradients
  const getRankBadgeStyles = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-br from-amber-500 to-amber-700 text-amber-100 shadow-lg shadow-amber-500/30';
    return 'bg-gradient-to-br from-slate-500 to-slate-700 text-slate-100 shadow-lg shadow-slate-500/20';
  };

  // Get percentage badge styles with modern gradients
  const getPercentageBadgeStyles = (percentage: number) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30';
    if (percentage >= 60) return 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-500/30';
    if (percentage >= 40) return 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30';
    return 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg shadow-red-500/30';
  };

  // Get trophy icon for top 3
  const getTrophyIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  // Component for profile image with fallback
  const ProfileImage: React.FC<{ 
    src?: string; 
    alt: string; 
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  }> = ({ src, alt, size = 'md', className = '' }) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };

    const handleImageError = () => {
      setImageError(true);
      setIsLoading(false);
    };

    const handleImageLoad = () => {
      setIsLoading(false);
    };

    // If no image URL or image failed to load, show fallback
    if (!src || imageError) {
      return (
        <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
          {alt.charAt(0).toUpperCase()}
        </div>
      );
    }

    return (
      <div className={`${sizeClasses[size]} ${className} relative`}>
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full animate-pulse"></div>
        )}
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover border-2 border-slate-400/30 shadow-lg ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl min-h-[500px] shadow-2xl border border-slate-700/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 border-t-sky-500 mb-6 shadow-lg"></div>
          <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-sky-400 animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-200 text-xl font-semibold">Memuat papan peringkat...</p>
          <p className="text-slate-400 text-sm">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 text-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl min-h-[500px] shadow-2xl border border-slate-700/50">
        <div className="text-red-400 mb-8">
          <div className="bg-red-500/10 rounded-full p-4 mb-4 border border-red-500/20">
            <svg className="w-12 h-12 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Gagal Memuat Data</h3>
          <p className="text-sm text-red-300/80 max-w-sm">{error}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => fetchLeaderboard(showAll)}
            className="bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-sky-500/30"
          >
            Coba Lagi
          </button>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-slate-500/30"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl min-h-[600px] max-w-7xl mx-auto shadow-2xl border border-slate-700/50">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 pb-6 border-b border-slate-700/50">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-sky-500 to-cyan-500 p-3 rounded-xl shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Papan Peringkat
            </h2>
          </div>
          <p className="text-slate-300/80 text-sm sm:text-base mb-4">
            {showAll ? (
              <>Menampilkan <span className="font-semibold text-sky-400">{leaderboardData.length}</span> dari <span className="font-semibold text-sky-400">{totalRecords}</span> Total Game</>
            ) : (
              <>Top <span className="font-semibold text-sky-400">10</span> dari <span className="font-semibold text-sky-400">{totalRecords}</span> Total Game</>
            )}
          </p>
          
          {/* Toggle Button */}
          <button
            onClick={handleToggleView}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
              showAll 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30'
            }`}
          >
            {showAll ? (
              <>
                <span className="mr-2">📊</span>
                Tampilkan Top 10
              </>
            ) : (
              <>
                <span className="mr-2">📈</span>
                Tampilkan Semua Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Leaderboard Content */}
      {sortedData.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-slate-700/30 rounded-2xl p-8 max-w-md mx-auto border border-slate-600/30">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-slate-400 text-lg mb-2">Belum ada data permainan</p>
            <p className="text-slate-500 text-sm">Mulai bermain untuk melihat peringkat!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-4">
            {sortedData.map((entry, index) => {
              const rank = index + 1;
              return (
                <div key={entry.id || `${entry.playerName}-${entry.completedAt}`} 
                     className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 rounded-xl p-4 shadow-lg border border-slate-600/30 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Rank Badge - Standalone */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${getRankBadgeStyles(rank)}`}>
                        {getTrophyIcon(rank) || rank}
                      </div>
                      
                      {/* Profile Image and Info - Separate from rank */}
                      <div className="flex items-center gap-3">
                        <ProfileImage 
                          src={entry.profileImageUrl} 
                          alt={entry.playerName}
                          size="md"
                        />
                        <div>
                          <h3 className="text-slate-200 font-semibold text-lg">{entry.playerName}</h3>
                          <p className="text-slate-400 text-sm">{formatDate(entry.completedAt)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Percentage Badge */}
                    <span className={`px-3 py-1 text-sm font-bold rounded-lg ${getPercentageBadgeStyles(entry.percentage)}`}>
                      {entry.percentage}%
                    </span>
                  </div>
                  
                  {/* Score Details */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-600/30">
                    <div className="text-center">
                      <p className="text-amber-400 font-bold text-xl">{entry.score}</p>
                      <p className="text-slate-400 text-xs">Skor</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-semibold">{entry.correctAnswers}</p>
                      <p className="text-slate-400 text-xs">Benar</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-300 font-semibold">{entry.totalQuestions}</p>
                      <p className="text-slate-400 text-xs">Total</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-2xl overflow-hidden shadow-xl border border-slate-600/30">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-900/70 to-slate-800/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Peringkat</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Pemain</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Skor</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Akurasi</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600/30">
                  {sortedData.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr key={entry.id || `${entry.playerName}-${entry.completedAt}`} 
                          className="hover:bg-slate-600/20 transition-all duration-200 group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105 ${getRankBadgeStyles(rank)}`}>
                              {getTrophyIcon(rank) || rank}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <ProfileImage 
                              src={entry.profileImageUrl} 
                              alt={entry.playerName}
                              size="lg"
                              className="group-hover:scale-105 transition-transform duration-200"
                            />
                            <div>
                              <div className="text-slate-200 font-semibold text-lg">{entry.playerName}</div>
                              <div className="text-slate-400 text-sm">ID: {entry.submissionId?.split('_')[0] || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-amber-400 font-bold text-xl">{entry.score}</div>
                          <div className="text-sm text-slate-400">{entry.correctAnswers}/{entry.totalQuestions} benar</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-lg transition-transform group-hover:scale-105 ${getPercentageBadgeStyles(entry.percentage)}`}>
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400">
                          {formatDate(entry.completedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-slate-700/50">
        <button
          onClick={() => fetchLeaderboard(showAll)}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-3 border border-teal-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Data</span>
        </button>
        
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 border border-slate-500/30 flex items-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Kembali</span>
        </button>
      </div>
    </div>
  );
};

export default LeaderboardScreen;