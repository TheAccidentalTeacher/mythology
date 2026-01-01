# 🎵 Sound System Implementation Guide

**Date:** December 31, 2025  
**Status:** Implemented (awaiting sound files)

## Overview

Complete sound system with global sound manager, React hooks, settings UI, and integration into key features.

## 📦 What Was Created

### 1. Core Sound Infrastructure

**Files:**
- `app/src/hooks/useSound.ts` - React hook for individual sounds
- `app/src/lib/soundManager.ts` - Global sound manager singleton
- `app/src/components/SoundSettings.tsx` - Settings UI with mute toggle & volume slider
- `app/public/sounds/README.md` - Complete guide for finding and preparing sounds

**Features:**
- ✅ Global sound manager with preloading
- ✅ Master volume control (0-1)
- ✅ Mute toggle with localStorage persistence
- ✅ Per-sound volume control
- ✅ Browser autoplay handling
- ✅ Loop and stop functionality
- ✅ Error handling for blocked autoplay

### 2. Sound Integration

**Mythology Wizard:**
- ✅ Step completion sound (`stepComplete`)
- ✅ Final wizard completion celebration (`wizardComplete`)

**Ready for Integration:**
- Battle system (victory, defeat, sword clash, critical)
- Math quiz (success, error)
- Image generation (processing, completion)
- Level up system (xpGain, levelUp, badgeUnlock)
- UI feedback (click, whoosh)

### 3. UI Components

**SoundSettings Component:**
- Dropdown panel with settings
- Mute/unmute toggle button
- Volume slider (0-100%)
- Sound types info
- Educational note about focus

**SoundToggle Component:**
- Compact version for headers/toolbars
- Single button mute toggle
- Visual feedback (Volume2/VolumeX icons)

## 🎯 Sound Files Needed

### Required (Core Experience)

| File | Location | Length | Use Case |
|------|----------|--------|----------|
| click.mp3 | /sounds/ui/ | 50-100ms | Button clicks |
| success.mp3 | /sounds/ui/ | 200-300ms | Success confirmations |
| error.mp3 | /sounds/ui/ | 200-300ms | Error notifications |
| whoosh.mp3 | /sounds/ui/ | 300-500ms | Transitions |
| level-up.mp3 | /sounds/effects/ | 1-2s | Level up |
| badge-unlock.mp3 | /sounds/effects/ | 1-2s | Badge earned |
| xp-gain.mp3 | /sounds/effects/ | 500ms | XP awarded |
| victory.mp3 | /sounds/effects/ | 2-3s | Battle won |
| defeat.mp3 | /sounds/effects/ | 1-2s | Battle lost |
| sword-clash.mp3 | /sounds/effects/ | 500ms | Battle attack |
| critical.mp3 | /sounds/effects/ | 700ms | Critical hit |
| magic-cast.mp3 | /sounds/effects/ | 800ms | Magic ability |
| image-complete.mp3 | /sounds/effects/ | 1-2s | Image generated |
| step-complete.mp3 | /sounds/effects/ | 500ms | Wizard step done |
| wizard-complete.mp3 | /sounds/effects/ | 2-3s | Wizard finished |

### Optional (Enhanced Experience)

| File | Location | Length | Use Case |
|------|----------|--------|----------|
| ocean-waves.mp3 | /sounds/ambient/ | 15-30s loop | Ocean mythologies |
| forest-birds.mp3 | /sounds/ambient/ | 15-30s loop | Forest mythologies |
| mystical.mp3 | /sounds/ambient/ | 15-30s loop | General ambience |

**Total Required:** 15 sound files  
**Estimated Total Size:** < 1 MB (compressed MP3s)

## 🔍 Where to Get Sounds

### Best Free Resources:

1. **Freesound.org** ⭐ (Recommended)
   - Create free account
   - Search terms: "button click", "success chime", "sword clash", "magic spell"
   - License: CC0 or CC-BY (most are free)

2. **Zapsplat.com**
   - High quality UI sounds
   - Free with attribution

