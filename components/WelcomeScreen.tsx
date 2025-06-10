import React, { useState, useEffect, useRef } from 'react';
import { GameMode } from '../types';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, gameMode: GameMode) => void;
  gameTitle: string;
  onNavigateToSettings: () => void;
  onNavigateToLeaderboard: () => void;
}

const DEFAULT_PROFILE_IMAGE_URL = "https://picsum.photos/seed/ctscanlogo/150/150";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStartGame, 
  gameTitle, 
  onNavigateToSettings,
  onNavigateToLeaderboard
}) => {
  const [name, setName] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [error, setError] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string>(DEFAULT_PROFILE_IMAGE_URL);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmedName = name.trim();
    if (trimmedName) {
      const storedImage = localStorage.getItem(`profileImage_${trimmedName}`);
      if (storedImage) {
        setProfileImageUrl(storedImage);
      } else {
        if (profileImageUrl !== DEFAULT_PROFILE_IMAGE_URL) {
          localStorage.setItem(`profileImage_${trimmedName}`, profileImageUrl);
        } else {
          setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL);
        }
      }
    } else {
      setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL);
    }
  }, [name]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImageLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setProfileImageUrl(newImageUrl);
        setIsImageLoading(false);

        const trimmedName = name.trim();
        if (trimmedName) {
          localStorage.setItem(`profileImage_${trimmedName}`, newImageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-slate-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                {isImageLoading ? (
                  <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img 
                    src={profileImageUrl} 
                    alt="Profil Pengguna" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white/30 cursor-pointer hover:border-white/50 transition-all duration-300 hover:scale-105"
                    onClick={triggerFileInput}
                    onError={() => setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL)}
                  />
                )}
                <button
                  onClick={triggerFileInput}
                  aria-label="Ubah foto profil"
                  className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full hover:from-sky-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
              {gameTitle}
            </h1>
            <p className="text-white/70 text-lg font-medium">
              Halo Sobat Radiologi !!
            </p>
          </div>
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="playerName" className="text-white/80 font-medium text-sm">
                Nama Pemain
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="playerName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-300 backdrop-blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-teal-500/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="space-y-4">
              <p className="text-white/80 font-medium text-sm">Mode Permainan</p>
              <div className="grid grid-cols-2 gap-3">
                {(['practice', 'exam'] as GameMode[]).map((mode) => (
                  <label key={mode} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="gameMode"
                      value={mode}
                      checked={gameMode === mode}
                      onChange={() => setGameMode(mode)}
                      className="sr-only"
                    />
                    <div className={`
                      relative p-4 rounded-2xl border-2 transition-all duration-300 text-center
                      ${gameMode === mode 
                        ? 'border-sky-500 bg-sky-500/20 text-white' 
                        : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:bg-white/10'
                      }
                    `}>
                      <div className={`
                        absolute inset-0 rounded-2xl transition-opacity duration-300
                        ${gameMode === mode 
                          ? 'bg-gradient-to-r from-sky-500/30 to-teal-500/30 opacity-100' 
                          : 'opacity-0'
                        }
                      `}></div>
                      <div className="relative z-10">
                        <div className="font-semibold">
                          {mode === 'practice' ? 'Latihan' : 'Ujian'}
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          {mode === 'practice' ? 'Feedback langsung' : 'Feedback di akhir'}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-3">
                <p className="text-red-300 text-sm text-center" role="alert">{error}</p>
              </div>
            )}
            
            {/* Start Game Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <span>Mulai Permainan</span>
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </form>
          
          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button
              onClick={onNavigateToLeaderboard}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Papan Peringkat</span>
            </button>

            <button
              onClick={onNavigateToSettings}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Pengaturan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
