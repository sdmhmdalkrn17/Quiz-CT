import React, { useState, useEffect, useRef } from 'react';
import AkaiAvatar from '../assets/Akai_Avatar.png';
import EstesAvatar from '../assets/Estes_Avatar.png';
import FrancoAvatar from '../assets/Franco_Avatar.png';
import FreyaAvatar from '../assets/Freya_Avatar.png';
import HayabusaAvatar from '../assets/Hayabusa_Avatar.png';
import LaylaAvatar from '../assets/Layla_Avatar.png';
import YiSunShinAvatar from '../assets/Yi_Sun-shin_Avatar.png';
import ZhilongAvatar from '../assets/Zhilong_Avatar.png';

// Simulasi GameMode type
type GameMode = 'practice' | 'exam';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, gameMode: GameMode) => void;
  gameTitle: string;
  onNavigateToSettings: () => void;
  onNavigateToLeaderboard: () => void;
  onNavigateToMaterial: () => void;
  playerName?: string;
}

// Avatar dari folder assets
const DEFAULT_AVATARS = [
  AkaiAvatar,
  EstesAvatar,
  FrancoAvatar,
  FreyaAvatar,
  HayabusaAvatar,
  LaylaAvatar,
  YiSunShinAvatar,
  ZhilongAvatar,
];

