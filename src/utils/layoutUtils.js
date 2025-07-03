import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// Responsive node dimensions
const getNodeDimensions = () => {
  const isMobile = window.innerWidth < 640;
  return {
    width: isMobile ? 140 : 200,
    height: isMobile ? 60 : 80
  };
};

export function getLayoutedElements(nodes, edges, direction = 'TB') {
  const isHorizontal = direction === 'LR';
  const { width: nodeWidth, height: nodeHeight } = getNodeDimensions();
  
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: window.innerWidth < 640 ? 30 : 50,
    ranksep: window.innerWidth < 640 ? 40 : 80
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}