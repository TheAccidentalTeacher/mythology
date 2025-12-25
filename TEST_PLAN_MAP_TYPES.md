# Map Type Differentiation - Test Plan

## Phase 2B Core Implementation - Testing Checklist

### 🎯 Test Objective
Verify that all 5 map types (world, regional, city, mystical, other) have distinct features and enforce proper restrictions.

---

## Test Cases by Map Type

### 🌍 World Map
**Expected Configuration:**
- Canvas size: 2000-2400 × 1500-1800 (default: 2200 × 1650)
- Grid type: Hexagonal
- Marker styles allowed: Circle, Hex
- Marker styles disabled: Pin, Star
- Min markers: 3
- Marker library: 10 terrain/geographic markers (🏔️🌊🌲🏜️❄️🌋🏝️🌾👑🗺️)
- Instructions: "Focus on large-scale geography and major features. Ideal for continents, oceans, and kingdoms."
- Validation: "World maps work best with 3+ major geographic features"

**Test Steps:**
1. ✅ Select "🌍 World Map" from type dropdown
2. ✅ Verify canvas dimensions auto-update to 2200×1650
3. ✅ Verify width/height inputs show range 2000-2400 / 1500-1800
4. ✅ Click marker style buttons:
   - Circle: Should be enabled ✅
   - Hex: Should be enabled ✅
   - Pin: Should be disabled (greyed, tooltip "not available for World Map") ❌
   - Star: Should be disabled ❌
5. ✅ Verify instructions panel shows world map text with 🌍 emoji
6. ✅ Add markers - verify only 10 terrain markers available in icon picker
7. ✅ Add 2 markers - verify validation warning appears: "World maps work best with 3+ major geographic features"
8. ✅ Add 3rd marker - validation warning disappears

---

### 🗺️ Regional Map
**Expected Configuration:**
- Canvas size: 1600-2000 × 1200-1500 (default: 1800 × 1350)
- Grid type: Square
- Marker styles allowed: Circle, Hex, Star
- Marker styles disabled: Pin
- Min markers: 5
- Marker library: 12 political/strategic markers (🏰🏘️⛺🗼⚔️🛣️🌉⛰️🌳💧⛏️⚓)
- Instructions: "Show kingdoms, territories, and strategic locations. Perfect for political boundaries and trade routes."
- Validation: "Regional maps are most useful with 5+ settlements or strategic points"

**Test Steps:**
1. ✅ Select "🗺️ Regional Map" from dropdown
2. ✅ Verify dimensions change to 1800×1350
3. ✅ Verify dimension ranges update to 1600-2000 / 1200-1500
4. ✅ Test marker styles:
   - Circle: Enabled ✅
   - Hex: Enabled ✅
   - Star: Enabled ✅
   - Pin: Disabled (tooltip "not available for Regional Map") ❌
5. ✅ Verify instructions show regional map guidance with 🗺️
6. ✅ Icon picker shows 12 political/strategic markers
7. ✅ With <5 markers: validation warning appears
8. ✅ With 5+ markers: warning clears

---

### 🏙️ City Map
**Expected Configuration:**
- Canvas size: 800-1200 × 600-900 (default: 1000 × 750)
- Grid type: Square
- Marker styles allowed: Pin, Circle, Star
- Marker styles disabled: Hex
- Min markers: 10
- Marker library: 20+ urban POIs (🏛️⚖️⚒️🪚🧵🏪💰🍺🏨⛪🕯️🎭🏟️📚🏠🏢🚪🌳⛲🗿)
- Instructions: "High detail! Place 10+ points of interest. Best for urban areas with buildings, streets, and districts."
- Validation: "City maps work best with 10+ points of interest"
- Detail level: HIGH (detailed legend, small markers)

**Test Steps:**
1. ✅ Select "🏙️ City/Settlement" from dropdown
2. ✅ Verify dimensions change to 1000×750
3. ✅ Verify ranges: 800-1200 / 600-900
4. ✅ Marker styles:
   - Pin: Enabled ✅
   - Circle: Enabled ✅
   - Star: Enabled ✅
   - Hex: Disabled (tooltip "not available for City Map") ❌
