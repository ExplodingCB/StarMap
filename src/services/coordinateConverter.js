/**
 * Coordinate conversion utilities
 */

/**
 * Parse RA string to degrees
 * @param {string} ra - Right Ascension in HH:MM:SS format
 * @returns {number} RA in degrees
 */
export function parseRAToDegreesFromString(ra) {
  const parts = ra.split(':');
  const hours = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1] || 0);
  const seconds = parseFloat(parts[2] || 0);
  return (hours + minutes / 60 + seconds / 3600) * 15;
}

/**
 * Parse Dec string to degrees
 * @param {string} dec - Declination in +/-DD:MM:SS format
 * @returns {number} Dec in degrees
 */
export function parseDecToDegreesFromString(dec) {
  const sign = dec[0] === '-' ? -1 : 1;
  const parts = dec.replace(/^[+-]/, '').split(':');
  const degrees = parseFloat(parts[0]);
  const minutes = parseFloat(parts[1] || 0);
  const seconds = parseFloat(parts[2] || 0);
  return sign * (degrees + minutes / 60 + seconds / 3600);
}

/**
 * Convert equatorial coordinates to Cartesian
 * @param {number} raDeg - Right Ascension in degrees
 * @param {number} decDeg - Declination in degrees
 * @param {number} distanceKpc - Distance in kiloparsecs
 * @returns {Object} {x, y, z} in kpc
 */
export function equatorialToCartesian(raDeg, decDeg, distanceKpc) {
  const raRad = (raDeg * Math.PI) / 180;
  const decRad = (decDeg * Math.PI) / 180;
  
  const x = distanceKpc * Math.cos(decRad) * Math.cos(raRad);
  const y = distanceKpc * Math.cos(decRad) * Math.sin(raRad);
  const z = distanceKpc * Math.sin(decRad);
  
  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    z: Math.round(z * 100) / 100,
  };
}

/**
 * Convert Cartesian to equatorial coordinates
 * @param {number} x - X coordinate in kpc
 * @param {number} y - Y coordinate in kpc
 * @param {number} z - Z coordinate in kpc
 * @returns {Object} {raDeg, decDeg, distance}
 */
export function cartesianToEquatorial(x, y, z) {
  const distance = Math.sqrt(x * x + y * y + z * z);
  const decRad = Math.asin(z / distance);
  const raRad = Math.atan2(y, x);
  
  return {
    raDeg: (raRad * 180) / Math.PI,
    decDeg: (decRad * 180) / Math.PI,
    distance,
  };
}

/**
 * Format RA in degrees to HH:MM:SS string
 * @param {number} raDeg - RA in degrees
 * @returns {string} Formatted RA string
 */
export function formatRA(raDeg) {
  const hours = raDeg / 15;
  const h = Math.floor(hours);
  const minutes = (hours - h) * 60;
  const m = Math.floor(minutes);
  const s = Math.floor((minutes - m) * 60);
  
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Format Dec in degrees to +/-DD:MM:SS string
 * @param {number} decDeg - Dec in degrees
 * @returns {string} Formatted Dec string
 */
export function formatDec(decDeg) {
  const sign = decDeg >= 0 ? '+' : '-';
  const absDec = Math.abs(decDeg);
  const d = Math.floor(absDec);
  const minutes = (absDec - d) * 60;
  const m = Math.floor(minutes);
  const s = Math.floor((minutes - m) * 60);
  
  return `${sign}${String(d).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

