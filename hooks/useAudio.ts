import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAudioReturn {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  isLoaded: boolean;
}

export const useAudio = (audioSrc: string, options?: {
  loop?: boolean;
  autoPlay?: boolean;
  volume?: number;
}): UseAudioReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(options?.volume || 0.3);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSrc);
    audio.loop = options?.loop ?? true;
    audio.volume = volume;
    audio.preload = 'auto';
    
    audioRef.current = audio;

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
      if (options?.autoPlay) {
        audio.play().catch(console.error);
      }
    };

    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, options?.loop, options?.autoPlay, volume]);

  const play = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(console.error);
    }
  }, [isMuted]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
      
      if (newMutedState) {
        audioRef.current.pause();
      } else if (!isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [isMuted, isPlaying]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    play,
    pause,
    toggleMute,
    setVolume,
    isLoaded
  };
};