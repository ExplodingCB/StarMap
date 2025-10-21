import { create } from 'zustand';
import { DEFAULT_SPEED } from '../utils/constants';

/**
 * Global application state using Zustand
 */
export const useAppStore = create((set, get) => ({
  // Galaxy data
  galaxies: [],
  metadata: null,
  setGalaxies: (galaxies) => set({ galaxies }),
  setMetadata: (metadata) => set({ metadata }),
  
  // Selection state
  selectedGalaxy: null,
  hoveredGalaxy: null,
  setSelectedGalaxy: (galaxy) => set({ selectedGalaxy: galaxy }),
  setHoveredGalaxy: (galaxy) => set({ hoveredGalaxy: galaxy }),
  
  // Route state
  routeStart: null,
  routeEnd: null,
  routePath: [],
  routeDistance: 0,
  routeWaypoints: [],
  setRouteStart: (galaxy) => set({ routeStart: galaxy, routePath: [], routeDistance: 0 }),
  setRouteEnd: (galaxy) => set({ routeEnd: galaxy }),
  setRoutePath: (path, distance) => set({ routePath: path, routeDistance: distance }),
  addWaypoint: () => set((state) => ({
    routeWaypoints: [...state.routeWaypoints, null], // Add empty waypoint
  })),
  setWaypoint: (index, galaxy) => set((state) => {
    const newWaypoints = [...state.routeWaypoints];
    newWaypoints[index] = galaxy;
    return { routeWaypoints: newWaypoints };
  }),
  removeWaypoint: (index) => set((state) => ({
    routeWaypoints: state.routeWaypoints.filter((_, i) => i !== index),
  })),
  clearRoute: () => set({
    routeStart: null,
    routeEnd: null,
    routePath: [],
    routeDistance: 0,
    routeWaypoints: [],
  }),
  
  // Speed settings
  speedProfile: DEFAULT_SPEED,
  setSpeedProfile: (profile) => set({ speedProfile: profile }),
  
  // UI state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Filter by galaxy types - all enabled by default
  enabledTypes: {
    'Spiral': true,
    'Elliptical': true,
    'Irregular': true,
    'Dwarf Spheroidal': true,
    'Dwarf Elliptical': true,
    'Compact Elliptical': true,
  },
  toggleGalaxyType: (type) => set((state) => ({
    enabledTypes: {
      ...state.enabledTypes,
      [type]: !state.enabledTypes[type],
    },
  })),
  
  filterTypes: [],
  setFilterTypes: (types) => set({ filterTypes: types }),
  
  showLabels: true,
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  
  showGrid: false,
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  
  infoPanelOpen: false,
  setInfoPanelOpen: (open) => set({ infoPanelOpen: open }),
  
  routePanelOpen: false,
  setRoutePanelOpen: (open) => set({ routePanelOpen: open }),
  
  directionsPanelOpen: false,
  setDirectionsPanelOpen: (open) => set({ directionsPanelOpen: open }),
  
  // Camera state - Start zoomed in on Milky Way
  cameraPosition: [40, 20, 40], // Very close to Milky Way
  cameraTarget: [0, 0, 0], // Looking at Milky Way center
  setCameraPosition: (position) => set({ cameraPosition: position }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  
  // Camera animation state
  cameraAnimating: false,
  cameraAnimationStart: null,
  cameraAnimationEnd: null,
  cameraAnimationProgress: 0,
  cameraAnimationDuration: 2.0, // 2 seconds
  setCameraAnimating: (animating) => set({ cameraAnimating: animating }),
  setCameraAnimationTargets: (start, end) => set({
    cameraAnimationStart: start,
    cameraAnimationEnd: end,
    cameraAnimationProgress: 0,
    cameraAnimating: true,
  }),
  setCameraAnimationProgress: (progress) => set({ cameraAnimationProgress: progress }),
  
  // Orbit state
  isOrbiting: false,
  orbitTarget: null,
  orbitSpeed: 0.5,
  orbitDistance: 100,
  orbitAngle: 0,
  setIsOrbiting: (orbiting) => set({ isOrbiting: orbiting }),
  setOrbitTarget: (target) => set({ orbitTarget: target }),
  setOrbitAngle: (angle) => set({ orbitAngle: angle }),
  stopOrbit: () => set({ isOrbiting: false, orbitTarget: null }),
  
  // Start orbiting a galaxy (will begin after animation completes)
  startOrbit: (galaxy) => {
    if (!galaxy) return;
    
    const pos = galaxy.position_3d;
    
    // Calculate orbit distance with better scaling
    // For small galaxies (< 1 kpc): use minimum distance
    // For medium galaxies (1-10 kpc): scale linearly
    // For large galaxies (> 10 kpc): scale with diminishing factor
    let distance;
    const size = galaxy.size_estimate_kpc;
    
    if (size < 1) {
      // Ultra-faint dwarfs and small galaxies - close view
      distance = Math.max(size * 10, 15);
    } else if (size < 10) {
      // Medium dwarfs and irregulars - moderate distance
      distance = size * 5;
    } else if (size < 50) {
      // Larger galaxies - comfortable viewing distance
      distance = size * 3;
    } else {
      // Huge galaxies (Milky Way, Andromeda) - farther back
      distance = size * 2.5;
    }
    
    // Ensure minimum and maximum distances
    distance = Math.max(distance, 20);
    distance = Math.min(distance, 500);
    
    // Set orbit parameters (will start after animation)
    set({
      isOrbiting: false, // Don't start immediately - wait for animation
      orbitTarget: galaxy,
      orbitDistance: distance,
      orbitAngle: 0,
      cameraTarget: [pos.x, pos.y, pos.z],
    });
  },
  
  // Focus on a galaxy (move camera to it with animation)
  focusOnGalaxy: (galaxy) => {
    if (!galaxy) return;
    
    const state = get();
    const pos = galaxy.position_3d;
    
    // Use same distance calculation as orbit for consistency
    let distance;
    const size = galaxy.size_estimate_kpc;
    
    if (size < 1) {
      distance = Math.max(size * 10, 15);
    } else if (size < 10) {
      distance = size * 5;
    } else if (size < 50) {
      distance = size * 3;
    } else {
      distance = size * 2.5;
    }
    
    distance = Math.max(distance, 20);
    distance = Math.min(distance, 500);
    
    // Calculate the EXACT position where orbit will start (angle = 0)
    // This ensures smooth transition from animation to orbit
    const orbitStartAngle = 0;
    const targetPos = [
      pos.x + Math.cos(orbitStartAngle) * distance,
      pos.y + distance * 0.3, // Elevated view (matches orbit)
      pos.z + Math.sin(orbitStartAngle) * distance
    ];
    const targetLookAt = [pos.x, pos.y, pos.z];
    
    // Set up animation from current to target
    set({
      cameraAnimationStart: {
        position: [...state.cameraPosition],
        target: [...state.cameraTarget],
      },
      cameraAnimationEnd: {
        position: targetPos,
        target: targetLookAt,
      },
      cameraAnimationProgress: 0,
      cameraAnimating: true,
      selectedGalaxy: galaxy,
      infoPanelOpen: true,
    });
  },
}));

/**
 * Custom hooks for specific state slices
 */

// Get filtered and searched galaxies
export const useFilteredGalaxies = () => {
  const galaxies = useAppStore(state => state.galaxies);
  const searchQuery = useAppStore(state => state.searchQuery);
  const enabledTypes = useAppStore(state => state.enabledTypes);
  
  let filtered = galaxies;
  
  // Apply type filter based on enabled types
  filtered = filtered.filter(galaxy => {
    const type = galaxy.type.toLowerCase();
    
    // Determine which category this galaxy belongs to
    let category = null;
    
    if (type.startsWith('s') && !type.includes('sph') && !type.startsWith('se')) {
      category = 'Spiral';
    } else if (type.startsWith('e') && !type.startsWith('d')) {
      category = 'Elliptical';
    } else if (type.includes('irr')) {
      category = 'Irregular';
    } else if (type.includes('sph') || (type.startsWith('d') && type.includes('sph'))) {
      category = 'Dwarf Spheroidal';
    } else if (type.startsWith('de')) {
      category = 'Dwarf Elliptical';
    } else if (type === 'ce') {
      category = 'Compact Elliptical';
    }
    
    // Show galaxy if its category is enabled
    return category && enabledTypes[category];
  });
  
  // Apply search filter
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(galaxy => {
      if (galaxy.name.toLowerCase().includes(query)) return true;
      if (galaxy.alternate_names && galaxy.alternate_names.some(name => 
        name.toLowerCase().includes(query)
      )) return true;
      return false;
    });
  }
  
  return filtered;
};

// Get route information
export const useRouteInfo = () => {
  const routePath = useAppStore(state => state.routePath);
  const routeDistance = useAppStore(state => state.routeDistance);
  const speedProfile = useAppStore(state => state.speedProfile);
  
  const hasRoute = routePath.length >= 2;
  
  // Calculate travel time
  const distanceLy = routeDistance * 3260.47; // kpc to ly
  const travelTime = hasRoute ? distanceLy / speedProfile.fraction : 0;
  
  return {
    hasRoute,
    path: routePath,
    distance: routeDistance,
    travelTime,
    speedProfile,
  };
};

