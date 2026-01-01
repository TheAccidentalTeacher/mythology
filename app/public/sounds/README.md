# 🎵 Sound Files Directory

This directory contains all sound effects and ambient audio for The Mythology Codex.

## 📁 Directory Structure

```
sounds/
├── ui/                    # UI interaction sounds (clicks, whooshes)
├── effects/               # Feature-specific sound effects
└── ambient/              # Background ambient loops (optional)
```

## 🎯 Required Sound Files

### UI Sounds (`/sounds/ui/`)
These are short, subtle sounds for interface interactions:

- **click.mp3** (50-100ms) - Button clicks, navigation
- **success.mp3** (200-300ms) - Success confirmations, correct answers
- **error.mp3** (200-300ms) - Error notifications, validation failures
- **whoosh.mp3** (300-500ms) - Page transitions, modal open/close

### Effect Sounds (`/sounds/effects/`)
Feature-specific celebratory or feedback sounds:

- **level-up.mp3** (1-2s) - Student levels up
- **badge-unlock.mp3** (1-2s) - Badge achievement unlocked
- **xp-gain.mp3** (500ms) - XP points awarded
- **victory.mp3** (2-3s) - Battle won, quiz completed
- **defeat.mp3** (1-2s) - Battle lost
- **sword-clash.mp3** (500ms) - Battle attack
- **critical.mp3** (700ms) - Critical hit in battle
- **magic-cast.mp3** (800ms) - Magic ability used
- **image-complete.mp3** (1-2s) - AI image generation finished
- **step-complete.mp3** (500ms) - Wizard step completed
- **wizard-complete.mp3** (2-3s) - Full wizard completion celebration

### Ambient Sounds (`/sounds/ambient/`) - OPTIONAL
Looping background audio (15-30s loops):

- **ocean-waves.mp3** - For oceanic mythologies
- **forest-birds.mp3** - For forest/nature mythologies
- **desert-wind.mp3** - For desert mythologies
- **fire-crackle.mp3** - For volcanic/fire mythologies
- **ice-wind.mp3** - For frozen/ice mythologies
- **mystical.mp3** - Generic mystical ambience

## 📥 Where to Get Sounds

### Free Sound Libraries:

1. **Freesound.org** ⭐ (Best choice)
   - Largest free library
   - Creative Commons licensed
   - Create free account
   - Search: "button click", "success chime", "sword clash", "magic spell"

2. **Zapsplat.com**
   - High quality
   - Free with attribution
   - Great UI sounds

3. **Mixkit.co/free-sound-effects**
   - No attribution required
   - Modern, clean sounds

4. **OpenGameArt.org**
   - Game-focused
   - Fantasy themes
   - Background loops

### Search Terms for Finding Sounds:

**UI:**
- "button click", "soft click", "ui click"
- "success chime", "notification", "positive beep"
- "error beep", "negative", "alert"
- "whoosh", "transition", "swipe"

**Effects:**
- "level up", "achievement", "fanfare"
- "victory", "win", "success celebration"
- "sword clash", "metal hit", "blade"
- "magic spell", "magical", "fantasy cast"
- "critical hit", "power up", "energy"
- "completion", "finish", "done"

**Ambient:**
- "ocean waves loop", "sea ambience"
- "forest birds", "nature ambience"
- "wind howl", "desert wind"
- "fire crackle loop", "campfire"
- "mystical drone", "fantasy ambience"

## 🛠️ Sound Specifications

### File Format:
- **Format:** MP3 (best browser support)
- **Sample Rate:** 44.1kHz or 48kHz
- **Bit Rate:** 
  - UI sounds: 64-96 kbps (mono)
  - Effects: 128 kbps (stereo)
  - Ambient: 96 kbps (mono or stereo)

### File Size Guidelines:
- UI sounds: < 10 KB each
- Effect sounds: < 50 KB each
- Ambient loops: < 500 KB each

### Length Guidelines:
- UI sounds: 50-300ms
- Effect sounds: 500ms-3s
- Ambient loops: 15-30s (seamless loop)

## 🔧 Converting/Optimizing Sounds

If you have WAV files or need to compress:

### Using ffmpeg (free tool):

```bash
# Install ffmpeg: https://ffmpeg.org/download.html

# Convert to MP3 (mono, lower bitrate for UI)
ffmpeg -i input.wav -ac 1 -b:a 64k output.mp3

# Convert to MP3 (stereo, standard quality for effects)
ffmpeg -i input.wav -b:a 128k output.mp3

# Convert ambient loop (mono, compressed)
ffmpeg -i input.wav -ac 1 -b:a 96k output.mp3

# Trim to specific length (e.g., 2 seconds)
ffmpeg -i input.mp3 -t 2 output.mp3

# Fade in/out (1s fade in, 0.5s fade out)
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=1,afade=t=out:st=1.5:d=0.5" output.mp3
```

### Online Tools (no installation):
- **Online-Convert.com** - Convert to MP3
- **Audio Trimmer** - Cut length
- **MP3 Smaller** - Compress file size

## 📝 License Notes

When downloading from Freesound or similar:

1. **Check license** - Most are CC0 (public domain) or CC-BY (attribution required)
2. **Save attribution** - Keep a list of sources in case needed
3. **Educational use** - This project is educational, which broadens fair use

### Example Attribution File:
```
sounds/ui/click.mp3
- Source: Freesound.org
- Author: username
- License: CC0 (Public Domain)
- Link: https://freesound.org/s/12345/

sounds/effects/victory.mp3
- Source: Zapsplat.com
- Author: Zapsplat
- License: Free with attribution
- Link: https://zapsplat.com/sound/victory-fanfare/
```

## 🎮 Implementation

Sounds are automatically preloaded by `soundManager.ts` when the app loads.

### Playing sounds in code:

```typescript
import { soundManager } from '@/lib/soundManager';

// Play a sound
soundManager.play('click', { volume: 0.3 });

// Play with options
soundManager.play('oceanAmbient', { volume: 0.2, loop: true });

// Stop a sound
soundManager.stop('oceanAmbient');
```

## ⚠️ Important Notes

1. **Browser Autoplay:** Sounds won't play until user interacts with page
2. **Mobile:** Keep volumes lower on mobile (limited speakers)
3. **Performance:** Don't play too many sounds simultaneously
4. **Accessibility:** Always provide mute option
5. **Educational Setting:** Default to subtle, non-distracting volumes

## 🚀 Getting Started

**Quick setup:**

1. Create accounts on Freesound.org and Zapsplat.com
2. Search for and download ~15 sounds (UI + effects)
3. Convert to MP3 if needed (using ffmpeg or online tools)
4. Compress if files are large
5. Place in appropriate folders
6. Test in app with sound settings panel

**Estimated time:** 1-2 hours to find and prepare all sounds

---

**Need help?** Check the main documentation or search "free game sound effects" for more resources.
