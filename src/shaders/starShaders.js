/**
 * Custom shaders for star rendering with glow effects
 */

export const starVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const starFragmentShader = `
  uniform vec3 glowColor;
  uniform float glowIntensity;
  
  varying vec3 vNormal;
  varying vec3 vPositionNormal;
  
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vPositionNormal), 2.0);
    vec3 glow = glowColor * intensity * glowIntensity;
    gl_FragColor = vec4(glow, 1.0);
  }
`;

// Point sprite shader for distant stars
export const starPointVertexShader = `
  attribute float size;
  attribute vec3 customColor;
  
  varying vec3 vColor;
  
  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starPointFragmentShader = `
  varying vec3 vColor;
  
  void main() {
    // Create circular point with smooth edges
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    if (dist > 0.5) {
      discard;
    }
    
    // Soft glow effect
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    vec3 glow = vColor * (1.0 + alpha * 0.5);
    
    gl_FragColor = vec4(glow, alpha);
  }
`;

/**
 * Get color based on spectral type
 */
export function getSpectralColor(spectralType) {
  if (!spectralType) return '#FFFFFF';
  
  const type = spectralType.charAt(0).toUpperCase();
  
  const colorMap = {
    'O': '#9BB0FF',  // Blue
    'B': '#AABFFF',  // Blue-white
    'A': '#CAD7FF',  // White
    'F': '#F8F7FF',  // Yellow-white
    'G': '#FFF4EA',  // Yellow (like our Sun)
    'K': '#FFD2A1',  // Orange
    'M': '#FFCC6F',  // Red-orange
    'L': '#FF4500',  // Brown dwarf
    'T': '#8B0000',  // Brown dwarf
    'D': '#FFFFFF',  // White dwarf
  };
  
  return colorMap[type] || '#FFFFFF';
}

