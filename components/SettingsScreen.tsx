import React, { useState, useCallback, useEffect } from 'react';
import { Question, GameMode } from '../types';
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
  currentQuestions: Question[];
  onAddQuestion: (newQuestion: Question) => void;
  onEditQuestion: (updatedQuestion: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onBackToWelcome: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  currentQuestions, 
  onAddQuestion, 
  onEditQuestion,
  onDeleteQuestion,
  onBackToWelcome 
}) => {
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOptionId, setCorrectOptionId] = useState<string>('a');
  const [explanation, setExplanation] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  
  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string>('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [clearingData, setClearingData] = useState(false);

  const resetForm = useCallback(() => {
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOptionId('a');
    setExplanation('');
    setCategory('');
    setEditingQuestionId(null);
    setError('');
  }, []);

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
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccessMessage('Semua data leaderboard berhasil dihapus!');
      setLeaderboardData([]); // Clear local data
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to clear leaderboard data:', err);
      setError(err instanceof Error ? err.message : 'Gagal menghapus data leaderboard');
      setTimeout(() => setError(''), 5000);
    } finally {
      setClearingData(false);
    }
  };

  // Load leaderboard when showLeaderboard is toggled
  useEffect(() => {
    if (showLeaderboard && leaderboardData.length === 0) {
      fetchLeaderboard();
    }
  }, [showLeaderboard]);

  const populateFormForEdit = useCallback((question: Question) => {
    setEditingQuestionId(question.id);
    setQuestionText(question.text);
    setOptionA(question.options.find(opt => opt.id === 'a')?.text || '');
    setOptionB(question.options.find(opt => opt.id === 'b')?.text || '');
    setOptionC(question.options.find(opt => opt.id === 'c')?.text || '');
    setOptionD(question.options.find(opt => opt.id === 'd')?.text || '');
    setCorrectOptionId(question.correctOptionId);
    setExplanation(question.explanation || '');
    setCategory(question.category || '');
    setError('');
    setSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to see form
  }, []);

  const handleSubmitQuestion = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!questionText.trim() || !optionA.trim() || !optionB.trim()) {
      setError('Teks pertanyaan dan minimal dua opsi (A & B) harus diisi.');
      return;
    }
    const currentOptions = [
        { id: 'a', text: optionA.trim() },
        { id: 'b', text: optionB.trim() },
    ];
    if (optionC.trim()) currentOptions.push({ id: 'c', text: optionC.trim() });
    if (optionD.trim()) currentOptions.push({ id: 'd', text: optionD.trim() });

    if (!currentOptions.find(opt => opt.id === correctOptionId)?.text) {
        setError(`Opsi ${correctOptionId.toUpperCase()} dipilih sebagai jawaban benar tapi tidak diisi atau tidak valid.`);
        return;
    }

    const questionData: Question = {
      id: editingQuestionId || `q${Date.now()}`,
      text: questionText.trim(),
      options: currentOptions,
      correctOptionId,
      explanation: explanation.trim() || undefined,
      category: category.trim() || undefined,
    };

    if (editingQuestionId) {
      onEditQuestion(questionData);
      setSuccessMessage('Pertanyaan berhasil diperbarui!');
    } else {
      onAddQuestion(questionData);
      setSuccessMessage('Pertanyaan berhasil ditambahkan!');
    }
    
    resetForm();
    setTimeout(() => setSuccessMessage(''), 3000);

  }, [questionText, optionA, optionB, optionC, optionD, correctOptionId, explanation, category, editingQuestionId, onAddQuestion, onEditQuestion, resetForm]);

  const handleDelete = (questionId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
        onDeleteQuestion(questionId);
        setSuccessMessage("Pertanyaan berhasil dihapus.");
        if (editingQuestionId === questionId) { // If deleted question was being edited
            resetForm();
        }
        setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

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
    if (rank === 1) return 'bg-yellow-500 text-yellow-900';
    if (rank === 2) return 'bg-gray-400 text-gray-900';
    if (rank === 3) return 'bg-amber-600 text-amber-100';
    return 'bg-slate-600 text-slate-200';
  };

  // Get percentage badge color
  const getPercentageBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600 text-green-100';
    if (percentage >= 60) return 'bg-yellow-600 text-yellow-100';
    if (percentage >= 40) return 'bg-orange-600 text-orange-100';
    return 'bg-red-600 text-red-100';
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="p-6 sm:p-8 bg-slate-800 rounded-lg min-h-[400px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-6 text-sky-400">Akses Admin</h2>
        <form onSubmit={handleAdminLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label htmlFor="adminCode" className="block text-sm font-medium text-slate-300 mb-1">Kode Admin</label>
            <input
              type="password"
              id="adminCode"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
              placeholder="Masukkan kode admin"
            />
          </div>
          {authError && <p className="text-red-400 text-sm" role="alert">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Login
          </button>
        </form>
        <button
          onClick={onBackToWelcome}
          className="w-full max-w-sm mt-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Kembali ke Menu Utama
        </button>
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
    <div className="p-6 sm:p-8 bg-slate-800 rounded-lg min-h-[500px] flex flex-col">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-sky-400 text-center">
        Panel Admin - Kelola Soal & Data
      </h2>
      
      {error && <p className="text-red-400 mb-4 text-sm p-3 bg-red-900/50 rounded-md" role="alert">{error}</p>}
      {successMessage && <p className="text-green-400 mb-4 text-sm p-3 bg-green-900/50 rounded-md" role="status">{successMessage}</p>}

      {/* Navigation Tabs */}
      <div className="flex mb-6 bg-slate-700 rounded-lg p-1">
        <button
          onClick={() => setShowLeaderboard(false)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            !showLeaderboard 
              ? 'bg-sky-600 text-white shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
        >
          📝 Kelola Soal
        </button>
        <button
          onClick={() => setShowLeaderboard(true)}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
            showLeaderboard 
              ? 'bg-sky-600 text-white shadow-md' 
              : 'text-slate-300 hover:text-white hover:bg-slate-600'
          }`}
        >
          🏆 Kelola Leaderboard
        </button>
      </div>

      {!showLeaderboard ? (
        <>
          {/* Question Management Section */}
          <h3 className="text-xl font-semibold text-sky-300 mb-4">
            {editingQuestionId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
          </h3>

          <form onSubmit={handleSubmitQuestion} className="space-y-4 mb-8">
            <div>
              <label htmlFor="questionText" className="block text-sm font-medium text-slate-300 mb-1">Teks Pertanyaan</label>
              <textarea id="questionText" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Masukkan teks pertanyaan..." rows={3} className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" required />
            </div>

            {(['a', 'b', 'c', 'd'] as const).map(optId => {
              const value = {a: optionA, b: optionB, c: optionC, d: optionD}[optId];
              const setValue = {a: setOptionA, b: setOptionB, c: setOptionC, d: setOptionD}[optId];
              return (
                <div key={optId}>
                  <label htmlFor={`option${optId.toUpperCase()}`} className="block text-sm font-medium text-slate-300 mb-1">Opsi {optId.toUpperCase()}</label>
                  <input type="text" id={`option${optId.toUpperCase()}`} value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Teks untuk opsi ${optId.toUpperCase()}`} className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" required={optId === 'a' || optId === 'b'} />
                </div>
              );
            })}

            <div>
              <label htmlFor="correctOption" className="block text-sm font-medium text-slate-300 mb-1">Jawaban Benar</label>
              <select id="correctOption" value={correctOptionId} onChange={(e) => setCorrectOptionId(e.target.value)} className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none">
                <option value="a">Opsi A</option>
                <option value="b">Opsi B</option>
                <option value="c">Opsi C</option>
                <option value="d">Opsi D</option>
              </select>
            </div>

            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-slate-300 mb-1">Penjelasan (Opsional)</label>
              <textarea id="explanation" value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="Masukkan penjelasan untuk jawaban..." rows={2} className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Kategori (Opsional)</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Mis: Dasar CT Scan, Prosedur Klinis" className="w-full px-3 py-2 text-slate-900 bg-slate-100 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none" />
            </div>

            <div className="flex gap-x-4">
                 <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    {editingQuestionId ? 'Simpan Perubahan' : 'Simpan Pertanyaan'}
                </button>
                {editingQuestionId && (
                    <button type="button" onClick={resetForm} className="flex-1 bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md">
                        Batal Edit
                    </button>
                )}
            </div>
          </form>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-sky-300 mb-3">Daftar Pertanyaan Saat Ini ({currentQuestions.length})</h3>
            <div className="max-h-80 overflow-y-auto bg-slate-700/50 p-4 rounded-md custom-scrollbar">
              {currentQuestions.length > 0 ? (
                <ul className="space-y-2">
                  {currentQuestions.map((q, index) => (
                    <li key={q.id} className="text-slate-300 p-3 bg-slate-600 rounded text-sm flex justify-between items-center">
                      <div>
                        <span className="font-semibold">{index + 1}. {q.text}</span>
                        <span className="block text-xs text-sky-400 mt-1">({q.category || 'Tanpa Kategori'}) - Benar: {q.correctOptionId.toUpperCase()}</span>
                      </div>
                      <div className="space-x-2 flex-shrink-0">
                        <button onClick={() => populateFormForEdit(q)} className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded">Edit</button>
                        <button onClick={() => handleDelete(q.id)} className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Hapus</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400">Belum ada pertanyaan yang disimpan.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Leaderboard Management Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-sky-300">
              Kelola Data Leaderboard ({leaderboardData.length} entri)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={fetchLeaderboard}
                disabled={leaderboardLoading}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
              >
                {leaderboardLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                Refresh
              </button>
              <button
                onClick={clearAllLeaderboardData}
                disabled={clearingData || leaderboardData.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
              >
                {clearingData ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menghapus...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus Semua Data
                  </>
                )}
              </button>
            </div>
          </div>

          {leaderboardError && (
            <div className="bg-red-900/50 border border-red-600 text-red-300 p-4 rounded-md mb-4">
              <p className="font-semibold">Error memuat data leaderboard:</p>
              <p className="text-sm">{leaderboardError}</p>
            </div>
          )}

          {leaderboardLoading ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-700/50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mb-4"></div>
              <p className="text-slate-300">Memuat data leaderboard...</p>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center p-8 bg-slate-700/50 rounded-lg">
              <p className="text-slate-400 text-lg">Belum ada data leaderboard</p>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nama</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Skor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Akurasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-600">
                  {sortedLeaderboardData.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr key={entry.id || `${entry.playerName}-${entry.completedAt}`} className="hover:bg-slate-600/30 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getRankBadgeColor(rank)}`}>
                            {rank}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-slate-200 font-medium">{entry.playerName}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-amber-400 font-semibold">{entry.score}</div>
                          <div className="text-xs text-slate-400">{entry.correctAnswers}/{entry.totalQuestions}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPercentageBadgeColor(entry.percentage)}`}>
                            {entry.percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-400">
                          {formatDate(entry.completedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <button
        onClick={onBackToWelcome}
        className="w-full mt-auto bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Kembali ke Menu Utama
      </button>
    </div>
  );
};

export default SettingsScreen;