# Map Assets & Customization Strategy

## Current Implementation ✅
- **4 Marker Styles**: Pin (drop pin), Hexagon, Star, Circle
- **Undo/Redo System**: Full history tracking
- **Per-Location Customization**: Color, size (10-60px), icon, name editing
- **Path Customization**: Color, width (1-12px), solid/dashed styles

## PNG Asset Strategy

### Option 1: Stylized Marker Sets (Recommended)
Create themed marker packs students can switch between. Each pack = 20-30 markers.

**Fantasy Medieval Theme:**
- `castle-stone.png` - Stone fortress
- `castle-tower.png` - Wizard tower
- `village-small.png` - Small hamlet
- `village-large.png` - Large town
- `city-walled.png` - Walled city
- `temple-holy.png` - Sacred temple
- `temple-dark.png` - Dark shrine
- `cave-entrance.png` - Cave mouth
- `dungeon-entrance.png` - Dungeon door
- `forest-dense.png` - Dark forest
- `forest-enchanted.png` - Magic woods
- `mountain-peak.png` - Snow-capped peak
- `mountain-volcano.png` - Active volcano
- `lake-clear.png` - Crystal lake
- `ocean-port.png` - Harbor/port
- `ruins-ancient.png` - Ancient ruins
- `ruins-temple.png` - Temple ruins
- `throne-capital.png` - Capital city
- `battlefield.png` - War site
- `graveyard.png` - Cemetery/crypt

**Sci-Fi/Space Theme:**
- `space-station.png` - Orbital station
- `planet-city.png` - City planet
- `planet-desert.png` - Desert world
- `planet-ocean.png` - Water world
- `planet-ice.png` - Ice planet
- `asteroid-base.png` - Mining station
- `nebula-marker.png` - Nebula region
- `wormhole.png` - Jump gate
- `debris-field.png` - Wreckage
- `alien-ruins.png` - Xenoarchaeology site
- `trading-post.png` - Commerce hub
- `military-base.png` - Fleet base
- `research-facility.png` - Science station
- `colony-dome.png` - Settlement
- `pirate-hideout.png` - Outlaw base

**Modern/Contemporary Theme:**
- `city-metropolis.png` - Major city
- `town-suburban.png` - Suburb
- `airport.png` - Air travel hub
- `seaport.png` - Maritime port
- `landmark-statue.png` - Monument
- `landmark-building.png` - Famous structure
- `park-national.png` - Nature preserve
- `beach-resort.png` - Coastal area
- `mountain-resort.png` - Ski area
- `hospital.png` - Medical center
- `university.png` - Education hub
- `stadium.png` - Sports venue
- `mall.png` - Shopping center
- `factory.png` - Industrial zone
- `military-base.png` - Armed forces

**Mythological Theme:**
- `olympus.png` - Divine mountain
- `underworld-gate.png` - Realm of dead
- `oracle-temple.png` - Sacred oracle
- `labyrinth.png` - Maze
- `sacred-grove.png` - Holy forest
- `titan-prison.png` - Ancient prison
- `celestial-palace.png` - Heaven/sky realm
- `river-styx.png` - Magical river
- `portal-divine.png` - God gateway
- `battlefield-heroes.png` - Legendary battle
- `monster-lair.png` - Beast home
- `treasure-vault.png` - Hoard location
- `cursed-land.png` - Blighted area
- `blessed-spring.png` - Healing waters
- `prophecy-site.png` - Fate location

### Option 2: Background Map Templates
Pre-designed map backgrounds students can import:

**Terrain Maps (1200x800px base size):**
- `continent-fantasy.png` - Fantasy landmass with mountains/forests/rivers
- `continent-realistic.png` - Earth-like geography
- `island-chain.png` - Archipelago
- `underground-caverns.png` - Cave system
- `city-grid.png` - Urban street layout
- `region-kingdom.png` - Kingdom boundaries
- `ocean-navigation.png` - Sea with shipping lanes
- `sky-realm.png` - Floating islands
- `space-sector.png` - Star map grid
- `realm-elemental.png` - Abstract elemental planes

**Style Variations:**
- Parchment/aged paper texture
- Blueprint/technical drawing
- Satellite view style
- Hand-drawn sketchy
- Pixel art retro
- Watercolor artistic
- Dark mode/light mode versions

### Option 3: Decorative Elements
PNG overlays students can add anywhere:

**Terrain Decorations (200-400px):**
- `mountain-range.png` - Mountain cluster
- `forest-patch.png` - Tree cluster
- `river-section.png` - Water flow
- `road-path.png` - Trail overlay
- `border-kingdom.png` - Boundary line
- `compass-rose.png` - Navigation compass
- `scale-bar.png` - Distance indicator
- `legend-box.png` - Map key template
- `title-cartouche.png` - Decorative title frame
- `ship-fleet.png` - Naval units
- `army-markers.png` - Military units
- `monster-icons.png` - Creature indicators
- `weather-storm.png` - Storm overlay
- `fog-of-war.png` - Unknown region overlay

### Option 4: Custom Marker Builder
Instead of pre-made PNGs, create a marker composition system:

