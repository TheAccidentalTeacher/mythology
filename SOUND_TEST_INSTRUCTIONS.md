# 🎵 Sound System Test Instructions

## ✅ Status: Sounds Installed!

All 14 sound files have been moved to the correct locations and renamed properly.

### 📁 Installed Sounds

**UI Sounds (4/4):**
- ✅ `/public/sounds/ui/click.mp3`
- ✅ `/public/sounds/ui/success.mp3`
- ✅ `/public/sounds/ui/error.mp3`
- ✅ `/public/sounds/ui/whoosh.mp3`

**Effect Sounds (10/11):**
- ✅ `/public/sounds/effects/level-up.mp3`
- ✅ `/public/sounds/effects/badge-unlock.mp3`
- ✅ `/public/sounds/effects/xp-gain.mp3`
- ✅ `/public/sounds/effects/defeat.mp3`
- ✅ `/public/sounds/effects/sword-clash.mp3`
- ✅ `/public/sounds/effects/critical.mp3`
- ✅ `/public/sounds/effects/magic-cast.mp3`
- ✅ `/public/sounds/effects/image-complete.mp3`
- ✅ `/public/sounds/effects/step-complete.mp3`
- ✅ `/public/sounds/effects/wizard-complete.mp3`
- ❌ **MISSING:** `victory.mp3` (search: "victory fanfare" on Freesound)

**Ambient (1 file, needs conversion):**
- ⚠️ `/public/sounds/ambient/mystical-ambient.wav` (need to convert to MP3)

---

## 🧪 How to Test

### 1. Test in Mythology Wizard

The wizard already has sounds integrated!

1. Start dev server: `npm run dev`
2. Log in as a student
3. Click "Create New Mythology"
4. Go through the wizard steps
5. **Listen for:**
   - ✨ "Step complete" sound when clicking "Next"
   - 🎉 "Wizard complete" celebration at the end

### 2. Test in Browser Console

Open browser console (F12) and type:

```javascript
// Import soundManager (it's global)
import { soundManager } from '@/lib/soundManager';

// Test each sound
soundManager.play('click');           // UI click
soundManager.play('success');         // Success chime
soundManager.play('error');           // Error beep
soundManager.play('whoosh');          // Transition

soundManager.play('levelUp');         // Level up fanfare
soundManager.play('badgeUnlock');     // Badge earned
soundManager.play('xpGain');          // XP gained

soundManager.play('defeat');          // Battle lost
soundManager.play('swordClash');      // Sword hit
soundManager.play('critical');        // Critical strike
soundManager.play('magicCast');       // Magic spell

soundManager.play('imageComplete');   // Image generated
soundManager.play('stepComplete');    // Step done
soundManager.play('wizardComplete');  // Wizard finished

// Test mute
soundManager.toggleMute();
soundManager.play('success');  // Should be silent

soundManager.toggleMute();
soundManager.play('success');  // Should play
```

### 3. Quick Browser Test (Easiest)

1. Open: http://localhost:3000
2. Open browser console (F12)
3. Paste this one-liner:

```javascript
// Test all sounds in sequence
['click', 'success', 'error', 'whoosh', 'levelUp', 'badgeUnlock', 'xpGain', 'defeat', 'swordClash', 'critical', 'magicCast', 'imageComplete', 'stepComplete', 'wizardComplete'].forEach((sound, i) => setTimeout(() => { console.log('Playing:', sound); window.soundManager?.play?.(sound) || eval(`import('@/lib/soundManager').then(m => m.soundManager.play('${sound}'))`); }, i * 1500));
```

This plays each sound with 1.5 second gaps.

---

## 🎨 Add Sound Settings to Your App

Add the sound toggle to your header/navbar:

```typescript
// In your header component
import { SoundToggle } from '@/components/SoundSettings';

<header>
  {/* Your other header items */}
  <SoundToggle />
</header>
```

Or add full settings panel to user dropdown/settings:

```typescript
import { SoundSettings } from '@/components/SoundSettings';

<SoundSettings />
```

