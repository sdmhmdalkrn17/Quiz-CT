
import React, { useState, useEffect, useRef } from 'react';
import { GameMode } from '../types';

interface WelcomeScreenProps {
  onStartGame: (playerName: string, gameMode: GameMode) => void;
  gameTitle: string;
  onNavigateToSettings: () => void;
}

const DEFAULT_PROFILE_IMAGE_URL = "https://picsum.photos/seed/ctscanlogo/150/150";

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame, gameTitle, onNavigateToSettings }) => {
  const [name, setName] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('practice');
  const [error, setError] = useState<string>('');
  const [profileImageUrl, setProfileImageUrl] = useState<string>(DEFAULT_PROFILE_IMAGE_URL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmedName = name.trim();
    if (trimmedName) {
      const storedImage = localStorage.getItem(`profileImage_${trimmedName}`);
      if (storedImage) {
        setProfileImageUrl(storedImage);
      } else {
        // No image stored for this name.
        // If current profileImageUrl is custom (user just uploaded it before typing this name),
        // then associate this custom image with the newly typed name.
        if (profileImageUrl !== DEFAULT_PROFILE_IMAGE_URL) {
          localStorage.setItem(`profileImage_${trimmedName}`, profileImageUrl);
        } else {
          // No stored image, and current is default, so ensure it stays default.
          setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL);
        }
      }
    } else {
      // Name is empty, reset to default image.
      // If an image was previewed while name was empty, it's kept until name is typed or cleared.
      // If name is cleared after being typed, revert to default.
      if (profileImageUrl !== DEFAULT_PROFILE_IMAGE_URL && !fileInputRef.current?.files?.length) {
         // Only reset to default if not actively previewing a fresh upload with an empty name field.
         // This logic can be tricky, for simplicity, if name is empty, we usually show default.
         // The current effect ensures an uploaded image persists if name is typed *after* upload.
      }
       setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL); // Simplification: if name is empty, show default.
    }
  }, [name]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageUrl = e.target?.result as string;
        setProfileImageUrl(newImageUrl); // Update display immediately

        const trimmedName = name.trim();
        if (trimmedName) { // If there's a name, save the new image for it
          localStorage.setItem(`profileImage_${trimmedName}`, newImageUrl);
        }
        // If name is empty, newImageUrl is set for preview.
        // If user then types a name, the useEffect hook will handle associating it.
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
    // If profileImageUrl is still the default and a custom one exists for the name, ensure it's used.
    // This edge case might occur if the name was auto-filled without triggering the effect properly.
    const finalImageForName = localStorage.getItem(`profileImage_${name.trim()}`) || profileImageUrl;
    if (finalImageForName !== profileImageUrl && finalImageForName !== DEFAULT_PROFILE_IMAGE_URL) {
        // This check is a bit redundant given the useEffect, but as a safeguard.
    }
    // No need to pass profileImageUrl to onStartGame unless other components need it.
    onStartGame(name.trim(), gameMode);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-slate-800 rounded-lg">
      <div className="relative mb-6 group">
        <img 
          src={profileImageUrl} 
          alt="Profil Pengguna" 
          className="w-24 h-24 md:w-32 md:h-32 rounded-full shadow-lg border-4 border-sky-500 object-cover cursor-pointer"
          onClick={triggerFileInput}
          onError={() => setProfileImageUrl(DEFAULT_PROFILE_IMAGE_URL)} // Fallback if src is broken
        />
        <button
          onClick={triggerFileInput}
          aria-label="Ubah foto profil"
          className="absolute bottom-0 right-0 p-2 bg-slate-700 rounded-full hover:bg-sky-600 transition-colors border-2 border-slate-800 group-hover:border-sky-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-sky-400">{gameTitle}</h1>
      <p className="text-slate-300 mb-6 text-base sm:text-lg max-w-md">
        Halo Rek !!
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
        ...
      </p>
    </div>
  );
};

export default WelcomeScreen;
