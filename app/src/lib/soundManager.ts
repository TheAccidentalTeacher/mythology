'use client';

/**
 * Global Sound Manager
 * Manages all sound effects and ambient audio across the app
 * Handles preloading, muting, volume control, and localStorage persistence
 */

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.5;
  private isMuted: boolean = false;
  private userHasInteracted: boolean = false;

  constructor() {
    // Load preferences from localStorage
    if (typeof window !== 'undefined') {
      this.isMuted = localStorage.getItem('soundMuted') === 'true';
      const savedVolume = localStorage.getItem('soundVolume');
      if (savedVolume) {
        this.masterVolume = parseFloat(savedVolume);
      }

      // Track first user interaction to enable autoplay
      document.addEventListener('click', () => {
        this.userHasInteracted = true;
      }, { once: true });
    }
  }

  /**
   * Preload a sound file for instant playback
   */
  preload(id: string, url: string) {
    if (!this.sounds.has(id)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(id, audio);
    }
  }

  /**
   * Play a sound by ID
   */
  play(id: string, options?: { volume?: number; loop?: boolean }) {
    if (this.isMuted) return;

    let audio = this.sounds.get(id);
    if (!audio) {
      console.warn(`Sound ${id} not preloaded. Attempting to play anyway...`);
      return;
    }

    // Set volume (specific volume * master volume)
    audio.volume = (options?.volume ?? 1) * this.masterVolume;
    audio.loop = options?.loop ?? false;
    audio.currentTime = 0;
    
    // Play with error handling
    audio.play().catch(err => {
      // Browser prevented autoplay - this is normal on first load
      console.log('Audio play prevented:', err.message);
    });
  }

  /**
   * Stop a sound by ID
   */
  stop(id: string) {
    const audio = this.sounds.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    
    // Update all playing sounds
    this.sounds.forEach(audio => {
      if (!audio.paused) {
        audio.volume = this.masterVolume;
      }
    });

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundVolume', String(this.masterVolume));
    }
  }

  /**
   * Get current master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Toggle mute on/off
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', String(this.isMuted));
    }
    
    if (this.isMuted) {
      this.stopAll();
    }
  }

  /**
   * Set mute state explicitly
   */
  setMuted(muted: boolean) {
    this.isMuted = muted;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', String(this.isMuted));
    }
    
    if (this.isMuted) {
      this.stopAll();
    }
  }

  /**
   * Get current mute state
   */
  getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Check if user has interacted (needed for autoplay)
   */
  hasUserInteracted(): boolean {
    return this.userHasInteracted;
  }
}

// Create singleton instance
export const soundManager = new SoundManager();

// Preload common sounds when client-side
if (typeof window !== 'undefined') {
  // UI Sounds (very short, play frequently)
  soundManager.preload('click', '/sounds/ui/click.mp3');
  soundManager.preload('success', '/sounds/ui/success.mp3');
  soundManager.preload('error', '/sounds/ui/error.mp3');
  soundManager.preload('whoosh', '/sounds/ui/whoosh.mp3');
  
  // Gamification Sounds
  soundManager.preload('levelUp', '/sounds/effects/level-up.mp3');
  soundManager.preload('badgeUnlock', '/sounds/effects/badge-unlock.mp3');
  soundManager.preload('xpGain', '/sounds/effects/xp-gain.mp3');
  
  // Feature Sounds
  soundManager.preload('defeat', '/sounds/effects/defeat.mp3');
  soundManager.preload('swordClash', '/sounds/effects/sword-clash.mp3');
  soundManager.preload('critical', '/sounds/effects/critical.mp3');
  soundManager.preload('magicCast', '/sounds/effects/magic-cast.mp3');
  soundManager.preload('imageComplete', '/sounds/effects/image-complete.mp3');
  soundManager.preload('stepComplete', '/sounds/effects/step-complete.mp3');
  soundManager.preload('wizardComplete', '/sounds/effects/wizard-complete.mp3');
  
  // NOTE: Missing sounds - add these later:
  // soundManager.preload('victory', '/sounds/effects/victory.mp3');
  
  // Ambient Sounds (load on demand when needed)
  // soundManager.preload('mysticalAmbient', '/sounds/ambient/mystical-ambient.wav');
}
