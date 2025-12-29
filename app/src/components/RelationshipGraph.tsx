'use client';

import { useEffect, useRef, useState } from 'react';
import { cytoscapeStylesheet, getLayoutConfig, LayoutType } from '@/lib/cytoscape-config';
import { Relationship } from '@/lib/relationshipTypes';
import type { Core, ElementDefinition } from 'cytoscape';

interface Character {
  id: string;
  name: string;
  character_type: string;
}

interface RelationshipGraphProps {
  characters: Character[];
  relationships: Relationship[];
  onNodeClick?: (characterId: string) => void;
  onEdgeClick?: (relationship: Relationship) => void;
  selectedLayout?: LayoutType;
  filteredRelationshipTypes?: string[];
  className?: string;
}

export default function RelationshipGraph({
  characters,
  relationships,
  onNodeClick,
  onEdgeClick,
  selectedLayout = 'force-directed',
  filteredRelationshipTypes = [],
  className = ''
}: RelationshipGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize Cytoscape
  useEffect(() => {
    if (!isMounted || !containerRef.current || characters.length === 0) return;

    // Dynamically import cytoscape only on client side
    import('cytoscape').then((cytoscapeModule) => {
      const cytoscape = cytoscapeModule.default;
      
      if (!containerRef.current) return;

      if (!containerRef.current) return;

    console.log('🎯 Initializing relationship graph:', {
      characters: characters.length,
      relationships: relationships.length
    });

    // Create nodes from characters
    const nodes: ElementDefinition[] = characters.map(char => ({
      data: {
        id: char.id,
        label: char.name,
        type: char.character_type
      }
    }));

    // Create edges from relationships
    const edges: ElementDefinition[] = relationships.map(rel => ({
      data: {
        id: rel.id,
        source: rel.character_1_id,
        target: rel.character_2_id,
        label: rel.relationship_type,
        relationshipType: rel.relationship_type,
        strength: rel.strength,
        description: rel.description
      }
    }));

    console.log('📊 Graph data:', { nodes: nodes.length, edges: edges.length });

    // Initialize Cytoscape instance
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: cytoscapeStylesheet,
      layout: getLayoutConfig(selectedLayout),
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.2
    });

    cyRef.current = cy;
    setIsReady(true);

    // Node click handler
    cy.on('tap', 'node', (event) => {
      const nodeId = event.target.id();
      console.log('🖱️ Node clicked:', nodeId);
      if (onNodeClick) {
        onNodeClick(nodeId);
      }
    });

    // Edge click handler
    cy.on('tap', 'edge', (event) => {
      const edgeData = event.target.data();
      console.log('🖱️ Edge clicked:', edgeData);
      if (onEdgeClick) {
        const relationship = relationships.find(r => r.id === edgeData.id);
        if (relationship) {
          onEdgeClick(relationship);
        }
      }
    });
    });

    // Cleanup
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
        setIsReady(false);
      }
    };
  }, [isMounted, characters, relationships, selectedLayout, onNodeClick, onEdgeClick]);

  // Apply layout change
  useEffect(() => {
    if (!cyRef.current || !isReady) return;

    console.log('🔄 Applying layout:', selectedLayout);
    const layout = cyRef.current.layout(getLayoutConfig(selectedLayout));
    layout.run();
  }, [selectedLayout, isReady]);

  // Filter edges by relationship type
  useEffect(() => {
    if (!cyRef.current || !isReady) return;

    if (filteredRelationshipTypes.length === 0) {
      // Show all edges
      cyRef.current.edges().style('display', 'element');
    } else {
      // Hide all edges first
      cyRef.current.edges().style('display', 'none');
      
      // Show only filtered types
      filteredRelationshipTypes.forEach(type => {
        cyRef.current?.edges(`[relationshipType = "${type}"]`).style('display', 'element');
      });
    }
  }, [filteredRelationshipTypes, isReady]);

  // Export graph as PNG
  const exportAsImage = () => {
    if (!cyRef.current) return;

    const png64 = cyRef.current.png({
      output: 'blob',
      bg: '#1a1a2e',
      full: true,
      scale: 2
    });

    // Create download link
    const url = URL.createObjectURL(png64 as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relationship-graph-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fit graph to container
  const fitGraph = () => {
    if (!cyRef.current) return;
    cyRef.current.fit(undefined, 50);
  };

  // Reset zoom
  const resetZoom = () => {
    if (!cyRef.current) return;
    cyRef.current.zoom(1);
    cyRef.current.center();
  };

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 rounded-xl border border-white/10">
        <div className="text-center text-white/60">
          <p className="text-lg mb-2">No characters yet</p>
          <p className="text-sm">Add characters to your mythology to see relationships</p>
        </div>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900/50 rounded-xl border border-white/10">
        <div className="text-center text-white/60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading graph...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Graph container */}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gray-900/50 rounded-xl border border-white/10"
        style={{ minHeight: '500px' }}
      />

      {/* Controls overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={fitGraph}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors text-sm"
          title="Fit to screen"
        >
          🔍 Fit
        </button>
        <button
          onClick={resetZoom}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors text-sm"
          title="Reset zoom"
        >
          🎯 Reset
        </button>
        <button
          onClick={exportAsImage}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors text-sm"
          title="Export as PNG"
        >
          📷 Export
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur rounded-lg border border-white/20 p-3">
        <h4 className="text-white font-semibold text-sm mb-2">Character Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-white/70">God</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-white/70">Demigod</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-white/70">Hero</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-white/70">Mortal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
