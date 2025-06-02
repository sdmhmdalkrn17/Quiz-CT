import React, { useState } from 'react';
import { GameMode } from '../types';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, gameMode: GameMode) => void;
  gameTitle: string;
  onNavigateToSettings: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, gameTitle, onNavigateToSettings }) => {
  const [name, setName] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Nama tidak boleh kosong.');
      return;
    }
    setError('');
    onStartGame(name.trim(), gameMode);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-800 rounded-lg">
      <img src="https://picsum.photos/seed/ctscanlogo/150/150" alt="CT Scan Icon" className="w-24 h-24 md:w-32 md:h-32 mb-6 rounded-full shadow-lg border-4 border-sky-500" />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-sky-400">{gameTitle}</h1>
      <p className="text-slate-300 mb-6 text-base sm:text-lg max-w-md">
        Selamat datang! Uji pengetahuan Anda tentang Computed Tomography (CT) Scan melalui kuis interaktif ini.
      </p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm mb-6">
        <div className="mb-4">
            <label htmlFor="playerName" className="sr-only">Nama Pemain</label>
            <input
            type="text"
            id="playerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama Anda"
            aria-label="Nama Pemain"
            className="w-full px-4 py-3 text-slate-900 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors"
            />
        </div>

        <div className="mb-6">
          <p className="text-slate-300 mb-2 font-medium">Pilih Mode Permainan:</p>
          <div className="flex justify-center space-x-4">
            {(['practice', 'exam'] as GameMode[]).map((mode) => (
              <label key={mode} className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-slate-700">
                <input
                  type="radio"
                  name="gameMode"
                  value={mode}
                  checked={gameMode === mode}
                  onChange={() => setGameMode(mode)}
                  className="form-radio h-5 w-5 text-sky-600 bg-slate-700 border-slate-500 focus:ring-sky-500"
                />
                <span className="text-slate-200 capitalize">{mode === 'practice' ? 'Latihan' : 'Ujian'}</span>
              </label>
            ))}
          </div>
           {gameMode === 'exam' && <p className="text-xs text-amber-400 mt-2">Mode Ujian: Feedback jawaban akan ditampilkan di akhir.</p>}
        </div>
        
        {error && <p className="text-red-400 mb-4 text-sm" role="alert">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
        >
          Mulai Permainan
        </button>
      </form>
      
      <button
        onClick={onNavigateToSettings}
        className="w-full max-w-sm bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 text-lg mt-4"
      >
        Pengaturan Soal
      </button>
      <p className="text-xs text-slate-500 mt-8">
        Permainan ini dirancang untuk tujuan edukasi dan dapat digunakan dalam sesi kelas besar.
      </p>
    </div>
  );
};

export default WelcomeScreen;