import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlsProps {
  isMuted: boolean;
  isPlaying: boolean;
  onToggleMute: () => void;
  isLoaded: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  isMuted,
  onToggleMute,
  isLoaded,
  className = ""
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {/* Speaker toggle button */}
      <button
        onClick={onToggleMute}
        className={`p-2 rounded-lg transition-all duration-300 ${
          isMuted 
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
            : 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30'
        } border border-current/20 hover:border-current/40 active:scale-95`}
        title={isMuted ? 'Turn on audio' : 'Turn off audio'}
        disabled={!isLoaded}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  );
};

export default AudioControls;