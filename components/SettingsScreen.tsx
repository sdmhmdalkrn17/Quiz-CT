import React, { useState, useCallback, useEffect } from 'react';
import { Question } from '../types';
import { ADMIN_CODE } from '../constants';

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

  if (!isAdminAuthenticated) {
    return (
      <div className="p-6 sm:p-8 bg-slate-800 rounded-lg min-h-[400px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold mb-6 text-sky-400">Akses Admin Pengaturan Soal</h2>
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

  return (
    <div className="p-6 sm:p-8 bg-slate-800 rounded-lg min-h-[500px] flex flex-col">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-sky-400 text-center">
        {editingQuestionId ? 'Edit Pertanyaan' : 'Tambah Pertanyaan Baru'}
      </h2>
      
      {error && <p className="text-red-400 mb-4 text-sm p-3 bg-red-900/50 rounded-md" role="alert">{error}</p>}
      {successMessage && <p className="text-green-400 mb-4 text-sm p-3 bg-green-900/50 rounded-md" role="status">{successMessage}</p>}

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