// --- FUNGSI KOMPRESI GAMBAR (TIDAK BERUBAH) ---
const compressImage = (file: File, targetSizeKB: number = 100): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      const maxDimension = 800;
      
      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width;
        width = maxDimension;
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height;
        height = maxDimension;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      const findOptimalQuality = (quality: number): string => {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        return dataUrl;
      };
      
      let minQuality = 0.1;
      let maxQuality = 0.9;
      let bestDataUrl = '';
      let attempts = 0;
      const maxAttempts = 10;
      
      while (minQuality <= maxQuality && attempts < maxAttempts) {
        const midQuality = (minQuality + maxQuality) / 2;
        const testDataUrl = findOptimalQuality(midQuality);
        const sizeKB = (testDataUrl.length * 0.75) / 1024;
        
        if (sizeKB <= targetSizeKB) {
          bestDataUrl = testDataUrl;
          minQuality = midQuality + 0.05;
        } else {
          maxQuality = midQuality - 0.05;
        }
        
        attempts++;
      }
      
      if (!bestDataUrl) {
        const smallerCanvas = document.createElement('canvas');
        const smallerCtx = smallerCanvas.getContext('2d');
        const reduction = 0.8;
        
        smallerCanvas.width = width * reduction;
        smallerCanvas.height = height * reduction;
        smallerCtx?.drawImage(img, 0, 0, smallerCanvas.width, smallerCanvas.height);
        
        bestDataUrl = smallerCanvas.toDataURL('image/jpeg', 0.7);
      }
      
      resolve(bestDataUrl);
    };
    
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = URL.createObjectURL(file);
  });
};


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStartGame, 
  gameTitle, 
  onNavigateToSettings,
  onNavigateToLeaderboard,
  onNavigateToMaterial,
  playerName 
}) => {
  const [name, setName] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [error, setError] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [compressionProgress, setCompressionProgress] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- START: KODE PERBAIKAN UNTUK EFEK TYPEWRITER ---
  const [typedText, setTypedText] = useState('');
  const typewriterText = "Hello Rads, Let's Begin the Explorer !🩻";
  const typingSpeed = 100;
  const pauseDuration = 2000;

  useEffect(() => {
    let timeoutId: number;
    let charIndex = 0;

    const type = () => {
      setTypedText(typewriterText.substring(0, charIndex));

      if (charIndex < typewriterText.length) {
        charIndex++;
        timeoutId = window.setTimeout(type, typingSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          charIndex = 0;
          type();
        }, pauseDuration);
      }
    };
    timeoutId = window.setTimeout(type, typingSpeed);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const BlinkingCursor = () => <span className="blinking-cursor">|</span>;

  useEffect(() => {
    if (playerName && playerName.trim()) {
      setName(playerName.trim());
    }
  }, [playerName]);

  useEffect(() => {
    const trimmedName = name.trim();
    if (trimmedName) {
      const storedImage = localStorage.getItem(`profileImage_${trimmedName}`);
      if (storedImage) {
        setProfileImageUrl(storedImage);
      } else {
        setProfileImageUrl('');
      }
    } else {
      setProfileImageUrl('');
    }
  }, [name]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setError('Ukuran file gambar terlalu besar. Maksimal 20MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('File yang dipilih bukan gambar.');
        return;
      }
      setError('');
      setIsImageLoading(true);
      setCompressionProgress('Mengompres gambar...');
      try {
        const compressedImageUrl = await compressImage(file, 100);
        setProfileImageUrl(compressedImageUrl);
        setShowAvatarModal(false);
        const trimmedName = name.trim();
        if (trimmedName) {
          localStorage.setItem(`profileImage_${trimmedName}`, compressedImageUrl);
        }
        setCompressionProgress('Gambar berhasil dikompres!');
        setTimeout(() => {
          setCompressionProgress('');
        }, 2000);
      } catch (error) {
        console.error('Error compressing image:', error);
        setError('Gagal mengompres gambar. Silakan coba lagi.');
      } finally {
        setIsImageLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    setProfileImageUrl(avatarUrl);
    setShowAvatarModal(false);
    const trimmedName = name.trim();
    if (trimmedName) {
      localStorage.setItem(`profileImage_${trimmedName}`, avatarUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openAvatarModal = () => {
    setShowAvatarModal(true);
  };

  const handleSubmit = () => {
    if (name.trim() === '') {
      setError('Nama tidak boleh kosong.');
      return;
    }
    setError('');
    const trimmedName = name.trim();
    if (profileImageUrl) {
      localStorage.setItem(`profileImage_${trimmedName}`, profileImageUrl);
    }
    onStartGame(trimmedName, gameMode);
  };

  return (
    <>
      {/* Dark Wrapper Container */}
      <div className="min-h-screen bg-slate-900">
        <div className="flex flex-col items-center p-8">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              {isImageLoading ? (
                <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                </div>
              ) : profileImageUrl ? (
                <img 
                  src={profileImageUrl} 
                  alt="Profil Pengguna" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-700 cursor-pointer hover:border-slate-600 transition-all duration-300 hover:scale-105"
                  onClick={openAvatarModal}
                />
              ) : (
                <div 
                  className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 cursor-pointer hover:border-slate-600 transition-all duration-300 hover:scale-105 flex items-center justify-center"
                  onClick={openAvatarModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              
              <button
                onClick={openAvatarModal}
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
          
          {compressionProgress && (
            <div className="mb-4 px-4 py-2 bg-sky-900 border border-sky-700 rounded-xl">
              <p className="text-sky-300 text-sm text-center">{compressionProgress}</p>
            </div>
          )}
          
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent text-center">
            {gameTitle}
          </h1>
          
          <p className="text-gray-300 text-lg font-medium h-7 mb-8">
            {typedText}
            <BlinkingCursor />
          </p>
          
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <label htmlFor="playerName" className="text-gray-300 font-medium text-sm">
                Nama Pemain
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="playerName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="w-full px-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 to-teal-600/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 font-medium text-sm">Mode Permainan</p>
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
                    <div className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center
                      ${gameMode === mode 
                        ? 'border-sky-500 bg-sky-900 text-white' 
                        : 'border-slate-700 bg-slate-800 text-gray-300 hover:border-slate-600 hover:bg-slate-700'
                      }`}>
                      <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300
                        ${gameMode === mode 
                          ? 'bg-gradient-to-r from-sky-600/20 to-teal-600/20 opacity-100' 
                          : 'opacity-0'
                        }`}></div>
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
              <div className="bg-red-900 border border-red-700 rounded-2xl p-3">
                <p className="text-red-300 text-sm text-center" role="alert">{error}</p>
              </div>
            )}
            
            <button
              onClick={handleSubmit}
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
          </div>
          
          <div className="mt-8 w-full max-w-md space-y-3">
            <button
              onClick={onNavigateToMaterial}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Materi Pembelajaran</span>
            </button>
            
            <button
              onClick={onNavigateToLeaderboard}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Papan Peringkat</span>
            </button>
            
            <button
              onClick={onNavigateToSettings}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
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

      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Pilih Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 hover:bg-slate-700 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {DEFAULT_AVATARS.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="relative group"
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-16 h-16 rounded-full border-2 border-slate-600 hover:border-sky-500 transition-all duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-sky-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-gray-400">atau</span>
                </div>
              </div>
              <button
                onClick={triggerFileInput}
                disabled={isImageLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isImageLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload dari Perangkat</span>
                  </>
                )}
              </button>
              <p className="text-gray-400 text-xs text-center">
                Gambar akan dikompres otomatis hingga ~100KB
              </p>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .blinking-cursor {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        `
      }} />
    </>
  );
};

export default WelcomeScreen;