3. **Mixkit.co**
   - No attribution required
   - Modern, clean sounds

4. **OpenGameArt.org**
   - Game-focused fantasy sounds
   - Background music loops

### Quick Search Guide:

```
UI Sounds:
- "soft button click" → click.mp3
- "success notification chime" → success.mp3
- "error beep" → error.mp3
- "whoosh transition" → whoosh.mp3

Effect Sounds:
- "level up fanfare" → level-up.mp3
- "achievement unlock" → badge-unlock.mp3
- "victory celebration" → victory.mp3
- "sword hit metal" → sword-clash.mp3
- "magic spell cast" → magic-cast.mp3
- "completion chime" → step-complete.mp3, wizard-complete.mp3

Ambient:
- "ocean waves loop seamless" → ocean-waves.mp3
- "forest ambience birds" → forest-birds.mp3
- "mystical fantasy drone" → mystical.mp3
```

## 🛠️ Sound Preparation

### Using ffmpeg (Command Line):

```bash
# Install ffmpeg: https://ffmpeg.org/download.html

# Convert WAV to MP3 (UI sound, mono, compressed)
ffmpeg -i input.wav -ac 1 -b:a 64k click.mp3

# Convert to MP3 (Effect sound, stereo, standard quality)
ffmpeg -i input.wav -b:a 128k victory.mp3

# Trim to 2 seconds
ffmpeg -i input.mp3 -t 2 output.mp3

# Add fade in/out (smooth)
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=0.3,afade=t=out:st=1.7:d=0.3" output.mp3
```

### Online Tools (No Installation):

- **Online-Convert.com** - Convert to MP3
- **Audio Trimmer** - Cut length
- **MP3 Smaller** - Compress file size

## 💻 Usage Examples

### Basic Sound Playback

```typescript
import { soundManager } from '@/lib/soundManager';

// Play a sound
soundManager.play('click', { volume: 0.3 });

// Play looping ambient
soundManager.play('oceanAmbient', { volume: 0.2, loop: true });

// Stop a sound
soundManager.stop('oceanAmbient');

// Stop all sounds
soundManager.stopAll();
```

### React Hook Usage

```typescript
import { useSound } from '@/hooks/useSound';

function MyComponent() {
  const clickSound = useSound('/sounds/ui/click.mp3', { 
    volume: 0.3 
  });
  
  return (
    <button onClick={clickSound.play}>
      Click Me
    </button>
  );
}
```

### Settings Component

```typescript
import { SoundSettings, SoundToggle } from '@/components/SoundSettings';

// Full settings panel
<SoundSettings />

// Compact toggle for header
<SoundToggle />
```

## 🎮 Integration Checklist

### ✅ Already Integrated:
- [x] Mythology Wizard step completion
- [x] Mythology Wizard final celebration

### 📋 Ready to Integrate:

**Battle System** (`app/src/app/student/mythology/[id]/battle/page.tsx`):
```typescript
// On attack
soundManager.play('swordClash', { volume: 0.3 });

// On critical hit
soundManager.play('critical', { volume: 0.5 });

// On victory
soundManager.play('victory', { volume: 0.6 });

// On defeat
soundManager.play('defeat', { volume: 0.4 });
```

**Math Quiz** (`app/src/components/MathQuizModal.tsx`):
```typescript
// On correct answer
soundManager.play('success', { volume: 0.4 });
confetti(); // Existing confetti

// On incorrect answer
soundManager.play('error', { volume: 0.3 });
```

**Image Generation** (`app/src/components/ImageGenerationPanel.tsx`):
```typescript
// When generation completes
soundManager.play('imageComplete', { volume: 0.5 });
```

**Level Up** (Profile component):
```typescript
// When level increases
soundManager.play('levelUp', { volume: 0.6 });

// When badge unlocked
soundManager.play('badgeUnlock', { volume: 0.6 });

// When XP gained
soundManager.play('xpGain', { volume: 0.3 });
```

