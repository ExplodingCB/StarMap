import { KPC_TO_LIGHTYEARS, DEFAULT_SPEED } from '../utils/constants';

/**
 * Calculate Euclidean distance between two 3D points
 * @param {Object} pos1 - {x, y, z}
 * @param {Object} pos2 - {x, y, z}
 * @returns {number} Distance in kpc
 */
export function calculateDistance(pos1, pos2) {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const dz = pos2.z - pos1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Convert distance in kpc to light-years
 * @param {number} distanceKpc - Distance in kiloparsecs
 * @returns {number} Distance in light-years
 */
export function kpcToLightYears(distanceKpc) {
  return distanceKpc * KPC_TO_LIGHTYEARS;
}

/**
 * Calculate travel time between two points
 * @param {number} distanceKpc - Distance in kiloparsecs
 * @param {number} speedFraction - Speed as fraction of light speed (0.1 = 10%)
 * @returns {number} Travel time in years
 */
export function calculateTravelTime(distanceKpc, speedFraction = DEFAULT_SPEED.fraction) {
  const distanceLy = kpcToLightYears(distanceKpc);
  return distanceLy / speedFraction;
}

/**
 * Format large numbers in human-readable format
 * @param {number} num - Number to format
 * @returns {string} Formatted string
 */
export function formatLargeNumber(num) {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)} billion`;
  } else if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)} million`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)} thousand`;
  }
  return num.toFixed(2);
}

/**
 * Format travel time in human-readable format
 * @param {number} years - Time in years
 * @returns {string} Formatted string
 */
export function formatTravelTime(years) {
  if (years >= 1e9) {
    return `${(years / 1e9).toFixed(2)} billion years`;
  } else if (years >= 1e6) {
    return `${(years / 1e6).toFixed(2)} million years`;
  } else if (years >= 1e3) {
    return `${(years / 1e3).toFixed(2)} thousand years`;
  }
  return `${years.toFixed(0)} years`;
}

/**
 * Format distance in human-readable format
 * @param {number} distanceKpc - Distance in kpc
 * @returns {string} Formatted string
 */
export function formatDistance(distanceKpc) {
  if (distanceKpc < 1) {
    return `${distanceKpc.toFixed(2)} kpc`;
  } else if (distanceKpc < 1000) {
    return `${distanceKpc.toFixed(1)} kpc`;
  } else {
    return `${(distanceKpc / 1000).toFixed(2)} Mpc`;
  }
}

/**
 * Calculate total route distance
 * @param {Array} waypoints - Array of galaxy objects with position_3d
 * @returns {number} Total distance in kpc
 */
export function calculateRouteDistance(waypoints) {
  if (waypoints.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(
      waypoints[i].position_3d,
      waypoints[i + 1].position_3d
    );
  }
  
  return totalDistance;
}

/**
 * Calculate route travel time
 * @param {Array} waypoints - Array of galaxy objects with position_3d
 * @param {number} speedFraction - Speed as fraction of light speed
 * @returns {number} Total travel time in years
 */
export function calculateRouteTravelTime(waypoints, speedFraction = DEFAULT_SPEED.fraction) {
  const distance = calculateRouteDistance(waypoints);
  return calculateTravelTime(distance, speedFraction);
}

