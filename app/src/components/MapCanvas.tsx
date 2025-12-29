'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import { Stage, Layer, Circle, Text, Line } from 'react-konva';
import type Konva from 'konva';
import {
  MapType,
  getMarkersForType,
  getInstructionsForType,
  getValidationMessageForType,
  getSuggestedMarkerStyle,
  isMarkerStyleAllowed,
  MAP_TYPE_CONFIGS,
} from '@/lib/mapTypes';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  color: string;
  size: number;
  linkedCharacterId?: string;
  linkedCreatureId?: string;
}

interface Path {
  id: string;
  points: number[];
  color: string;
  width: number;
  dashed: boolean;
}

interface Region {
  id: string;
  name: string;
  points: number[];
  fill: string;
  stroke: string;
  opacity: number;
}

interface MapCanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  locations: Location[];
  onLocationsChange: (locations: Location[]) => void;
  editable?: boolean;
  mapType?: MapType;
}

export default function MapCanvas({
  width = 1200,
  height = 800,
  backgroundColor = '#1a1a2e',
  locations,
  onLocationsChange,
  editable = true,
  mapType = 'other',
}: MapCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'location' | 'path' | 'region'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  
  // Grid and snap settings
  const [showGrid, setShowGrid] = useState(true); // Enable by default
  const [gridType, setGridType] = useState<'square' | 'hex'>('square');
  const [gridSize, setGridSize] = useState(50);
  const [snapToGrid, setSnapToGrid] = useState(true); // Enable by default
  
  // Background texture
  const [backgroundTexture, setBackgroundTexture] = useState<'none' | 'parchment' | 'clean' | 'satellite'>('none');
  
  // Get type-specific configuration
  const mapConfig = MAP_TYPE_CONFIGS[mapType];
  const availableMarkers = getMarkersForType(mapType);
  const instructions = getInstructionsForType(mapType);
  const validationMessage = getValidationMessageForType(mapType, locations.length);
  const suggestedStyle = getSuggestedMarkerStyle(mapType);
  const suggestedPathWidth = mapConfig.suggestedPathWidth;
  
  // Debug logging
  console.log('🗺️ MapCanvas Render:', {
    mapType,
    markerCount: availableMarkers.length,
    markers: availableMarkers.map(m => m.emoji),
    allowedStyles: mapConfig.allowedMarkerStyles,
    instructions: instructions.substring(0, 50) + '...'
  });
  
  // Drawing settings - initialize with type-appropriate defaults
  const [locationColor, setLocationColor] = useState('#10b981');
  const [locationSize, setLocationSize] = useState(20);
  const [pathColor, setPathColor] = useState('#a855f7');
  const [pathWidth, setPathWidth] = useState(suggestedPathWidth);
  const [pathDashed, setPathDashed] = useState(false);
  const [markerStyle, setMarkerStyle] = useState<'circle' | 'pin' | 'hex' | 'star'>(suggestedStyle);
  const [selectedIcon, setSelectedIcon] = useState<string>(availableMarkers[0]?.emoji || '📍'); // Pre-select first type-specific icon
  
  // Edit panel position and dragging
  const [panelPosition, setPanelPosition] = useState<{x: number, y: number} | null>(null);
  const [isDraggingPanel, setIsDraggingPanel] = useState(false);
  const [dragOffset, setDragOffset] = useState({x: 0, y: 0});
  
  // Undo history
  const [history, setHistory] = useState<{locations: Location[], paths: Path[], regions?: Region[]}[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Update marker style when map type changes
  // This sync update is intentional - we need consistent UI state when map type changes
  // Using queueMicrotask to schedule state updates after render
  useLayoutEffect(() => {
    queueMicrotask(() => {
      const suggested = getSuggestedMarkerStyle(mapType);
      if (isMarkerStyleAllowed(mapType, suggested)) {
        setMarkerStyle(suggested);
      }
      setPathWidth(MAP_TYPE_CONFIGS[mapType].suggestedPathWidth);
      // Update selected icon to first icon of new type
      const markers = getMarkersForType(mapType);
      if (markers.length > 0) {
        setSelectedIcon(markers[0].emoji);
      }
    });
  }, [mapType]);

  // Snap position to grid
  const snapPosition = (x: number, y: number) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };
  
  // Save state to history
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ locations: [...locations], paths: [...paths], regions: [...regions] });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      onLocationsChange(prevState.locations);
      setPaths(prevState.paths);
      setRegions(prevState.regions || []);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      onLocationsChange(nextState.locations);
      setPaths(nextState.paths);
      setRegions(nextState.regions || []);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!editable) return;
    
    // Check if user clicked on an existing marker - if so, don't place new one
    const clickedOnEmpty = e.target === e.target.getStage();
    
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    const snapped = snapPosition(pos.x, pos.y);

    if (tool === 'location' && clickedOnEmpty) {
      // Only place new marker if clicking on empty canvas
      const newLocation: Location = {
        id: `loc_${Date.now()}`,
        name: 'New Location',
        x: snapped.x,
        y: snapped.y,
        icon: selectedIcon, // Use pre-selected type-specific icon
        color: locationColor,
        size: locationSize,
      };
      saveToHistory();
      onLocationsChange([...locations, newLocation]);
    } else if (tool === 'path') {
      setIsDrawing(true);
      setCurrentPath([snapped.x, snapped.y]);
    } else if (tool === 'region') {
      setIsDrawing(true);
      setCurrentPath([snapped.x, snapped.y]);
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!editable || !isDrawing || (tool !== 'path' && tool !== 'region')) return;

    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (!pos) return;
    const snapped = snapPosition(pos.x, pos.y);
    setCurrentPath([...currentPath, snapped.x, snapped.y]);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentPath.length > 2) {
      if (tool === 'path') {
        const newPath: Path = {
          id: `path_${Date.now()}`,
          points: currentPath,
          color: pathColor,
          width: pathWidth,
          dashed: pathDashed,
        };
        saveToHistory();
        setPaths([...paths, newPath]);
      } else if (tool === 'region') {
        const newRegion: Region = {
          id: `region_${Date.now()}`,
          name: 'New Region',
          points: currentPath,
          fill: locationColor,
          stroke: '#ffffff',
          opacity: 0.3,
        };
        saveToHistory();
        setRegions([...regions, newRegion]);
      }
      setIsDrawing(false);
      setCurrentPath([]);
    }
  };

  const handleLocationClick = (id: string) => {
    console.log('🎯 handleLocationClick called:', { id, currentSelectedId: selectedId, editable });
    const newSelectedId = id === selectedId ? null : id;
    setSelectedId(newSelectedId);
    console.log('✅ setSelectedId called with:', newSelectedId);
    
    // Position panel near the clicked marker
    if (newSelectedId) {
      const location = locations.find(loc => loc.id === newSelectedId);
      if (location) {
        setPanelPosition({ x: location.x + 40, y: location.y - 20 });
      }
    }
  };

  const deleteSelectedLocation = () => {
    if (!selectedId || !editable) return;
    saveToHistory();
    onLocationsChange(locations.filter(loc => loc.id !== selectedId));
    setSelectedId(null);
  };

  const deletePath = (pathId: string) => {
    saveToHistory();
    setPaths(paths.filter(p => p.id !== pathId));
  };

  const updateLocationName = (id: string, name: string) => {
    if (!editable) return;
    saveToHistory();
    onLocationsChange(
      locations.map(loc => (loc.id === id ? { ...loc, name } : loc))
    );
  };

  const updateLocationIcon = (id: string, icon: string) => {
    if (!editable) return;
    saveToHistory();
    onLocationsChange(
      locations.map(loc => (loc.id === id ? { ...loc, icon } : loc))
    );
  };

  // Render marker based on style
  const renderMarker = (location: Location, isSelected: boolean) => {
    const { x, y, size, color, icon } = location;
    
    console.log('🎯 Rendering marker:', { 
      id: location.id, 
      icon, 
      iconType: typeof icon,
      iconLength: icon?.length,
      iconCharCode: icon?.charCodeAt(0),
      markerStyle 
    });
    
    // For type-specific emojis (not default 📍), render as large icon without background shape
    const isEmojiMarker = icon && icon !== '📍' && availableMarkers.some(m => m.emoji === icon);
    
    if (isEmojiMarker) {
      return (
        <Text
          x={x}
          y={y}
          text={icon}
          fontSize={size * 2}
          offsetX={size}
          offsetY={size}
          draggable={editable}
          onDragEnd={(e) => {
            if (!editable) return;
            const newPos = snapPosition(e.target.x() + size, e.target.y() + size);
            saveToHistory();
            onLocationsChange(
              locations.map(loc =>
                loc.id === location.id
                  ? { ...loc, x: newPos.x, y: newPos.y }
                  : loc
              )
            );
          }}
          onClick={() => {
            console.log('🖱️ CLICKED LOCATION:', location.id, location.name);
            handleLocationClick(location.id);
          }}
          shadowColor="black"
          shadowBlur={4}
          shadowOpacity={0.5}
          shadowOffsetX={2}
          shadowOffsetY={2}
          // Selection indicator - blue glow
          fillAfterStrokeEnabled={true}
          stroke={isSelected ? '#60a5fa' : undefined}
          strokeWidth={isSelected ? 3 : 0}
        />
      );
    }
    
    switch (markerStyle) {
      case 'pin':
        // Drop pin style
        return (
          <>
            {isSelected && (
              <Circle
                x={x}
                y={y - size / 2}
                radius={size * 0.8}
                fill={color}
                opacity={0.3}
              />
            )}
            <Circle
              x={x}
              y={y - size / 2}
              radius={size * 0.6}
              fill={color}
              stroke={isSelected ? '#60a5fa' : '#ffffff'}
              strokeWidth={isSelected ? 3 : 2}
              shadowColor="black"
              shadowBlur={8}
              shadowOpacity={0.7}
              draggable={editable}
              onDragEnd={(e) => {
                if (!editable) return;
                const newPos = snapPosition(e.target.x(), e.target.y() + size / 2);
                saveToHistory();
                onLocationsChange(
                  locations.map(loc =>
                    loc.id === location.id
                      ? { ...loc, x: newPos.x, y: newPos.y }
                      : loc
                  )
                );
              }}
              onClick={() => handleLocationClick(location.id)}
            />
            <Line
              points={[x, y - size / 2 + size * 0.6, x, y]}
              stroke={color}
              strokeWidth={size * 0.15}
              lineCap="round"
              shadowColor="black"
              shadowBlur={4}
              shadowOpacity={0.5}
            />
            <Circle
              x={x}
              y={y}
              radius={size * 0.2}
              fill={color}
              stroke="#000000"
              strokeWidth={1}
              shadowColor="black"
              shadowBlur={3}
              shadowOpacity={0.8}
            />
            <Text
              x={x - 12}
              y={y - size / 2 - 12}
              text={icon}
              fontSize={20}
              listening={false}
            />
          </>
        );
      
      case 'hex':
        // Hexagon style
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          hexPoints.push(x + size * 0.7 * Math.cos(angle));
          hexPoints.push(y + size * 0.7 * Math.sin(angle));
        }
        return (
          <>
            {isSelected && (
              <Line
                points={hexPoints}
                closed
                fill={color}
                opacity={0.3}
              />
            )}
            <Line
              points={hexPoints}
              closed
              fill={color}
              stroke={isSelected ? '#60a5fa' : '#ffffff'}
              strokeWidth={isSelected ? 3 : 2}
              shadowColor="black"
              shadowBlur={8}
              shadowOpacity={0.6}
            />
            <Text
              x={x - 12}
              y={y - 12}
              text={icon}
              fontSize={20}
              listening={false}
            />
          </>
        );
      
      case 'star':
        // Star style
        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? size * 0.7 : size * 0.35;
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          starPoints.push(x + radius * Math.cos(angle));
          starPoints.push(y + radius * Math.sin(angle));
        }
        return (
          <>
            {isSelected && (
              <Line
                points={starPoints}
                closed
                fill={color}
                opacity={0.3}
              />
            )}
            <Line
              points={starPoints}
              closed
              fill={color}
              stroke={isSelected ? '#60a5fa' : '#ffffff'}
              strokeWidth={isSelected ? 3 : 2}
              shadowColor="black"
              shadowBlur={8}
              shadowOpacity={0.6}
            />
            <Text
              x={x - 12}
              y={y - 12}
              text={icon}
              fontSize={20}
              listening={false}
            />
          </>
        );
      
      case 'circle':
      default:
        return (
          <>
            {isSelected && (
              <Circle
                x={x}
                y={y}
                radius={size + 10}
                fill={color}
                opacity={0.3}
              />
            )}
            <Circle
              x={x}
              y={y}
              radius={size}
              fill={color}
              stroke={isSelected ? '#60a5fa' : '#ffffff'}
              strokeWidth={isSelected ? 4 : 2}
              shadowColor="black"
              shadowBlur={10}
              shadowOpacity={0.6}
            />
            <Text
              x={x - 12}
              y={y - 12}
              text={icon}
              fontSize={24}
              listening={false}
            />
          </>
        );
    }
  };

  // Use type-specific marker icons
  const quickIcons = availableMarkers.map(m => m.emoji);
  
  console.log('🎨 Icon Picker:', {
    quickIconsCount: quickIcons.length,
    quickIconsRaw: JSON.stringify(quickIcons),
    firstIcon: quickIcons[0],
    selectedIcon: selectedIcon,
    availableMarkersFirst: availableMarkers[0]
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {editable && (
        <div className="space-y-3">
          <div className="flex gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setTool('select')}
              className={`px-4 py-2 rounded-lg transition-all ${
                tool === 'select'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              👆 Select
            </button>
            <button
              type="button"
              onClick={() => setTool('location')}
              className={`px-4 py-2 rounded-lg transition-all ${
                tool === 'location'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              📍 Add Location
            </button>
            <button
              type="button"
              onClick={() => setTool('path')}
              className={`px-4 py-2 rounded-lg transition-all ${
                tool === 'path'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🛤️ Draw Path
            </button>
            <button
              type="button"
              onClick={() => setTool('region')}
              className={`px-4 py-2 rounded-lg transition-all ${
                tool === 'region'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              🗺️ Draw Region
            </button>
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`px-4 py-2 rounded-lg transition-all ${
                  historyIndex > 0
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                ↶ Undo
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`px-4 py-2 rounded-lg transition-all ${
                  historyIndex < history.length - 1
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                ↷ Redo
              </button>
              {selectedId && (
                <button
                  type="button"
                  onClick={deleteSelectedLocation}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>

          {/* Grid & Background Controls */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3">Map Structure</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded"
                  />
                  Show Grid
                </label>
                {showGrid && (
                  <div className="space-y-2 ml-6">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setGridType('square')}
                        className={`flex-1 px-2 py-1 text-xs rounded ${
                          gridType === 'square'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        ◢ Square
                      </button>
                      <button
                        type="button"
                        onClick={() => setGridType('hex')}
                        className={`flex-1 px-2 py-1 text-xs rounded ${
                          gridType === 'hex'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        ⬡ Hex
                      </button>
                    </div>
                    <div>
                      <label className="text-white/60 text-xs">Size: {gridSize}px</label>
                      <input
                        type="range"
                        min="25"
                        max="100"
                        value={gridSize}
                        onChange={(e) => setGridSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-white/60 text-xs">
                      <input
                        type="checkbox"
                        checked={snapToGrid}
                        onChange={(e) => setSnapToGrid(e.target.checked)}
                        className="rounded"
                      />
                      Snap to grid
                    </label>
                  </div>
                )}
              </div>
              <div>
                <label className="text-white/70 text-sm block mb-2">Background</label>
                <select
                  value={backgroundTexture}
                  onChange={(e) => setBackgroundTexture(e.target.value as 'none' | 'parchment' | 'clean' | 'satellite')}
                  className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded text-white text-sm"
                >
                  <option value="none">Dark</option>
                  <option value="parchment">Parchment</option>
                  <option value="clean">Clean White</option>
                  <option value="satellite">Satellite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Settings - Only show when adding locations */}
          {tool === 'location' && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-semibold mb-3">Choose Icon to Place</h4>
              
              {/* Group icons by category */}
              {(() => {
                const categories = availableMarkers.reduce((acc, marker) => {
                  if (!acc[marker.category]) acc[marker.category] = [];
                  acc[marker.category].push(marker);
                  return acc;
                }, {} as Record<string, typeof availableMarkers>);
                
                return Object.entries(categories).map(([category, markers]) => (
                  <div key={category} className="mb-4">
                    <h5 className="text-white/50 text-xs uppercase tracking-wider mb-2 font-semibold">{category}</h5>
                    <div className="flex flex-wrap gap-2">
                      {markers.map((marker, idx) => (
                        <button
                          key={`picker-${marker.emoji}-${idx}`}
                          type="button"
                          onClick={() => {
                            console.log('🖱️ CLICKED ICON:', marker.emoji, 'Setting selectedIcon to:', marker.emoji);
                            setSelectedIcon(marker.emoji);
                          }}
                          style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}
                          className={`text-4xl p-2 rounded-lg transition-all border-2 ${
                            selectedIcon === marker.emoji
                              ? 'bg-blue-500/30 border-blue-400 scale-110 shadow-lg'
                              : 'bg-white/10 border-white/20 hover:bg-white/20 hover:scale-105'
                          }`}
                          title={marker.label}
                        >
                          {marker.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
              
              <p className="text-white/70 text-sm mb-3 pt-2 border-t border-white/10">
                <span className="text-green-400 font-semibold">Selected:</span> <span className="text-3xl" style={{ fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>{selectedIcon}</span> - Click canvas to place
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Color</label>
                  <input
                    type="color"
                    value={locationColor}
                    onChange={(e) => setLocationColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-white/70 text-sm block mb-2">Size: {locationSize}px</label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={locationSize}
                    onChange={(e) => setLocationSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Marker Style Controls - Simplified */}
          {tool === 'location' && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-semibold mb-3">Marker Shape</h4>
              <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setMarkerStyle('pin')}
                      disabled={!isMarkerStyleAllowed(mapType, 'pin')}
                      className={`p-3 rounded-lg transition-all ${
                        markerStyle === 'pin'
                          ? 'bg-green-500 text-white ring-2 ring-green-400'
                          : isMarkerStyleAllowed(mapType, 'pin')
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                      title={!isMarkerStyleAllowed(mapType, 'pin') ? `Pin markers not available for ${mapConfig.label}` : 'Pin markers'}
                    >
                      📍 Pin
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerStyle('hex')}
                      disabled={!isMarkerStyleAllowed(mapType, 'hex')}
                      className={`p-3 rounded-lg transition-all ${
                        markerStyle === 'hex'
                          ? 'bg-green-500 text-white ring-2 ring-green-400'
                          : isMarkerStyleAllowed(mapType, 'hex')
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                      title={!isMarkerStyleAllowed(mapType, 'hex') ? `Hex markers not available for ${mapConfig.label}` : 'Hex markers'}
                    >
                      ⬡ Hex
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerStyle('star')}
                      disabled={!isMarkerStyleAllowed(mapType, 'star')}
                      className={`p-3 rounded-lg transition-all ${
                        markerStyle === 'star'
                          ? 'bg-green-500 text-white ring-2 ring-green-400'
                          : isMarkerStyleAllowed(mapType, 'star')
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                      title={!isMarkerStyleAllowed(mapType, 'star') ? `Star markers not available for ${mapConfig.label}` : 'Star markers'}
                    >
                      ⭐ Star
                    </button>
                    <button
                      type="button"
                      onClick={() => setMarkerStyle('circle')}
                      disabled={!isMarkerStyleAllowed(mapType, 'circle')}
                      className={`p-3 rounded-lg transition-all ${
                        markerStyle === 'circle'
                          ? 'bg-green-500 text-white ring-2 ring-green-400'
                          : isMarkerStyleAllowed(mapType, 'circle')
                          ? 'bg-white/10 text-white/70 hover:bg-white/20'
                          : 'bg-white/5 text-white/30 cursor-not-allowed'
                      }`}
                      title={!isMarkerStyleAllowed(mapType, 'circle') ? `Circle markers not available for ${mapConfig.label}` : 'Circle markers'}
                    >
                      ⚫ Circle
                    </button>
                  </div>
            </div>
          )}

          {tool === 'path' && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-semibold mb-3">Path Settings</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Color</label>
                  <input
                    type="color"
                    value={pathColor}
                    onChange={(e) => setPathColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Width: {pathWidth}px</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={pathWidth}
                    onChange={(e) => setPathWidth(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Style</label>
                  <button
                    type="button"
                    onClick={() => setPathDashed(!pathDashed)}
                    className={`w-full px-3 py-2 rounded transition-all ${
                      pathDashed ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {pathDashed ? '- - -' : '———'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {tool === 'region' && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h4 className="text-white font-semibold mb-3">Region Settings</h4>
              <p className="text-white/60 text-sm mb-3">Click to create points, double-click or release to finish</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm block mb-2">Fill Color</label>
                  <input
                    type="color"
                    value={locationColor}
                    onChange={(e) => setLocationColor(e.target.value)}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-white/70 text-sm block mb-2">Opacity: {Math.round(0.3 * 100)}%</label>
                  <p className="text-white/50 text-xs mt-2">Regions will be semi-transparent</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Canvas */}
      <div
        className="rounded-xl overflow-hidden border border-white/20 relative"
        style={{
          backgroundColor: 
            backgroundTexture === 'parchment' ? '#f4e8d0' :
            backgroundTexture === 'clean' ? '#ffffff' :
            backgroundTexture === 'satellite' ? '#4a5568' :
            backgroundColor,
          backgroundImage:
            backgroundTexture === 'parchment' ? 'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3CfeColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.02 0" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" /%3E%3C/svg%3E")' :
            backgroundTexture === 'satellite' ? 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" /%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noise)" opacity="0.3" /%3E%3C/svg%3E")' :
            'none'
        }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {/* Grid overlay */}
            {showGrid && gridType === 'square' && Array.from({ length: Math.ceil(width / gridSize) + 1 }).map((_, i) => (
              <Line
                key={`v${i}`}
                points={[i * gridSize, 0, i * gridSize, height]}
                stroke={backgroundTexture === 'parchment' || backgroundTexture === 'clean' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={1}
                listening={false}
              />
            ))}
            {showGrid && gridType === 'square' && Array.from({ length: Math.ceil(height / gridSize) + 1 }).map((_, i) => (
              <Line
                key={`h${i}`}
                points={[0, i * gridSize, width, i * gridSize]}
                stroke={backgroundTexture === 'parchment' || backgroundTexture === 'clean' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={1}
                listening={false}
              />
            ))}

            {/* Hex grid */}
            {showGrid && gridType === 'hex' && (() => {
              const hexWidth = gridSize;
              const hexHeight = gridSize * Math.sqrt(3) / 2;
              const rows = Math.ceil(height / hexHeight) + 1;
              const cols = Math.ceil(width / hexWidth) + 1;
              const hexagons = [];
              
              for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                  const xOffset = col * hexWidth * 0.75;
                  const yOffset = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
                  const points = [];
                  for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i;
                    points.push(xOffset + (hexWidth / 2) * Math.cos(angle));
                    points.push(yOffset + (hexWidth / 2) * Math.sin(angle));
                  }
                  hexagons.push(
                    <Line
                      key={`hex-${row}-${col}`}
                      points={points}
                      closed
                      stroke={backgroundTexture === 'parchment' || backgroundTexture === 'clean' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)'}
                      strokeWidth={1}
                      listening={false}
                    />
                  );
                }
              }
              return hexagons;
            })()}

            {/* Regions (drawn first, behind everything) */}
            {regions.map((region) => (
              <Line
                key={region.id}
                points={region.points}
                closed
                fill={region.fill}
                stroke={region.stroke}
                strokeWidth={2}
                opacity={region.opacity}
              />
            ))}

            {/* Saved paths */}
            {paths.map((path) => (
              <Line
                key={path.id}
                points={path.points}
                stroke={path.color}
                strokeWidth={path.width}
                lineCap="round"
                lineJoin="round"
                dash={path.dashed ? [10, 5] : undefined}
                opacity={0.8}
              />
            ))}

            {/* Current path being drawn */}
            {currentPath.length > 0 && tool === 'path' && (
              <Line
                points={currentPath}
                stroke={pathColor}
                strokeWidth={pathWidth}
                lineCap="round"
                lineJoin="round"
                dash={pathDashed ? [10, 5] : undefined}
                opacity={0.8}
              />
            )}

            {/* Current region being drawn */}
            {currentPath.length > 0 && tool === 'region' && (
              <Line
                points={currentPath}
                closed
                fill={locationColor}
                stroke="#ffffff"
                strokeWidth={2}
                opacity={0.3}
              />
            )}

            {/* Locations */}
            {locations.map((location) => {
              const isSelected = location.id === selectedId;
              return (
                <React.Fragment key={location.id}>
                  {renderMarker(location, isSelected)}
                  {/* Location name label */}
                  <Text
                    x={location.x - 60}
                    y={location.y + location.size + 10}
                    width={120}
                    text={location.name}
                    fontSize={14}
                    fill="white"
                    align="center"
                    fontStyle="bold"
                    shadowColor="black"
                    shadowBlur={5}
                    shadowOpacity={0.8}
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
        
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-4 py-2 rounded-lg text-white text-sm">
          📍 {locations.length} locations • �️ {regions.length} regions • �🛤️ {paths.length} paths
        </div>
      </div>

      {/* Location editor - Draggable floating panel */}
      {(() => {
        console.log('🔍 Edit Panel Check:', { 
          editable, 
          selectedId, 
          panelPosition,
          locationCount: locations.length,
          willShow: editable && selectedId && panelPosition !== null
        });
        if (!editable || !selectedId || !panelPosition) return null;
        
        return (
          <div 
            className="absolute w-96 p-4 bg-gray-900/95 backdrop-blur rounded-xl border border-white/20 shadow-2xl z-50 max-h-[60vh] overflow-y-auto cursor-move"
            style={{ 
              left: `${panelPosition.x}px`, 
              top: `${panelPosition.y}px`,
              userSelect: isDraggingPanel ? 'none' : 'auto'
            }}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('input, button:not(.drag-handle)')) return;
              setIsDraggingPanel(true);
              setDragOffset({
                x: e.clientX - panelPosition.x,
                y: e.clientY - panelPosition.y
              });
            }}
            onMouseMove={(e) => {
              if (isDraggingPanel) {
                setPanelPosition({
                  x: e.clientX - dragOffset.x,
                  y: e.clientY - dragOffset.y
                });
              }
            }}
            onMouseUp={() => setIsDraggingPanel(false)}
            onMouseLeave={() => setIsDraggingPanel(false)}
          >
            <div className="flex items-center justify-between mb-3 drag-handle">
              <h3 className="text-white font-semibold">📍 Edit Location</h3>
              <button
                type="button"
                onClick={() => { setSelectedId(null); setPanelPosition(null); }}
                className="text-white/60 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            {locations
            .filter((loc) => loc.id === selectedId)
            .map((location) => (
              <div key={location.id} className="space-y-3">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Name</label>
                  <input
                    type="text"
                    value={location.name}
                    onChange={(e) => updateLocationName(location.id, e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white/70 text-sm">Icon</label>
                    <span className="text-xs text-white/50">{availableMarkers.length} {mapConfig.label} markers</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickIcons.map((emoji, idx) => (
                      <button
                        key={`${emoji}-${idx}`}
                        type="button"
                        onClick={() => updateLocationIcon(location.id, emoji)}
                        className={`text-2xl p-2 rounded transition-all ${
                          location.icon === emoji
                            ? 'bg-purple-500/30 ring-2 ring-purple-500'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/60">Position:</span>
                    <span className="text-white ml-2">
                      ({Math.round(location.x)}, {Math.round(location.y)})
                    </span>
                  </div>
                  <div>
                    <span className="text-white/60">Color:</span>
                    <input
                      type="color"
                      value={location.color}
                      onChange={(e) => {
                        saveToHistory();
                        onLocationsChange(
                          locations.map(loc =>
                            loc.id === location.id ? { ...loc, color: e.target.value } : loc
                          )
                        );
                      }}
                      className="ml-2 h-6 w-12 rounded cursor-pointer"
                    />
                  </div>
                  <div className="col-span-2">
                    <span className="text-white/60">Size:</span>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={location.size}
                      onChange={(e) => {
                        saveToHistory();
                        onLocationsChange(
                          locations.map(loc =>
                            loc.id === location.id ? { ...loc, size: parseInt(e.target.value) } : loc
                          )
                        );
                      }}
                      className="ml-2 w-32"
                    />
                    <span className="text-white ml-2">{location.size}px</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Path manager */}
      {editable && paths.length > 0 && (
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-white font-semibold mb-3">Paths ({paths.length})</h3>
          <div className="space-y-2">
            {paths.map((path, index) => (
              <div
                key={path.id}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-4 rounded"
                    style={{
                      background: `repeating-linear-gradient(90deg, ${path.color}, ${path.color} ${
                        path.dashed ? '10px' : '100%'
                      }, transparent ${path.dashed ? '10px' : '0'}, transparent ${
                        path.dashed ? '15px' : '0'
                      })`,
                    }}
                  />
                  <span className="text-white/70 text-sm">
                    Path {index + 1} ({Math.round(path.points.length / 2)} points)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deletePath(path.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions - Type-Specific */}
      {editable && (
        <div className="space-y-3">
          {/* Map Type Instructions */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="text-blue-200 text-sm font-semibold mb-2">
              {mapConfig.emoji} {mapConfig.label}
            </div>
            <div className="text-blue-200/80 text-sm">
              {instructions}
            </div>
          </div>
          
          {/* Validation Warning */}
          {validationMessage && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="text-amber-200 text-sm">
                ⚠️ {validationMessage}
              </div>
            </div>
          )}
          
          {/* Tool Tips */}
          <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs space-y-1">
            <div>💡 <strong>Select Tool:</strong> Click and drag markers to move them</div>
            <div>💡 <strong>Add Location:</strong> Click anywhere on the map to place a marker</div>
            <div>💡 <strong>Draw Path:</strong> Click and drag to draw roads/connections</div>
          </div>
        </div>
      )}
    </div>
  );
}
