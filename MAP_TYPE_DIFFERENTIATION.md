# Map Type Differentiation System
## Research-Based Feature Design for Mythology Project

Based on research of Inkarnate (54K+ assets), Azgaar's Fantasy Map Generator (procedural/layered), 2-Minute Tabletop (scale-appropriate battle maps), Dungeondraft (smart tools), and Watabou generators (purpose-built tools), this document outlines how each map type should feel distinct.

---

## 🌍 WORLD MAP - Continental Scale
**Philosophy**: Low detail density, big picture geography, continental features
**Inspired by**: Azgaar's layered approach, Inkarnate's terrain assets

### Unique Features:
- **Canvas Size**: 2000x1500 - 2400x1800 (largest)
- **Grid System**: Hex overlay option (100-mile hexes)
- **Distance Measurement Tool**: Calculate distances between continents
- **Marker Library**: Terrain-focused
  - 🏔️ Mountain Ranges
  - 🌊 Oceans/Seas
  - 🌲 Forest Regions
  - 🏜️ Desert Regions
  - ❄️ Tundra/Ice Caps
  - 🌋 Volcanoes
  - 🏝️ Island Chains
- **Restricted Markers**: No individual buildings, no street-level detail
- **Path Types**: Trade routes, ocean currents, migration paths
  - Dashed lines for historical routes
  - Colored paths for different civilizations
- **Background Templates**: Aged parchment, weathered map paper, fantasy atlas
- **Labeling**: Territory names, ocean names, major landmasses
- **Validation**: Must have at least 3 markers (continents/major features)
- **Climate Zones**: Optional overlay showing climate regions

### Workflow Tools:
- **Region Tool**: Draw large irregular shapes for territories/biomes
- **Stamp Tool**: Large terrain brushes (mountain ranges, forests)
- **Elevation Indicator**: Color-code height levels
- **Legend Generator**: Auto-create map legend with symbols

---

## 🗺️ REGIONAL MAP - Kingdom/Province Scale
**Philosophy**: Medium detail, political boundaries, strategic locations
**Inspired by**: D&D regional maps, Inkarnate's regional style

### Unique Features:
- **Canvas Size**: 1600x1200 - 2000x1500 (medium-large)
- **Grid System**: Square overlay option (10-mile squares)
- **Marker Library**: Political/Strategic
  - 🏰 Castles/Fortresses
  - 🏘️ Towns
  - ⛺ Villages
  - 🗼 Watchtowers
  - ⚔️ Battlefields
  - 🛣️ Roads/Highways
  - 🌉 Bridges
  - ⛰️ Mountain Passes
  - 🌳 Named Forests
  - 💧 Rivers/Lakes
- **Path Types**: Roads, rivers, borders, travel routes
  - Different widths for major/minor roads
  - Political boundaries (dotted lines)
  - Military patrol routes
- **Background Templates**: Aged paper, regional survey style, military map
- **Labeling**: Kingdom names, region names, town names
- **Validation**: Must have at least 5 markers (settlements/strategic points)
- **Territory Shading**: Fill areas with kingdom colors (semi-transparent)

### Workflow Tools:
- **Border Tool**: Draw political boundaries with specific line styles
- **Route Planner**: Calculate travel time between settlements
- **Influence Zones**: Show control/influence areas for factions
- **Symbol Key**: Add numbered markers with legend reference

---

## 🏘️ CITY/SETTLEMENT MAP - Urban Scale
**Philosophy**: High detail, buildings, districts, points of interest
**Inspired by**: 2-Minute Tabletop city maps, Watabou's City Generator, D&D city maps

### Unique Features:
- **Canvas Size**: 800x600 - 1200x900 (smallest, most detailed)
- **Grid System**: Street grid overlay option (50-foot squares)
- **Marker Library**: Urban-focused
  - 🏛️ Government Buildings (Town Hall, Courts)
  - ⚒️ Craftsmen (Blacksmith, Carpenter, Tailor)
  - 🍺 Establishments (Taverns, Inns, Shops)
  - ⛪ Religious Sites (Temples, Shrines)
  - 🎭 Entertainment (Theater, Arena, Market)
  - 🏠 Residential (Houses, Apartments)
  - 💰 Commerce (Banks, Guildhalls)
  - 🚪 Gates/Entrances
  - 🌳 Parks/Gardens
  - 🔥 Landmarks (Statues, Fountains)
- **Restricted Features**: No continental features, no climate zones
- **Path Types**: Streets, alleys, canals, walls
  - Multiple street widths (main roads, alleys)
  - City walls with gates
  - Canals/waterways
