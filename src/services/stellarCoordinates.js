/**
 * Stellar coordinate transformation utilities
 * Converts between different astronomical coordinate systems
 */

// Constants
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// Galactic coordinate system constants
// North Galactic Pole (J2000)
const NGP_RA = 192.859508 * DEG_TO_RAD;  // 12h 51m 26.28s
const NGP_DEC = 27.128336 * DEG_TO_RAD;  // +27° 07' 42.0"
const GALACTIC_CENTER_RA = 266.405 * DEG_TO_RAD; // 17h 45m 37.2s

// Sun's position relative to galactic center
const SUN_GALACTIC_X = 8.0; // kpc, in the direction of galactic center
const SUN_GALACTIC_Y = 0.0; // kpc
const SUN_GALACTIC_Z = 0.02; // kpc, slightly above galactic plane

/**
 * Convert Right Ascension and Declination to Galactic Coordinates
 * @param {number} ra - Right Ascension in degrees
 * @param {number} dec - Declination in degrees
 * @returns {Object} { l: galactic longitude (deg), b: galactic latitude (deg) }
 */
export function raDecToGalactic(ra, dec) {
  // Convert to radians
  const raRad = ra * DEG_TO_RAD;
  const decRad = dec * DEG_TO_RAD;
  
  // Calculate galactic longitude (l)
  const sinB = Math.sin(decRad) * Math.sin(NGP_DEC) + 
               Math.cos(decRad) * Math.cos(NGP_DEC) * Math.cos(raRad - NGP_RA);
  
  const b = Math.asin(sinB);
  
  const y = Math.cos(decRad) * Math.sin(raRad - NGP_RA);
  const x = Math.sin(decRad) * Math.cos(NGP_DEC) - 
            Math.cos(decRad) * Math.sin(NGP_DEC) * Math.cos(raRad - NGP_RA);
  
  let l = Math.atan2(y, x) + GALACTIC_CENTER_RA;
  
  // Normalize l to [0, 2π]
  if (l < 0) l += 2 * Math.PI;
  if (l >= 2 * Math.PI) l -= 2 * Math.PI;
  
  return {
    l: l * RAD_TO_DEG,
    b: b * RAD_TO_DEG
  };
}

/**
 * Convert Galactic Coordinates to Cartesian (centered on galactic center)
 * @param {number} l - Galactic longitude in degrees
 * @param {number} b - Galactic latitude in degrees
 * @param {number} distance - Distance in kiloparsecs
 * @param {boolean} fromSun - If true, treats input as relative to Sun; if false, relative to galactic center
 * @returns {Object} { x, y, z } in kpc, centered on galactic center
 */
export function galacticToCartesian(l, b, distance, fromSun = true) {
  const lRad = l * DEG_TO_RAD;
  const bRad = b * DEG_TO_RAD;
  
  // Convert to Cartesian coordinates relative to observer (Sun or galactic center)
  const x = distance * Math.cos(bRad) * Math.cos(lRad);
  const y = distance * Math.cos(bRad) * Math.sin(lRad);
  const z = distance * Math.sin(bRad);
  
  if (fromSun) {
    // Transform from heliocentric to galactocentric
    // In galactic coordinates: Sun is at l=0, at distance SUN_GALACTIC_X from center
    return {
      x: SUN_GALACTIC_X - x, // Flip direction: toward galactic center is negative X
      y: y,
      z: z + SUN_GALACTIC_Z
    };
  }
  
  return { x, y, z };
}

/**
 * Convert RA/Dec and distance directly to Cartesian (galactocentric)
 * @param {number} ra - Right Ascension in degrees
 * @param {number} dec - Declination in degrees
 * @param {number} distance - Distance in kiloparsecs
 * @returns {Object} { x, y, z } in kpc, centered on galactic center
 */
export function raDecDistToCartesian(ra, dec, distance) {
  const galactic = raDecToGalactic(ra, dec);
  return galacticToCartesian(galactic.l, galactic.b, distance, true);
}

/**
 * Get Sun's position in galactocentric coordinates
 * @returns {Object} { x, y, z } in kpc
 */
export function getSunPosition() {
  return {
    x: SUN_GALACTIC_X,
    y: SUN_GALACTIC_Y,
    z: SUN_GALACTIC_Z
  };
}

/**
 * Convert parsecs to kiloparsecs
 * @param {number} parsecs - Distance in parsecs
 * @returns {number} Distance in kiloparsecs
 */
export function parsecsToKpc(parsecs) {
  return parsecs / 1000;
}

/**
 * Convert light-years to kiloparsecs
 * @param {number} lightYears - Distance in light-years
 * @returns {number} Distance in kiloparsecs
 */
export function lightYearsToKpc(lightYears) {
  return lightYears / 3260.47;
}

