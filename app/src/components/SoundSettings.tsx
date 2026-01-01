'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { soundManager } from '@/lib/soundManager';

export function SoundSettings() {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initialize from soundManager
    setIsMuted(soundManager.getMuted());
    setVolume(soundManager.getMasterVolume());
  }, []);

  const toggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(soundManager.getMuted());
    
    // Play test sound when unmuting
    if (!soundManager.getMuted()) {
      soundManager.play('success', { volume: 0.3 });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    soundManager.setMasterVolume(newVolume);
    
    // Play test sound at new volume
    if (!isMuted) {
      soundManager.play('click', { volume: 0.5 });
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
        title="Sound Settings"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-gray-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 w-64">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Sound Settings
              </h3>
            </div>

            {/* Mute Toggle */}
            <div className="mb-4">
              <button
                onClick={toggleMute}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg transition-colors
                  ${isMuted 
                    ? 'bg-gray-700 hover:bg-gray-650' 
                    : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50'
                  }
                `}
              >
                <span className="text-sm font-medium text-white">
                  {isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
                </span>
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                ) : (
                  <Volume2 className="w-5 h-5 text-amber-400" />
                )}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="mb-2">
              <label className="text-xs text-gray-400 mb-2 block">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className={`
                  w-full h-2 rounded-lg appearance-none cursor-pointer
                  ${isMuted ? 'opacity-50' : ''}
                  bg-gray-700
                `}
                style={{
                  background: isMuted 
                    ? '#374151' 
                    : `linear-gradient(to right, #f59e0b 0%, #f59e0b ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                }}
              />
            </div>

            {/* Sound Types Info */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Sound Types:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Button clicks & UI feedback</li>
                <li>• Success chimes & celebrations</li>
                <li>• Battle effects & victories</li>
                <li>• Progress meter animations</li>
                <li>• Level ups & badge unlocks</li>
              </ul>
            </div>

            {/* Educational Note */}
            <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-gray-400">
              💡 Sounds enhance the experience but can be disabled for focus.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Compact version for header/toolbar
 */
export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
  }, []);

  const toggleMute = () => {
    soundManager.toggleMute();
    setIsMuted(soundManager.getMuted());
    
    if (!soundManager.getMuted()) {
      soundManager.play('success', { volume: 0.3 });
    }
  };

  return (
    <button
      onClick={toggleMute}
      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
      title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-gray-400" />
      ) : (
        <Volume2 className="w-5 h-5 text-white" />
      )}
    </button>
  );
}