**Base Shapes (SVG):**
- Circle, Square, Hexagon, Star, Diamond, Shield, Pentagon
- Each in 5 size presets (small to huge)

**Icon Layers:**
- 100+ icon options (castles, mountains, people, symbols, etc.)
- Color picker for icon
- Optional glow/shadow effects

**Frame Options:**
- No frame, simple border, ornate frame, badge style
- Frame color picker
- Border width control

**Background Fill:**
- Solid color
- Gradient (2-color picker)
- Pattern (stripes, dots, checkers)
- Transparency control

**Effects:**
- Drop shadow
- Glow
- Pulse animation
- Rotation angle

## Implementation Plan

### Phase 1: Enhanced Vector Markers (NOW)
✅ **COMPLETE**
- Pin, Hex, Star, Circle shapes
- Full color customization
- Size control (10-60px)
- Undo/redo functionality

### Phase 2: PNG Marker System
**What to build:**
```typescript
interface MarkerAsset {
  id: string;
  name: string;
  theme: 'fantasy' | 'scifi' | 'modern' | 'mythological' | 'custom';
  imageUrl: string; // CDN link
  defaultSize: number;
  tags: string[];
}
```

**Required PNG specs:**
- Format: PNG with transparency
- Size: 512x512px base (scales down cleanly)
- Style: Clear, high contrast, works on any background
- Naming: `theme-category-name.png` (e.g., `fantasy-castle-tower.png`)

**Storage:**
- Upload to Supabase Storage bucket: `map-assets`
- Organize: `/markers/fantasy/`, `/markers/scifi/`, etc.
- Add to database table: `map_assets`

### Phase 3: Background Templates
**What to build:**
```typescript
interface MapBackground {
  id: string;
  name: string;
  theme: string;
  imageUrl: string;
  width: number;
  height: number;
  preview: string; // thumbnail
}
```

**Required specs:**
- Format: PNG or JPG
- Sizes: 1200x800, 1600x1200, 2400x1600 (3 presets)
- Style: Low-contrast so markers pop, but detailed enough to be useful
- Naming: `background-theme-size.png`

### Phase 4: Asset Browser UI
**New component: `AssetBrowser.tsx`**
- Tabbed interface: Markers | Backgrounds | Decorations
- Search/filter by theme and tags
- Preview on hover
- Click to select and place
- Favorites system
- Upload custom assets (teacher/student permissions)

### Phase 5: Advanced Features
- **Layering system**: Background → Terrain → Markers → Annotations
- **Import/Export**: Save maps as JSON + asset refs
- **Collaboration**: Real-time multi-user editing
- **Animation**: Animated markers (pulse, spin, glow)
- **Interactive tooltips**: Hover markers to see linked characters/creatures
- **Fog of war**: Teacher can hide/reveal regions
- **Measurement tools**: Distance calculator, area highlighter

## Canva Generation Specs

### For Each PNG Asset:
1. **Canvas size**: 512x512px (transparent background)
2. **Content area**: Keep important details within 400x400px center (leaves padding)
3. **Style consistency**: 
   - Flat design with subtle shadows works best
   - 2-3 colors max per icon for clarity
   - Bold outlines for visibility at small sizes
4. **Export settings**:
   - Format: PNG
   - Quality: High
   - Background: Transparent
   - DPI: 144 (2x for retina displays)

### Batch Creation Tips:
- Create one base template with guides showing safe area
- Duplicate and swap center graphic
- Use Canva's brand kit to maintain color consistency across theme
- Export all at once using Canva's bulk download

## Next Steps - What I Need from You:

1. **Choose primary theme(s)**: Which marker themes should we build first?
   - Fantasy Medieval (best for mythology project)
   - Mythological (gods/legends specific)
   - Multiple themes?

2. **Marker quantity**: How many markers per theme?
   - Basic set: 15-20 markers
   - Complete set: 30-40 markers
   - Full library: 50+ markers

3. **Style preference**: Visual style direction?
   - Flat/minimalist (clean, modern)
   - Hand-drawn (artistic, sketchy)
   - Realistic (detailed, photographic)
   - Pixel art (retro, gamey)

4. **Background priority**: Do we need background templates or focus on markers first?

5. **Student uploads**: Should students be able to upload their own PNGs?
   - Yes, with approval system
   - Yes, immediate use
   - No, curated library only

## Technical Notes

### Current Marker Rendering:
- Uses Konva shapes (vector, infinite zoom)
- Renders icons as text emojis (universal, no assets)
- Fast, no loading time

### PNG Marker Rendering:
- Will use Konva Image nodes
- Requires asset loading (add loading states)
- Supports any custom artwork
- Can cache loaded images for performance

### Hybrid Approach (Recommended):
- Keep vector shapes + emoji for fast prototyping
- Add PNG library for polished final maps
- Let students choose: "Quick Mode" (shapes) vs "Asset Mode" (PNGs)
- Default to shapes, upgrade to PNGs when desired

---

**What do you want to tackle first? I can:**
1. Build the PNG marker system now (you'll create assets in Canva)
2. Add background template support
3. Create the asset browser UI
4. Implement more vector marker styles (diamonds, shields, banners, etc.)
5. Add layering/advanced features

Or tell me your vision and I'll architect the solution.
