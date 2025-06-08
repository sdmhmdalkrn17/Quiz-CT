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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
              Panel Admin - Kelola Soal & Data
            </h2>
          </div>

          <div className="p-6">
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
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

            {/* Navigation Tabs */}
            <div className="flex mb-8 bg-slate-700/50 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setShowLeaderboard(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  !showLeaderboard 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <span className="text-lg">📝</span>
                <span className="hidden sm:inline">Kelola Soal</span>
                <span className="sm:hidden">Soal</span>
              </button>
              <button
                onClick={() => setShowLeaderboard(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  showLeaderboard 
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg transform scale-[1.02]' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-600/50'
                }`}
              >
                <span className="text-lg">🏆</span>
                <span className="hidden sm:inline">Kelola Leaderboard</span>
                <span className="sm:hidden">Leaderboard</span>
              </button>
            </div>

            {!showLeaderboard ? (
              <>
                {/* Question Management Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-sky-300 mb-6 flex items-center">
                    <span className="w-2 h-6 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full mr-3"></span>
                    {editingQuestionId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
                  </h3>

                  <form onSubmit={handleSubmitQuestion} className="space-y-6">
                    <div>
                      <label htmlFor="questionText" className="block text-sm font-medium text-slate-300 mb-2">
                        Teks Pertanyaan
                      </label>
                      <textarea 
                        id="questionText" 
                        value={questionText} 
                        onChange={(e) => setQuestionText(e.target.value)} 
                        placeholder="Masukkan teks pertanyaan..." 
                        rows={3} 
                        className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 placeholder-slate-500" 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(['a', 'b', 'c', 'd'] as const).map(optId => {
                        const value = {a: optionA, b: optionB, c: optionC, d: optionD}[optId];
                        const setValue = {a: setOptionA, b: setOptionB, c: setOptionC, d: setOptionD}[optId];
                        return (
                          <div key={optId}>
                            <label htmlFor={`option${optId.toUpperCase()}`} className="block text-sm font-medium text-slate-300 mb-2">
                              Opsi {optId.toUpperCase()}
                            </label>
                            <input 
                              type="text" 
                              id={`option${optId.toUpperCase()}`} 
                              value={value} 
                              onChange={(e) => setValue(e.target.value)} 
                              placeholder={`Teks untuk opsi ${optId.toUpperCase()}`} 
                              className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 placeholder-slate-500" 
                              required={optId === 'a' || optId === 'b'} 
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="correctOption" className="block text-sm font-medium text-slate-300 mb-2">
                          Jawaban Benar
                        </label>
                        <select 
                          id="correctOption" 
                          value={correctOptionId} 
                          onChange={(e) => setCorrectOptionId(e.target.value)} 
                          className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200"
                        >
                          <option value="a">Opsi A</option>
                          <option value="b">Opsi B</option>
                          <option value="c">Opsi C</option>
                          <option value="d">Opsi D</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2">
                          Kategori (Opsional)
                        </label>
                        <input 
                          type="text" 
                          id="category" 
                          value={category} 
                          onChange={(e) => setCategory(e.target.value)} 
                          placeholder="Mis: Dasar CT Scan, Prosedur Klinis" 
                          className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 placeholder-slate-500" 
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="explanation" className="block text-sm font-medium text-slate-300 mb-2">
                        Penjelasan (Opsional)
                      </label>
                      <textarea 
                        id="explanation" 
                        value={explanation} 
                        onChange={(e) => setExplanation(e.target.value)} 
                        placeholder="Masukkan penjelasan untuk jawaban..." 
                        rows={2} 
                        className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-200 placeholder-slate-500" 
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        type="submit" 
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {editingQuestionId ? 'Simpan Perubahan' : 'Simpan Pertanyaan'}
                      </button>
                      {editingQuestionId && (
                        <button 
                          type="button" 
                          onClick={resetForm} 
                          className="flex-1 bg-slate-600/50 hover:bg-slate-600/70 text-slate-300 font-medium py-3 px-6 rounded-xl backdrop-blur-sm border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
                        >
                          Batal Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Questions List */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-sky-300 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full mr-3"></span>
                    Daftar Pertanyaan ({currentQuestions.length})
                  </h3>
                  <div className="bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/50 max-h-96 overflow-y-auto">
                    {currentQuestions.length > 0 ? (
                      <div className="divide-y divide-slate-600/50">
                        {currentQuestions.map((q, index) => (
                          <div key={q.id} className="p-4 hover:bg-slate-600/20 transition-all duration-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="font-medium text-slate-200 mb-1">
                                  {index + 1}. {q.text}
                                </div>
                                <div className="text-xs text-sky-400 flex flex-wrap gap-2">
                                  <span className="bg-sky-500/20 px-2 py-1 rounded-full">
                                    {q.category || 'Tanpa Kategori'}
                                  </span>
                                  <span className="bg-green-500/20 px-2 py-1 rounded-full">
                                    Benar: {q.correctOptionId.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button 
                                  onClick={() => populateFormForEdit(q)} 
                                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDelete(q.id)} 
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Belum ada pertanyaan yang disimpan</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Leaderboard Management Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-sky-300 flex items-center">
                    <span className="w-2 h-6 bg-gradient-to-b from-sky-400 to-blue-500 rounded-full mr-3"></span>
                    Leaderboard ({leaderboardData.length} Pemain )
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

                {leaderboardError && (
                  <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-xl mb-6 backdrop-blur-sm">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold">Error memuat data leaderboard:</p>
                        <p className="text-sm mt-1">{leaderboardError}</p>
                      </div>
                    </div>
                  </div>
                )}

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
              </>
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