- **Background Templates**: Cobblestone texture, city grid paper, urban parchment
- **Labeling**: District names, building names, street names
- **Validation**: Must have at least 10 markers (high detail requirement)
- **District Zones**: Color-code areas (noble quarter, slums, market, etc.)

### Workflow Tools:
- **Building Stamp**: Pre-made building shapes (rectangular, L-shaped, circular)
- **Street Snap**: Markers snap to streets for alignment
- **District Painter**: Fill areas with district colors
- **Shop Directory**: Generate list of all businesses for DM reference

---

## ✨ MYSTICAL REALM - Otherworldly Scale
**Philosophy**: Non-Euclidean, magical, surreal, unique
**Inspired by**: Feywild, Shadowfell, Astral Plane, dream logic

### Unique Features:
- **Canvas Size**: 1000x800 - 1600x1200 (variable, distorted)
- **Grid System**: NONE (or warped/impossible grid option)
- **Marker Library**: Magical/Ethereal
  - 🌀 Portals
  - 🔮 Nexus Points
  - 👁️ Floating Islands
  - 🌙 Celestial Bodies (multiple moons/suns)
  - 💫 Ley Lines
  - 🕳️ Voids/Rifts
  - 🏛️ Ethereal Structures
  - 🎭 Shifting Landmarks
  - 🌊 Elemental Manifestations
  - 🦋 Fey Groves
- **Unique Path Types**: Energy flows, teleportation routes, phase boundaries
  - Glowing/animated paths
  - Multi-dimensional connections
  - Temporal loops
- **Background Templates**: Starfield, void, dreamscape, prismatic, aurora
- **Effects**: Glow, shimmer, particle effects, distortion
- **Labeling**: Mystical names with special characters, metaphorical labels
- **Validation**: Must have at least 3 markers + at least 1 portal
- **Reality Layers**: Toggle between different dimensional views

### Workflow Tools:
- **Distortion Brush**: Warp areas of the map
- **Glow Effect**: Add magical glow to markers
- **Constellation Tool**: Connect markers with mystical lines
- **Phase Shifter**: Show/hide different reality layers
- **Non-Euclidean Mode**: Paths can loop, intersect impossibly

---

## 📋 OTHER - Flexible/Custom
**Philosophy**: All tools available, no restrictions, Swiss army knife
**Use Cases**: Dungeons, dungeons, underwater, aerial maps, abstract concepts

### Features:
- **Canvas Size**: 800x600 - 2400x1800 (any size)
- **Grid System**: All options available
- **Marker Library**: ALL markers from all types available
- **Path Types**: ALL path types available
- **Background Templates**: ALL templates available
- **No Restrictions**: Use any combination of tools
- **Validation**: Must have at least 1 marker (minimal requirement)
- **Special Tools**: All unique tools from other types accessible

### Ideal For:
- Dungeons (underground chambers)
- Sky castles (floating architecture)
- Underwater cities (oceanic maps)
- Abstract concept maps (memory palace, dream realm)
- Transitional spaces (between world and city scale)
- Experimental/unique maps

---

## 🔧 IMPLEMENTATION PRIORITY

### Phase 1: Core Differentiation (MVP)
1. **Canvas size restrictions** by type
2. **Marker library filtering** - show type-appropriate markers only
3. **Background template categories** per type
4. **Validation rules** per type
5. **Type-specific instructions** panel

### Phase 2: Enhanced Tools
1. **Grid overlay options** (hex for world, square for regional/city)
2. **Distance measurement tool** (world maps only)
3. **Territory/district painting** (regional/city)
4. **Special effects** (mystical realms)
5. **Street snap feature** (city maps)

### Phase 3: Asset Library
1. **Create/source 200+ PNG markers** categorized by type
2. **Background templates** - 4-5 per map type (20-25 total)
3. **Path style presets** per type
4. **Texture overlays** (cobblestone, parchment, ethereal)

### Phase 4: Advanced Features
1. **Smart object placement** (buildings align to streets)
2. **Procedural generation helpers** (random town layout)
3. **Legend/key generator** (auto-create from markers)
4. **Travel time calculator** (regional maps)
5. **Export with/without labels** option

---

## 🎨 DESIGN PRINCIPLES

### Scale-Appropriate Detail
- **World**: Continents → Regions → Major Cities (abstracted)
- **Regional**: Regions → Cities → Towns → Villages (mid-detail)
- **City**: Districts → Buildings → POIs (high-detail)
- **Mystical**: Non-linear, conceptual (rule-breaking)
- **Other**: Anything goes (flexible)

### Tool Availability Philosophy
- **Don't just hide tools** - explain WHY they're not available
- **Example**: City map shows greyed-out "Mountain Range" marker with tooltip: "Mountain ranges are too large for city-scale maps. Use Regional Map for terrain features."
- **Educational UX**: Help users understand mapping scale conventions