**Button Clicks** (Global):
```typescript
// Add to common buttons
onClick={() => {
  soundManager.play('click', { volume: 0.2 });
  // ... existing logic
}}
```

## 🎨 Adding to Layout/Header

Add sound controls to your app header:

```typescript
// In app/src/app/layout.tsx or header component
import { SoundToggle } from '@/components/SoundSettings';

<header className="flex items-center justify-between">
  {/* Other header items */}
  <SoundToggle />
</header>
```

Or add full settings panel to user menu/dropdown.

## ⚠️ Important Notes

### Browser Autoplay Restrictions:
- Sounds won't play until user interacts with page (clicks anything)
- This is handled automatically by soundManager
- First interaction enables all future autoplay

### Performance:
- Sounds are preloaded on page load
- Limit concurrent sounds (max 3-5 at once)
- Use compressed MP3s (< 50 KB each)

### Accessibility:
- Always provide mute button (visible in header)
- Volume control available in settings
- Mute preference saved to localStorage
- Default volume is 50% (subtle but audible)

### Educational Setting:
- Sounds are subtle by default (0.3-0.5 volume)
- Easy to mute for focus
- No jarring or loud sounds
- Optional ambient can be disabled

## 📚 File Structure

```
app/
├── public/
│   └── sounds/
│       ├── ui/                    # UI sounds
│       │   ├── click.mp3
│       │   ├── success.mp3
│       │   ├── error.mp3
│       │   └── whoosh.mp3
│       ├── effects/               # Feature sounds
│       │   ├── level-up.mp3
│       │   ├── badge-unlock.mp3
│       │   ├── xp-gain.mp3
│       │   ├── victory.mp3
│       │   ├── defeat.mp3
│       │   ├── sword-clash.mp3
│       │   ├── critical.mp3
│       │   ├── magic-cast.mp3
│       │   ├── image-complete.mp3
│       │   ├── step-complete.mp3
│       │   └── wizard-complete.mp3
│       ├── ambient/               # Background loops
│       │   ├── ocean-waves.mp3
│       │   ├── forest-birds.mp3
│       │   └── mystical.mp3
│       └── README.md              # Sound guide
├── src/
│   ├── hooks/
│   │   └── useSound.ts            # React hook
│   ├── lib/
│   │   └── soundManager.ts        # Global manager
│   └── components/
│       └── SoundSettings.tsx      # Settings UI
```

## 🚀 Next Steps

1. **Download Sound Files** (1-2 hours)
   - [ ] Create accounts on Freesound.org and Zapsplat.com
   - [ ] Search for and download 15 sounds
   - [ ] Convert to MP3 if needed
   - [ ] Compress if files are large
   - [ ] Place in appropriate folders

2. **Test Sound System** (30 minutes)
   - [ ] Test wizard sounds
   - [ ] Test mute toggle
   - [ ] Test volume control
   - [ ] Verify localStorage persistence
   - [ ] Test on mobile

3. **Integrate into Features** (1-2 hours)
   - [ ] Add to battle system
   - [ ] Add to math quiz
   - [ ] Add to image generation
   - [ ] Add to level up
   - [ ] Add to UI buttons (optional)

4. **Polish** (30 minutes)
   - [ ] Add sound toggle to header
   - [ ] Test with Anna (real user)
   - [ ] Adjust default volumes based on feedback
   - [ ] Document in README

**Total Estimated Time:** 4-5 hours from start to finish

## 📖 Resources

- **Sound Manager:** `app/src/lib/soundManager.ts`
- **Sound Hook:** `app/src/hooks/useSound.ts`
- **Settings Component:** `app/src/components/SoundSettings.tsx`
- **Sound Guide:** `app/public/sounds/README.md`
- **This Document:** `SOUND_SYSTEM.md`

---

**Status:** ✅ Code implemented, awaiting sound files

The sound system is fully implemented and ready to use. Once you download the sound files (1-2 hours), the system will be fully functional. All code is in place and integrated into the wizard feature as a demonstration.
