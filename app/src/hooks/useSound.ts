'use client';

import { useEffect, useRef, useState } from 'react';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export function useSound(soundUrl: string, options: SoundOptions = {}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio(soundUrl);
    audioRef.current.volume = options.volume ?? 0.5;
    audioRef.current.loop = options.loop ?? false;

    // Set up event listeners
    const handleCanPlay = () => {
      setIsLoaded(true);
      if (options.autoplay) {
        play();
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audioRef.current.addEventListener('canplaythrough', handleCanPlay);
    audioRef.current.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundUrl]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch(err => {
        console.log('Audio play prevented:', err);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const setVolume = (vol: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, vol));
    }
  };

  return { play, pause, stop, setVolume, isPlaying, isLoaded };
}
