/**
 * Custom shaders for nebulous galaxy clouds
 */

export const galaxyVertexShader = `
  attribute float size;
  attribute vec3 color;
  
  varying vec3 vColor;
  varying float vDistance;
  
  void main() {
    vColor = color;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistance = -mvPosition.z;
    
    // Size attenuation with distance
    gl_PointSize = size * (300.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const galaxyFragmentShader = `
  uniform sampler2D pointTexture;
  uniform float opacity;
  
  varying vec3 vColor;
  varying float vDistance;
  
  void main() {
    // Circular gradient for soft particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Soft circular falloff
    float strength = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Add some variation for cloud-like appearance
    float variation = sin(dist * 20.0) * 0.1 + 0.9;
    strength *= variation;
    
    // Glow effect - multiple layers
    float glow1 = exp(-dist * 4.0);
    float glow2 = exp(-dist * 8.0);
    float finalGlow = (glow1 * 0.7 + glow2 * 0.3);
    
    // Combine for nebulous cloud effect
    float alpha = finalGlow * strength * opacity;
    
    // Color with glow
    vec3 finalColor = vColor * (1.0 + glow2 * 0.5);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// Alternative: Sprite-based cloud shader
export const cloudVertexShader = `
  attribute float size;
  attribute vec3 color;
  attribute float alpha;
  
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    vColor = color;
    vAlpha = alpha;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Dynamic size based on distance
    gl_PointSize = size * (400.0 / -mvPosition.z);
    
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const cloudFragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;
  
  void main() {
    // Create soft cloud-like particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center) * 2.0;
    
    // Multiple noise layers for cloud effect
    float noise1 = fract(sin(dot(gl_PointCoord, vec2(12.9898, 78.233))) * 43758.5453);
    float noise2 = fract(sin(dot(gl_PointCoord * 2.0, vec2(23.14069, 116.9898))) * 43758.5453);
    
    // Soft falloff with noise
    float strength = smoothstep(1.0, 0.0, dist);
    strength *= (0.8 + noise1 * 0.2);
    
    // Multi-layer glow for nebula effect
    float glow = exp(-dist * 2.0) * 0.6 + exp(-dist * 6.0) * 0.4;
    
    // Combine
    float finalAlpha = glow * strength * vAlpha;
    
    // Add brightness to center
    vec3 finalColor = vColor * (1.0 + glow * 0.8);
    
    if (finalAlpha < 0.01) discard;
    
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

