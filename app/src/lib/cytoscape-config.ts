// Cytoscape.js configuration for relationship graphs

export type LayoutType = 'force-directed' | 'hierarchical' | 'circular' | 'grid' | 'concentric';

// Cytoscape style definitions (using any because cytoscape types are complex)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cytoscapeStylesheet: any[] = [
  {
    selector: 'node',
    style: {
      'background-color': '#6366f1', // Indigo
      'label': 'data(label)',
      'color': '#ffffff',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '12px',
      'width': 60,
      'height': 60,
      'border-width': 2,
      'border-color': '#4f46e5',
      'font-weight': 'bold'
    }
  },
  {
    selector: 'node[type = "god"]',
    style: {
      'background-color': '#f59e0b', // Amber (gods)
      'border-color': '#d97706',
      'width': 70,
      'height': 70
    }
  },
  {
    selector: 'node[type = "demigod"]',
    style: {
      'background-color': '#8b5cf6', // Purple (demigods)
      'border-color': '#7c3aed',
      'width': 65,
      'height': 65
    }
  },
  {
    selector: 'node[type = "hero"]',
    style: {
      'background-color': '#10b981', // Green (heroes)
      'border-color': '#059669',
      'width': 60,
      'height': 60
    }
  },
  {
    selector: 'node[type = "mortal"]',
    style: {
      'background-color': '#6b7280', // Gray (mortals)
      'border-color': '#4b5563',
      'width': 55,
      'height': 55
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 4,
      'border-color': '#3b82f6', // Blue when selected
      'background-color': '#60a5fa'
    }
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#9ca3af',
      'target-arrow-color': '#9ca3af',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'font-size': '10px',
      'color': '#ffffff',
      'text-background-color': '#1f2937',
      'text-background-opacity': 0.8,
      'text-background-padding': '3px',
      'text-rotation': 'autorotate'
    }
  },
  {
    selector: 'edge[relationshipType = "parent"]',
    style: {
      'line-color': '#10b981',
      'target-arrow-color': '#10b981'
    }
  },
  {
    selector: 'edge[relationshipType = "child"]',
    style: {
      'line-color': '#10b981',
      'target-arrow-color': '#10b981'
    }
  },
  {
    selector: 'edge[relationshipType = "sibling"]',
    style: {
      'line-color': '#3b82f6',
      'target-arrow-color': '#3b82f6',
      'target-arrow-shape': 'none' // Mutual relationship
    }
  },
  {
    selector: 'edge[relationshipType = "spouse"]',
    style: {
      'line-color': '#ec4899',
      'target-arrow-color': '#ec4899',
      'target-arrow-shape': 'none'
    }
  },
  {
    selector: 'edge[relationshipType = "rival"]',
    style: {
      'line-color': '#f59e0b',
      'target-arrow-color': '#f59e0b',
      'target-arrow-shape': 'none'
    }
  },
  {
    selector: 'edge[relationshipType = "ally"]',
    style: {
      'line-color': '#06b6d4',
      'target-arrow-color': '#06b6d4',
      'target-arrow-shape': 'none'
    }
  },
  {
    selector: 'edge[relationshipType = "enemy"]',
    style: {
      'line-color': '#ef4444',
      'target-arrow-color': '#ef4444',
      'target-arrow-shape': 'none'
    }
  },
  {
    selector: 'edge[relationshipType = "mentor"]',
    style: {
      'line-color': '#8b5cf6',
      'target-arrow-color': '#8b5cf6'
    }
  },
  {
    selector: 'edge[relationshipType = "student"]',
    style: {
      'line-color': '#8b5cf6',
      'target-arrow-color': '#8b5cf6'
    }
  },
  {
    selector: 'edge[relationshipType = "friend"]',
    style: {
      'line-color': '#0ea5e9',
      'target-arrow-color': '#0ea5e9',
      'target-arrow-shape': 'none'
    }
  },
  {
    selector: 'edge[relationshipType = "romantic"]',
    style: {
      'line-color': '#f43f5e',
      'target-arrow-color': '#f43f5e'
    }
  }
];

// Layout configurations
export const layoutConfigs = {
  'force-directed': {
    name: 'cose',
    animate: true,
    animationDuration: 1000,
    animationEasing: 'ease-out',
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    nodeOverlap: 20,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  },
  'hierarchical': {
    name: 'breadthfirst',
    directed: true,
    animate: true,
    animationDuration: 1000,
    spacingFactor: 1.5,
    avoidOverlap: true
  },
  'circular': {
    name: 'circle',
    animate: true,
    animationDuration: 1000,
    radius: 250,
    startAngle: -Math.PI / 2,
    sweep: Math.PI * 2,
    clockwise: true,
    spacingFactor: 1
  },
  'grid': {
    name: 'grid',
    animate: true,
    animationDuration: 1000,
    avoidOverlap: true,
    condense: false,
    rows: undefined,
    cols: undefined
  },
  'concentric': {
    name: 'concentric',
    animate: true,
    animationDuration: 1000,
    fit: true,
    concentric: (node: { degree: () => number }) => node.degree(),
    levelWidth: () => 2,
    spacingFactor: 1.5,
    minNodeSpacing: 50
  }
};

// Get layout config by type
export function getLayoutConfig(layoutType: LayoutType) {
  return layoutConfigs[layoutType] || layoutConfigs['force-directed'];
}