---

## 🔊 Volume Recommendations

After testing, you may want to adjust default volumes. Edit `soundManager.ts`:

```typescript
// Example adjustments based on your preference
soundManager.play('click', { volume: 0.2 });        // Very subtle
soundManager.play('success', { volume: 0.4 });      // Moderate
soundManager.play('wizardComplete', { volume: 0.7 }); // Celebratory
```

**Current defaults:**
- UI sounds: 0.3-0.4 (subtle)
- Effects: 0.4-0.6 (moderate)
- Celebrations: 0.6-0.7 (louder)

---

## ⚠️ Known Issues

### 1. Missing "victory.mp3"
**Status:** Not downloaded yet  
**Impact:** Battle system won't have victory sound  
**Fix:** Download from Freesound ("victory fanfare") → save as `victory.mp3` → place in `/public/sounds/effects/`  
**Then uncomment in soundManager.ts:**
```typescript
soundManager.preload('victory', '/sounds/effects/victory.mp3');
```

### 2. Ambient WAV file needs conversion
**Status:** File is WAV, should be MP3  
**Impact:** Larger file size, may not play in some browsers  
**Fix (if you have ffmpeg):**
```bash
cd app/public/sounds/ambient
ffmpeg -i mystical-ambient.wav -b:a 96k mystical.mp3
```

Or use online converter: https://online-audio-converter.com/

---

## 🎯 Next Integration Steps

### Battle System
Add to battle page (`app/src/app/student/mythology/[id]/battle/page.tsx`):

```typescript
import { soundManager } from '@/lib/soundManager';

// When attack happens
soundManager.play('swordClash', { volume: 0.3 });

// When critical hit
soundManager.play('critical', { volume: 0.5 });

// When battle ends (winner)
// soundManager.play('victory', { volume: 0.6 });  // Need to download first

// When battle ends (loser)
soundManager.play('defeat', { volume: 0.4 });
```

### Math Quiz
Add to quiz modal (`app/src/components/MathQuizModal.tsx`):

```typescript
import { soundManager } from '@/lib/soundManager';

// When answer is correct
const handleCorrectAnswer = () => {
  soundManager.play('success', { volume: 0.4 });
  confetti(); // Your existing confetti
  // ... rest of logic
};

// When answer is incorrect
const handleIncorrectAnswer = () => {
  soundManager.play('error', { volume: 0.3 });
  // ... rest of logic
};
```

### Image Generation
Add to image generation panel:

```typescript
import { soundManager } from '@/lib/soundManager';

// When image generation completes
const handleImageComplete = () => {
  soundManager.play('imageComplete', { volume: 0.5 });
  // ... rest of logic
};
```

### Level Up
Add to profile/XP component:

```typescript
import { soundManager } from '@/lib/soundManager';

// When level increases
useEffect(() => {
  if (levelChanged && newLevel > oldLevel) {
    soundManager.play('levelUp', { volume: 0.6 });
  }
}, [level]);

// When badge unlocked
const handleBadgeUnlock = () => {
  soundManager.play('badgeUnlock', { volume: 0.6 });
  // ... show badge animation
};

// When XP gained (optional, might be too frequent)
const handleXPGain = () => {
  soundManager.play('xpGain', { volume: 0.3 });
};
```

---

## 📊 Testing Checklist

- [ ] Wizard sounds work (step complete, wizard complete)
- [ ] All 14 sounds play in browser console
- [ ] Mute toggle works
- [ ] Volume slider adjusts sound levels
- [ ] Mute preference persists after refresh
- [ ] Volume preference persists after refresh
- [ ] Sounds don't autoplay before user clicks anything
- [ ] Sound settings panel opens/closes
- [ ] No console errors about missing files

---

## 🚀 You're Ready!

**Status:** ✅ Sound system is functional  
**Next:** Test the wizard, adjust volumes, integrate into other features

The wizard already has sounds integrated, so just run `npm run dev` and create a mythology to hear them in action!

For more details, see `SOUND_SYSTEM.md`.
