// Galaxy type to color mapping
// Based on morphological classification

export const GALAXY_TYPE_COLORS = {
  // Elliptical galaxies
  'E0': '#0066FF',
  'E1': '#0066FF',
  'E2': '#0066FF',
  'E3': '#0066FF',
  'E4': '#0066FF',
  'E5': '#0066FF',
  'E6': '#0066FF',
  'E7': '#0066FF',
  
  // Spiral galaxies
  'S0': '#00FFFF',
  'Sa': '#00FFFF',
  'Sb': '#00FFFF',
  'Sc': '#00FFFF',
  'Sd': '#00FFFF',
  'SBa': '#00DDFF',
  'SBb': '#00DDFF',
  'SBbc': '#00DDFF',
  'SBc': '#00DDFF',
  'SBd': '#00DDFF',
  
  // Irregular galaxies
  'Irr': '#FF9900',
  'Irr I': '#FF9900',
  'Irr II': '#FF9900',
  'IrrB': '#FF9900',
  
  // Dwarf spheroidal
  'dSph': '#FF3333',
  'dSph/E': '#FF3333',
  
  // Dwarf elliptical
  'dE': '#FF69B4',
  'dE0': '#FF69B4',
  'dE1': '#FF69B4',
  'dE2': '#FF69B4',
  'dE3': '#FF69B4',
  
  // Compact elliptical
  'cE': '#9933FF',
  
  // Default fallback
  'default': '#FFFFFF',
};

/**
 * Get color for a galaxy type
 * @param {string} type - Galaxy morphological type
 * @returns {string} Hex color code
 */
export function getGalaxyColor(type) {
  if (!type) return GALAXY_TYPE_COLORS.default;
  
  // Direct match
  if (GALAXY_TYPE_COLORS[type]) {
    return GALAXY_TYPE_COLORS[type];
  }
  
  // Partial matching for variations
  const normalizedType = type.toUpperCase();
  
  if (normalizedType.startsWith('E')) return GALAXY_TYPE_COLORS.E0;
  if (normalizedType.includes('SPH')) return GALAXY_TYPE_COLORS.dSph;
  if (normalizedType.startsWith('D') && normalizedType.includes('E')) return GALAXY_TYPE_COLORS.dE;
  if (normalizedType.includes('IRR')) return GALAXY_TYPE_COLORS.Irr;
  if (normalizedType.startsWith('S')) return GALAXY_TYPE_COLORS.Sa;
  
  return GALAXY_TYPE_COLORS.default;
}

/**
 * Get galaxy type category for legend
 */
export const GALAXY_CATEGORIES = [
  { type: 'Spiral', color: '#00FFFF', example: 'Sb, Sc, SBbc' },
  { type: 'Elliptical', color: '#0066FF', example: 'E0-E7' },
  { type: 'Irregular', color: '#FF9900', example: 'Irr I/II' },
  { type: 'Dwarf Spheroidal', color: '#FF3333', example: 'dSph' },
  { type: 'Dwarf Elliptical', color: '#FF69B4', example: 'dE' },
  { type: 'Compact Elliptical', color: '#9933FF', example: 'cE' },
];

