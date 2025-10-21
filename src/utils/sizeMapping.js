import { GALAXY_MIN_SIZE, GALAXY_MAX_SIZE, GALAXY_SIZE_SCALE } from './constants';

/**
 * Calculate visual size for a galaxy based on its physical properties
 * @param {number} sizeKpc - Physical size in kiloparsecs
 * @param {number} distanceKpc - Distance from observer in kiloparsecs
 * @returns {number} Visual size for rendering
 */
export function calculateGalaxySize(sizeKpc, distanceKpc) {
  // Base size from physical size
  let visualSize = sizeKpc * GALAXY_SIZE_SCALE;
  
  // Ensure minimum visibility
  visualSize = Math.max(visualSize, GALAXY_MIN_SIZE);
  
  // Cap maximum size
  visualSize = Math.min(visualSize, GALAXY_MAX_SIZE);
  
  return visualSize;
}

/**
 * Calculate level of detail based on distance from camera
 * @param {number} distance - Distance from camera
 * @returns {number} LOD level (0 = highest detail, 3 = lowest)
 */
export function calculateLOD(distance) {
  if (distance < 100) return 0;
  if (distance < 500) return 1;
  if (distance < 1000) return 2;
  return 3;
}

/**
 * Should we render labels for this galaxy?
 * @param {number} distanceFromCamera - Distance from camera
 * @param {boolean} isSelected - Is this galaxy selected?
 * @returns {boolean}
 */
export function shouldRenderLabel(distanceFromCamera, isSelected) {
  // Always show label if selected
  if (isSelected) return true;
  
  // Show label if close enough
  return distanceFromCamera < 300;
}