### Asset Strategy
- **Shared base layer**: All maps share core canvas/path engine
- **Type-specific overlays**: Each type gets unique marker libraries
- **Hybrid approach**: Some markers work across multiple types (e.g., castles on world/regional)
- **Progressive disclosure**: Advanced tools unlock as users explore

---

## 📊 FEATURE COMPARISON MATRIX

| Feature | World | Regional | City | Mystical | Other |
|---------|-------|----------|------|----------|-------|
| Max Size | 2400x1800 | 2000x1500 | 1200x900 | 1600x1200 | Any |
| Grid | Hex | Square | Square | None/Warped | Any |
| Marker Count | 20-30 | 30-50 | 100+ | 10-20 | Any |
| Detail Level | Low | Medium | High | Surreal | Variable |
| Path Width | Thick | Medium | Thin | Varies | Any |
| Effects | None | Basic | None | Advanced | Any |
| Time Investment | 30-45 min | 45-60 min | 60-90 min | 45-60 min | Variable |

---

## 🎯 VALIDATION & UX

### Smart Validation Messages
- **World Map**: "Consider adding at least 3 major continents or landmasses for a complete world map"
- **Regional Map**: "Regional maps typically include 5-10 settlements. Add more towns or strategic locations?"
- **City Map**: "City maps shine with detail! Consider adding at least 10 points of interest for players to explore"
- **Mystical Realm**: "Mystical realms require at least one portal or dimensional gateway"

### Type Selection Helper
- **Quiz flow**: "What are you mapping?" → Scale selection → Type recommendation
- **Examples**: Show sample images for each type
- **Use case descriptions**: "Choose World Map for continent-spanning adventures..."

### In-Editor Hints
- **Contextual tooltips**: Explain why certain tools are/aren't available
- **Best practices**: "💡 Tip: World maps work best with 5-10 major markers rather than hundreds of small ones"
- **Scale warnings**: "⚠️ This marker may be too small to see clearly on a world map. Consider using Regional Map instead."

---

## 🚀 NEXT STEPS

1. **Design Marker Icons** (Priority: HIGH)
   - Sketch/generate 50 markers per type (200 total)
   - Ensure consistent style across types
   - Test visibility at different zoom levels

2. **Update MapCanvas Component** (Priority: HIGH)
   - Add `mapType` prop
   - Implement marker filtering logic
   - Add canvas size constraints
   - Type-specific validation

3. **Create Type Selection UI** (Priority: MEDIUM)
   - Redesign map creation form
   - Add preview images for each type
   - Implement helper quiz/flow
   - Educational tooltips

4. **Background Templates** (Priority: MEDIUM)
   - Source or create 4-5 templates per type
   - Test performance with large images
   - Implement template picker UI

5. **Apply Migration** (Priority: LOW)
   - After features are designed/tested
   - Apply 004_maps.sql migration
   - Test with real data

6. **Phase 2-4 Features** (Priority: LOW)
   - Implement after core differentiation validated
   - User testing to prioritize
   - Iterative rollout

---

## 💭 OPEN QUESTIONS

1. **Should "Other" type be the default**, or should we force users to choose?
   - Recommendation: Default to "Other", but show type selector prominently

2. **How do we handle type changes?** If user starts with City but wants Regional?
   - Recommendation: Allow type change, show warning about incompatible markers

3. **Should markers be exclusive or overlapping?** E.g., can castles appear on world maps?
   - Recommendation: Some markers (castles, cities) available on multiple types at different detail levels

4. **Procedural generation?** Should we offer "Generate Random City Layout" helpers?
   - Recommendation: Phase 4 feature, start with manual creation

5. **Asset creation strategy?** Generate with AI, commission artists, or Creative Commons?
   - Recommendation: Hybrid approach
     - Core markers: Custom/commissioned (consistent style)
     - Background templates: CC0 or generated
     - Special effects: CSS/Canvas API (no assets needed)

---

## 📚 RESEARCH SOURCES CITED

- **Inkarnate.com**: 54K+ assets, 8K exports, scale-appropriate libraries
- **Azgaar's Fantasy Map Generator**: Procedural layered approach, automatic detail levels
- **2-Minute Tabletop**: Battle maps with scale-specific asset collections
- **Dungeondraft**: Smart tiling, object scattering, workflow-optimized tools
- **Watabou Generators**: Purpose-built tools (City, Neighbourhood, Cave, Dungeon)
- **D&D Map-Making Best Practices**: Scale conventions, symbol standards, DM workflows
