import { calculateDistance } from './distanceCalculator';

/**
 * Graph node for pathfinding
 */
class GraphNode {
  constructor(galaxy) {
    this.galaxy = galaxy;
    this.neighbors = [];
  }
}

/**
 * Priority queue for Dijkstra's algorithm
 */
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    return this.items.shift()?.item;
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

/**
 * Build a graph from galaxies where each galaxy is connected to all others
 * @param {Array} galaxies - Array of galaxy objects
 * @returns {Map} Map of galaxy ID to GraphNode
 */
function buildGraph(galaxies) {
  const graph = new Map();
  
  // Create nodes
  galaxies.forEach(galaxy => {
    graph.set(galaxy.id, new GraphNode(galaxy));
  });
  
  // Connect all nodes (complete graph)
  galaxies.forEach(galaxy => {
    const node = graph.get(galaxy.id);
    galaxies.forEach(otherGalaxy => {
      if (galaxy.id !== otherGalaxy.id) {
        const distance = calculateDistance(galaxy.position_3d, otherGalaxy.position_3d);
        node.neighbors.push({
          galaxy: otherGalaxy,
          distance,
        });
      }
    });
  });
  
  return graph;
}

/**
 * Find shortest path using Dijkstra's algorithm
 * @param {Array} galaxies - All galaxies
 * @param {Object} start - Start galaxy
 * @param {Object} end - End galaxy
 * @returns {Object} { path: Array, totalDistance: number }
 */
export function findShortestPath(galaxies, start, end) {
  if (!start || !end) {
    return { path: [], totalDistance: 0 };
  }
  
  if (start.id === end.id) {
    return { path: [start], totalDistance: 0 };
  }
  
  const graph = buildGraph(galaxies);
  const distances = new Map();
  const previous = new Map();
  const queue = new PriorityQueue();
  
  // Initialize
  galaxies.forEach(galaxy => {
    distances.set(galaxy.id, Infinity);
    previous.set(galaxy.id, null);
  });
  
  distances.set(start.id, 0);
  queue.enqueue(start.id, 0);
  
  // Dijkstra's algorithm
  while (!queue.isEmpty()) {
    const currentId = queue.dequeue();
    
    if (currentId === end.id) {
      break;
    }
    
    const currentNode = graph.get(currentId);
    const currentDistance = distances.get(currentId);
    
    currentNode.neighbors.forEach(({ galaxy, distance }) => {
      const newDistance = currentDistance + distance;
      
      if (newDistance < distances.get(galaxy.id)) {
        distances.set(galaxy.id, newDistance);
        previous.set(galaxy.id, currentId);
        queue.enqueue(galaxy.id, newDistance);
      }
    });
  }
  
  // Reconstruct path
  const path = [];
  let currentId = end.id;
  
  while (currentId) {
    const galaxy = galaxies.find(g => g.id === currentId);
    if (galaxy) {
      path.unshift(galaxy);
    }
    currentId = previous.get(currentId);
  }
  
  // If path doesn't start with start galaxy, no path was found
  if (path.length === 0 || path[0].id !== start.id) {
    return { path: [], totalDistance: 0 };
  }
  
  return {
    path,
    totalDistance: distances.get(end.id),
  };
}

/**
 * Find path with waypoints
 * @param {Array} galaxies - All galaxies
 * @param {Array} waypoints - Array of galaxy objects to visit in order
 * @returns {Object} { path: Array, totalDistance: number }
 */
export function findPathWithWaypoints(galaxies, waypoints) {
  if (waypoints.length < 2) {
    return { path: waypoints, totalDistance: 0 };
  }
  
  let fullPath = [];
  let totalDistance = 0;
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const result = findShortestPath(galaxies, waypoints[i], waypoints[i + 1]);
    
    if (result.path.length === 0) {
      // No path found
      return { path: [], totalDistance: 0 };
    }
    
    // Add to full path (skip first element if not the first segment to avoid duplicates)
    if (i === 0) {
      fullPath = fullPath.concat(result.path);
    } else {
      fullPath = fullPath.concat(result.path.slice(1));
    }
    
    totalDistance += result.totalDistance;
  }
  
  return {
    path: fullPath,
    totalDistance,
  };
}

/**
 * Find N nearest neighbors to a galaxy
 * @param {Array} galaxies - All galaxies
 * @param {Object} galaxy - Reference galaxy
 * @param {number} n - Number of neighbors to find
 * @returns {Array} Array of {galaxy, distance} objects
 */
export function findNearestNeighbors(galaxies, galaxy, n = 5) {
  const distances = galaxies
    .filter(g => g.id !== galaxy.id)
    .map(g => ({
      galaxy: g,
      distance: calculateDistance(galaxy.position_3d, g.position_3d),
    }))
    .sort((a, b) => a.distance - b.distance);
  
  return distances.slice(0, n);
}

/**
 * Simple direct path (no pathfinding, just straight line)
 * @param {Object} start - Start galaxy
 * @param {Object} end - End galaxy
 * @returns {Object} { path: Array, totalDistance: number }
 */
export function findDirectPath(start, end) {
  if (!start || !end) {
    return { path: [], totalDistance: 0 };
  }
  
  if (start.id === end.id) {
    return { path: [start], totalDistance: 0 };
  }
  
  const distance = calculateDistance(start.position_3d, end.position_3d);
  
  return {
    path: [start, end],
    totalDistance: distance,
  };
}

