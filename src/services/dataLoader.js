/**
 * Data loading service for galaxy, star, and solar system data
 */

import { raDecDistToCartesian, lightYearsToKpc, getSunPosition } from './stellarCoordinates';

let galaxiesCache = null;
let metadataCache = null;
let starsCache = null;
let solarSystemCache = null;

/**
 * Load galaxy data from JSON file
 * @returns {Promise<Array>} Array of galaxy objects
 */
export async function loadGalaxies() {
  if (galaxiesCache) {
    return galaxiesCache;
  }
  
  try {
    const response = await fetch('/data/galaxies.json');
    if (!response.ok) {
      throw new Error(`Failed to load galaxies: ${response.statusText}`);
    }
    galaxiesCache = await response.json();
    return galaxiesCache;
  } catch (error) {
    console.error('Error loading galaxy data:', error);
    throw error;
  }
}

/**
 * Load metadata about the dataset
 * @returns {Promise<Object>} Metadata object
 */
export async function loadMetadata() {
  if (metadataCache) {
    return metadataCache;
  }
  
  try {
    const response = await fetch('/data/metadata.json');
    if (!response.ok) {
      throw new Error(`Failed to load metadata: ${response.statusText}`);
    }
    metadataCache = await response.json();
    return metadataCache;
  } catch (error) {
    console.error('Error loading metadata:', error);
    throw error;
  }
}

/**
 * Find galaxy by ID
 * @param {string} id - Galaxy ID
 * @returns {Promise<Object|null>} Galaxy object or null
 */
export async function findGalaxyById(id) {
  const galaxies = await loadGalaxies();
  return galaxies.find(g => g.id === id) || null;
}

/**
 * Find galaxy by name (fuzzy search)
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching galaxies
 */
export async function searchGalaxies(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const galaxies = await loadGalaxies();
  const lowerQuery = query.toLowerCase();
  
  return galaxies.filter(galaxy => {
    // Search in main name
    if (galaxy.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in alternate names
    if (galaxy.alternate_names && galaxy.alternate_names.length > 0) {
      return galaxy.alternate_names.some(name => 
        name.toLowerCase().includes(lowerQuery)
      );
    }
    
    return false;
  });
}

/**
 * Filter galaxies by type
 * @param {string[]} types - Array of types to include
 * @returns {Promise<Array>} Filtered galaxies
 */
export async function filterGalaxiesByType(types) {
  if (!types || types.length === 0) {
    return loadGalaxies();
  }
  
  const galaxies = await loadGalaxies();
  const typeSet = new Set(types.map(t => t.toLowerCase()));
  
  return galaxies.filter(galaxy => {
    const galaxyType = galaxy.type.toLowerCase();
    
    // Direct match
    if (typeSet.has(galaxyType)) {
      return true;
    }
    
    // Category matching
    for (const type of typeSet) {
      if (type === 'spiral' && galaxyType.startsWith('s')) return true;
      if (type === 'elliptical' && galaxyType.startsWith('e')) return true;
      if (type === 'irregular' && galaxyType.includes('irr')) return true;
      if (type === 'dwarf' && galaxyType.startsWith('d')) return true;
    }
    
    return false;
  });
}

/**
 * Get statistics about the galaxy dataset
 * @returns {Promise<Object>} Statistics object
 */
export async function getStatistics() {
  const galaxies = await loadGalaxies();
  
  const distances = galaxies
    .map(g => g.distance_kpc)
    .filter(d => d > 0);
  
  const types = {};
  galaxies.forEach(g => {
    types[g.type] = (types[g.type] || 0) + 1;
  });
  
  return {
    total: galaxies.length,
    minDistance: Math.min(...distances),
    maxDistance: Math.max(...distances),
    avgDistance: distances.reduce((a, b) => a + b, 0) / distances.length,
    typeDistribution: types,
  };
}

/**
 * Load star catalog from JSON file and convert coordinates
 * @returns {Promise<Array>} Array of star objects with 3D positions
 */
export async function loadStarCatalog() {
  if (starsCache) {
    return starsCache;
  }
  
  try {
    const response = await fetch('/data/nearby_stars.json');
    if (!response.ok) {
      throw new Error(`Failed to load stars: ${response.statusText}`);
    }
    const stars = await response.json();
    
    // Convert coordinates for each star
    starsCache = stars.map(star => {
      if (star.isSolarSystem) {
        // Solar System is at Sun's position
        const sunPos = getSunPosition();
        return {
          ...star,
          distance_kpc: 0,
          position_3d: sunPos
        };
      }
      
      // Convert RA/Dec to galactocentric Cartesian coordinates
      const distanceKpc = lightYearsToKpc(star.distance_ly);
      const position = raDecDistToCartesian(star.ra, star.dec, distanceKpc);
      
      return {
        ...star,
        distance_kpc: distanceKpc,
        position_3d: position
      };
    });
    
    return starsCache;
  } catch (error) {
    console.error('Error loading star catalog:', error);
    throw error;
  }
}

/**
 * Load Solar System configuration
 * @returns {Promise<Object>} Solar System object with planets
 */
export async function loadSolarSystem() {
  if (solarSystemCache) {
    return solarSystemCache;
  }
  
  try {
    const response = await fetch('/data/solar_system.json');
    if (!response.ok) {
      throw new Error(`Failed to load solar system: ${response.statusText}`);
    }
    solarSystemCache = await response.json();
    
    // Calculate 3D positions for planets relative to Solar System position
    const sunPos = getSunPosition();
    
    // Add position data to each planet (relative to Sun)
    solarSystemCache.planets = solarSystemCache.planets.map((planet, index) => {
      // Simple orbital positioning (can be enhanced later)
      const angle = (index / solarSystemCache.planets.length) * 2 * Math.PI;
      const distance = planet.semiMajorAxis;
      
      return {
        ...planet,
        position_3d: {
          x: sunPos.x + distance * Math.cos(angle),
          y: sunPos.y,
          z: sunPos.z + distance * Math.sin(angle)
        }
      };
    });
    
    return solarSystemCache;
  } catch (error) {
    console.error('Error loading solar system:', error);
    throw error;
  }
}

/**
 * Search stars by name
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching stars
 */
export async function searchStars(query) {
  if (!query || query.trim() === '') {
    return [];
  }
  
  const stars = await loadStarCatalog();
  const lowerQuery = query.toLowerCase();
  
  return stars.filter(star => {
    if (star.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    if (star.properName && star.properName.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    return false;
  });
}

