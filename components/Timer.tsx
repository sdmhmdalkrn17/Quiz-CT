
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isPlaying: boolean;
  key: number; // To reset timer
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPlaying, key }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  // Fix: Changed NodeJS.Timeout to number for browser compatibility
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(duration); // Reset time left when key changes (new question)
  }, [key, duration]);

  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeLeft <= 0 && isPlaying) { // Ensure onTimeUp is called only when timer was running and reached 0
        onTimeUp();
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // onTimeUp(); // onTimeUp will be called by the parent useEffect when timeLeft <= 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timeLeft, isPlaying, onTimeUp, duration]);


  const percentage = (timeLeft / duration) * 100;
  let progressBarColor = 'bg-green-500';
  if (percentage < 50) progressBarColor = 'bg-yellow-500';
  if (percentage < 25) progressBarColor = 'bg-red-500';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-slate-300">
        <span className="text-base font-medium">Sisa Waktu</span>
        <span className="text-sm font-semibold tabular-nums">{timeLeft} detik</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-3.5">
        <div
          className={`h-3.5 rounded-full transition-all duration-500 ease-linear ${progressBarColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;