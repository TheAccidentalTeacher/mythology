'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ComicPanel {
  id: number;
  description: string;
  imageUrl?: string;
  provider?: string;
  isGenerating?: boolean;
  error?: string;
}

interface ComicStripGeneratorProps {
  storyTitle: string;
  storyContent: string;
  characters: string[];
  mythologyName: string;
  onComplete?: (panels: ComicPanel[]) => void;
}

export default function ComicStripGenerator({
  storyTitle,
  storyContent,
  characters,
  mythologyName,
  onComplete
}: ComicStripGeneratorProps) {
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [isGeneratingPanels, setIsGeneratingPanels] = useState(false);
  const [panelCount, setPanelCount] = useState(4);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Cheat code state (click 📚 5 times quickly)
  const [cheatModeEnabled, setCheatModeEnabled] = useState(false);
  const [cheatClickCount, setCheatClickCount] = useState(0);
  const [lastCheatClick, setLastCheatClick] = useState(0);

  const handleCheatClick = () => {
    const now = Date.now();
    if (now - lastCheatClick > 3000) {
      setCheatClickCount(1);
    } else {
      const newCount = cheatClickCount + 1;
      setCheatClickCount(newCount);
      if (newCount >= 5) {
        setCheatModeEnabled(!cheatModeEnabled);
        setCheatClickCount(0);
        console.log(cheatModeEnabled ? '🔒 Cheat mode disabled' : '🔓 Cheat mode enabled!');
      }
    }
    setLastCheatClick(now);
  };

  // Use GPT to break the story into comic panels
  const generatePanelDescriptions = async () => {
    setIsGeneratingPanels(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-comic-panels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle,
          storyContent,
          characters,
          panelCount,
          mythologyName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate panel descriptions');
      }

      // Initialize panels with descriptions
      const initialPanels: ComicPanel[] = data.panels.map((desc: string, idx: number) => ({
        id: idx + 1,
        description: desc,
        isGenerating: false,
      }));

      setPanels(initialPanels);
    } catch (err) {
      console.error('Error generating panels:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate comic panels');
    } finally {
      setIsGeneratingPanels(false);
    }
  };

  // Generate image for a single panel
  const generatePanelImage = async (panelId: number) => {
    const panel = panels.find(p => p.id === panelId);
    if (!panel) return;

    setPanels(prev => prev.map(p => 
      p.id === panelId ? { ...p, isGenerating: true, error: undefined } : p
    ));

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cheatModeEnabled) {
        headers['x-dev-cheat'] = 'mythology-dev-2024';
      }

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          entityType: 'comic_panel',
          entityId: `comic-${storyTitle}-panel-${panelId}`,
          entityName: `${storyTitle} - Panel ${panelId}`,
          entityDescription: panel.description,
          mythologyName,
          stylePreset: 'comic_book',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate panel image');
      }

      setPanels(prev => prev.map(p => 
        p.id === panelId 
          ? { ...p, imageUrl: data.imageUrl, provider: data.provider, isGenerating: false } 
          : p
      ));
    } catch (err) {
      console.error(`Error generating panel ${panelId}:`, err);
      setPanels(prev => prev.map(p => 
        p.id === panelId 
          ? { ...p, error: err instanceof Error ? err.message : 'Failed', isGenerating: false } 
          : p
      ));
    }
  };

  // Generate all panel images sequentially
  const generateAllPanelImages = async () => {
    for (const panel of panels) {
      if (!panel.imageUrl && !panel.error) {
        await generatePanelImage(panel.id);
      }
    }
    if (onComplete) {
      onComplete(panels);
    }
  };

  const providerBadge = (provider?: string) => {
    if (provider === 'gemini') {
      return <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">🍌</span>;
    }
    if (provider === 'dalle') {
      return <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">🎨</span>;
    }
    return null;
  };

  const completedCount = panels.filter(p => p.imageUrl).length;
  const hasAllImages = panels.length > 0 && completedCount === panels.length;

  return (
    <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-6 border border-amber-700/50">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span 
            onClick={(e) => { e.stopPropagation(); handleCheatClick(); }}
            className="cursor-pointer select-none hover:scale-110 transition-transform"
            title={cheatClickCount > 0 ? `${5 - cheatClickCount} more clicks...` : undefined}
          >
            {cheatModeEnabled ? '🔧' : '📚'}
          </span>
          Comic Strip Generator
          {cheatModeEnabled && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded ml-2">
              Dev Mode
            </span>
          )}
        </h3>
        <span className="text-2xl">{isCollapsed ? '▼' : '▲'}</span>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 mt-2 mb-4">
              Transform your story into an illustrated comic strip!
            </p>

            {/* Panel Count Selector */}
            {panels.length === 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Number of Panels</label>
                <div className="flex gap-2">
                  {[3, 4, 6].map(count => (
                    <button
                      key={count}
                      onClick={() => setPanelCount(count)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        panelCount === count 
                          ? 'bg-amber-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {count} Panels
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Panel Descriptions Button */}
            {panels.length === 0 && (
              <button
                onClick={generatePanelDescriptions}
                disabled={isGeneratingPanels}
                className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white disabled:opacity-50"
              >
                {isGeneratingPanels ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Breaking Story into Panels...
                  </span>
                ) : (
                  '✨ Create Comic Panels'
                )}
              </button>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                {error}
              </div>
            )}

            {/* Panel Preview */}
            {panels.length > 0 && (
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {completedCount}/{panels.length} panels generated
                  </span>
                  {!hasAllImages && (
                    <button
                      onClick={generateAllPanelImages}
                      disabled={panels.some(p => p.isGenerating)}
                      className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm disabled:opacity-50"
                    >
                      🎨 Generate All Images
                    </button>
                  )}
                </div>

                {/* Comic Strip Grid */}
                <div className={`grid gap-4 ${
                  panels.length === 3 ? 'grid-cols-3' : 
                  panels.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 
                  'grid-cols-2 md:grid-cols-3'
                }`}>
                  {panels.map(panel => (
                    <div
                      key={panel.id}
                      className="bg-white rounded-lg overflow-hidden border-4 border-black relative"
                    >
                      {/* Panel Number */}
                      <div className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded z-10">
                        {panel.id}
                      </div>
                      
                      {/* Provider Badge */}
                      {panel.provider && (
                        <div className="absolute top-1 right-1 z-10">
                          {providerBadge(panel.provider)}
                        </div>
                      )}

                      {/* Image or Placeholder */}
                      <div className="aspect-square bg-gray-100 relative">
                        {panel.imageUrl ? (
                          <Image
                            src={panel.imageUrl}
                            alt={`Panel ${panel.id}`}
                            fill
                            className="object-cover"
                          />
                        ) : panel.isGenerating ? (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-4xl animate-bounce">🎨</span>
                          </div>
                        ) : panel.error ? (
                          <div className="flex items-center justify-center h-full p-2 text-center">
                            <span className="text-red-500 text-sm">{panel.error}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => generatePanelImage(panel.id)}
                            className="w-full h-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <span className="text-4xl">➕</span>
                          </button>
                        )}
                      </div>

                      {/* Caption */}
                      <div className="p-2 bg-white text-black text-xs min-h-[50px]">
                        {panel.description.slice(0, 100)}...
                      </div>
                    </div>
                  ))}
                </div>

                {/* Download Strip Button */}
                {hasAllImages && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                    <p className="text-green-400 font-medium flex items-center gap-2">
                      ✅ Comic strip complete!
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Right-click on panels to save individual images.
                    </p>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={() => setPanels([])}
                  className="text-sm text-gray-400 hover:text-gray-300 underline"
                >
                  Start Over
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
