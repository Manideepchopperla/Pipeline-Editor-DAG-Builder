export function validateDAG(nodes, edges) {
  const validation = {
    isValid: false,
    errors: [],
    warnings: [],
    info: []
  };

  // Check minimum nodes
  if (nodes.length < 2) {
    validation.errors.push('Pipeline must have at least 2 nodes');
  }

  // Check if all nodes are connected
  const connectedNodes = new Set();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });

  const unconnectedNodes = nodes.filter(node => !connectedNodes.has(node.id));
  if (unconnectedNodes.length > 0) {
    validation.errors.push(`${unconnectedNodes.length} node(s) are not connected to any edges`);
  }

  // Check for cycles using DFS
  const hasCycle = detectCycle(nodes, edges);
  if (hasCycle) {
    validation.errors.push('Pipeline contains cycles - DAGs cannot have circular dependencies');
  }

  // Check for self-loops (should be prevented by UI, but double-check)
  const selfLoops = edges.filter(edge => edge.source === edge.target);
  if (selfLoops.length > 0) {
    validation.errors.push('Self-connections are not allowed');
  }

  // Add info about the current state
  validation.info.push(`${nodes.length} nodes, ${edges.length} edges`);
  
  if (nodes.length > 0 && edges.length === 0) {
    validation.warnings.push('No connections between nodes');
  }

  // Determine if valid
  validation.isValid = validation.errors.length === 0 && nodes.length >= 2;

  return validation;
}

function detectCycle(nodes, edges) {
  // Build adjacency list
  const graph = {};
  nodes.forEach(node => {
    graph[node.id] = [];
  });
  
  edges.forEach(edge => {
    if (graph[edge.source]) {
      graph[edge.source].push(edge.target);
    }
  });

  // DFS with recursion stack to detect cycles
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(nodeId) {
    if (recursionStack.has(nodeId)) {
      return true; // Cycle detected
    }
    
    if (visited.has(nodeId)) {
      return false;
    }

    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = graph[nodeId] || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check each node
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) {
        return true;
      }
    }
  }

  return false;
}