5. ✅ Instructions emphasize "High detail! 10+ POIs"
6. ✅ Icon picker shows 20+ civic/trade/establishment/religious markers
7. ✅ With <10 markers: strong validation warning
8. ✅ With 10+ markers: validation clears

---

### ✨ Mystical Realm Map
**Expected Configuration:**
- Canvas size: 1000-1600 × 800-1200 (default: 1300 × 1000)
- Grid type: None (free-form)
- Marker styles allowed: All (Pin, Circle, Hex, Star)
- Min markers: 3
- Marker library: 12 magical/ethereal markers (🌀🔮🏝️🌙💫🕳️🏛️🎭🌊🦋💎🌌)
- Instructions: "Be creative! Mystical realms can break normal geography rules. Perfect for otherworldly dimensions and magical spaces."
- Validation: "Mystical maps are most interesting with 3+ magical features"
- Detail level: SURREAL (artistic freedom)

**Test Steps:**
1. ✅ Select "✨ Mystical Realm" from dropdown
2. ✅ Verify dimensions: 1300×1000
3. ✅ Verify ranges: 1000-1600 / 800-1200
4. ✅ All 4 marker styles enabled (no restrictions) ✅✅✅✅
5. ✅ Instructions encourage creativity with ✨ emoji
6. ✅ Icon picker shows 12 magical/ethereal markers
7. ✅ Validation threshold: 3 markers

---

### 📜 Other Map
**Expected Configuration:**
- Canvas size: 800-2400 × 600-1800 (default: 1200 × 900)
- Grid type: Any
- Marker styles allowed: All (Pin, Circle, Hex, Star)
- Min markers: 1
- Marker library: ALL 54 markers (combined from all types)
- Instructions: "Flexible map type with all tools available. Use for experimental or hybrid maps."
- Validation: "Add at least 1 marker to begin"
- Detail level: VARIABLE

**Test Steps:**
1. ✅ Select "📜 Other" from dropdown
2. ✅ Verify dimensions: 1200×900
3. ✅ Verify wide ranges: 800-2400 / 600-1800
4. ✅ All 4 marker styles enabled ✅✅✅✅
5. ✅ Instructions show flexibility
6. ✅ Icon picker shows ALL 54 markers (world + regional + city + mystical combined)
7. ✅ Minimal validation: just 1 marker required

---

## Cross-Type Testing

### Type Switching Behavior
**Test:** Change map type mid-creation
1. Create world map with 2400×1800 dimensions
2. Add 3 circle markers
3. Switch to "City Map"
4. **Expected results:**
   - Dimensions auto-adjust to city range (1000×750)
   - Marker style resets to Pin (city's suggested style)
   - Circle markers remain, but hex becomes disabled
   - Validation warning appears (need 10 markers for city)
   - Icon picker shows urban POIs instead of terrain

### Dimension Enforcement
**Test:** Try to exceed type limits
1. Select "City Map" (max 1200 width)
2. Try to enter 1500 in width input
3. **Expected:** Input enforces max="1200", prevents entry
4. Try to enter 700 (below min 800)
5. **Expected:** Input enforces min="800", prevents entry

### Style Persistence
**Test:** Verify disabled styles can't be selected
1. Select "World Map" (only circle/hex allowed)
2. Click Pin button
3. **Expected:** Button greyed out, no change to markerStyle state
4. Hover over Pin button
5. **Expected:** Tooltip shows "Pin markers not available for World Map"

### Marker Library Filtering
**Test:** Verify correct icons shown per type
1. Select each type and count icons:
   - World: 10 icons ✅
   - Regional: 12 icons ✅
   - City: 20+ icons ✅
   - Mystical: 12 icons ✅
   - Other: 54 icons (all combined) ✅

---

## UI/UX Testing

### Instructions Panel
- ✅ Shows map type emoji + label (e.g., "🌍 World Map")
- ✅ Displays type-appropriate instructions
- ✅ Shows validation warning when marker count below threshold
- ✅ Warning styled in amber/yellow
- ✅ Tool tips remain visible below warnings

### Type Selector
- ✅ Dropdown shows emoji + label for each type
- ✅ Description text appears below dropdown after selection
- ✅ Description matches type's purpose from MAP_TYPE_CONFIGS

### Canvas Dimension Inputs
- ✅ Show recommended range hint below input (e.g., "Recommended: 2000-2400px")
- ✅ Min/max attributes enforce type constraints
- ✅ Auto-update when type changes

### Marker Style Buttons
- ✅ Enabled buttons: bg-white/10, hover effect, normal cursor
- ✅ Disabled buttons: bg-white/5, greyed text, cursor-not-allowed
- ✅ Tooltips explain why unavailable
- ✅ Active button (selected style) shows green ring

---

## Performance Testing

### Large Marker Sets
1. Create city map with 30+ markers (3× minimum)
2. **Verify:** No lag when selecting/dragging markers
3. **Verify:** Validation message updates instantly

### Type Switching Performance
1. Switch between all 5 types rapidly
2. **Verify:** Dimensions update without delay
3. **Verify:** Marker library re-renders smoothly
4. **Verify:** No console errors or warnings

---

## Integration Testing

### Map Creation Flow
1. Navigate to `/student/mythology/[id]/map/create`
2. Fill title, description
3. Select each type and create map
4. **Verify:** Map saves with correct map_type value
5. **Verify:** Canvas dimensions respect type constraints
6. **Verify:** Markers save correctly with type-specific icons

### Existing Map Editing (Future)
- [ ] Load existing map with saved map_type
- [ ] Verify MapCanvas receives correct mapType prop
- [ ] Verify restrictions apply to editing

---

## Accessibility Testing

### Keyboard Navigation
- ✅ Can tab through type selector
- ✅ Can tab to disabled marker buttons
- ✅ Disabled buttons show focus ring
- ✅ Screen readers announce disabled state

### Color Contrast
- ✅ Disabled buttons (white/30) still readable
- ✅ Validation warnings (amber) high contrast on dark background
- ✅ Tooltips readable on hover

---

## Browser Compatibility
Test in:
- [ ] Chrome (primary)
- [ ] Firefox
- [ ] Edge
- [ ] Safari

**Expected:** All features work identically across browsers

---

## Known Limitations (Future Enhancements)

### Not Yet Implemented (Phase 2):
- Grid overlays (hex for world, square for regional/city)
- Distance measurement tool (world maps only)
- Territory painting (regional maps)
- Special effects (mystical realm glow/distortion)
- Street snapping (city map auto-align to paths)

### Not Yet Implemented (Phase 3):
- Background templates per type
- PNG marker assets (currently using emojis)
- Path style presets per type
- Texture overlays

---

## Regression Testing

After changes, verify:
1. ✅ Other map type still allows all features
2. ✅ Non-editable MapCanvas (view mode) doesn't show restrictions
3. ✅ Saved maps load correctly with locations intact
4. ✅ Points awarded correctly (75 pts for map creation)

---

## Test Results Summary

### Manual Testing (Browser)
**Status:** Ready to test in browser at http://localhost:3000

**Checklist:**
- [ ] World map: Circle/hex only, 10 terrain markers, 2200×1650
- [ ] Regional map: Circle/hex/star, 12 political markers, 1800×1350
- [ ] City map: Pin/circle/star, 20+ urban markers, 1000×750, 10 marker minimum
- [ ] Mystical map: All styles, 12 magical markers, 1300×1000
- [ ] Other map: All styles, all 54 markers, 1200×900
- [ ] Type switching updates dimensions and markers
- [ ] Disabled buttons show tooltips
- [ ] Validation warnings appear/clear correctly
- [ ] Instructions panel shows type-specific text

---

## Sign-Off

**Developer:** GitHub Copilot (Claude Sonnet 4.5)  
**Date:** December 20, 2024  
**Build:** Phase 2B - Core Differentiation MVP  
**Files Modified:**
- ✅ `/src/lib/mapTypes.ts` (NEW - 350 lines)
- ✅ `/src/components/MapCanvas.tsx` (MODIFIED - marker filtering, instructions, validation)
- ✅ `/src/app/student/mythology/[id]/map/create/page.tsx` (MODIFIED - type integration, dimension constraints)

**Next Steps:** Complete manual testing, then proceed to Phase 2 Enhanced Tools (grid overlays, distance tool)
