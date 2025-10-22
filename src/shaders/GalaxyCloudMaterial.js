import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float intensity;
  attribute float randomness;
  varying float vIntensity;
  varying float vRandomness;
  varying vec3 vColor;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uBrightness;
  uniform float uPointMultiplier;
  uniform float uMinSize;
  uniform float uTwinkleSpeed;

  void main() {
    vIntensity = intensity;
    vRandomness = randomness;
    vColor = color;

    vec3 displaced = position;
    float breathing = sin(uTime * 0.12 + randomness * 6.28318) * 0.4;
    displaced += normalize(position + 0.0001) * breathing * randomness * 0.4;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    float distance = max(1.0, -mvPosition.z);

    float flicker = sin(uTime * (0.25 + randomness * uTwinkleSpeed) + randomness * 9.0) * 0.1 + 0.9;
    float pointSize = size * uPointMultiplier * flicker / distance;

    gl_PointSize = max(uMinSize, pointSize);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vIntensity;
  varying float vRandomness;
  varying vec3 vColor;

  uniform float uOpacity;
  uniform float uBrightness;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = dot(uv, uv);

    float glow = exp(-dist * 3.5);
    float halo = exp(-dist * 1.1);
    float core = exp(-dist * 10.0);
    float intensity = mix(halo, glow, clamp(vIntensity, 0.0, 1.0));
    intensity = mix(intensity, core, clamp(vIntensity * 1.5, 0.0, 1.0));

    float alpha = pow(intensity, 1.0 + vIntensity * 0.8) * uOpacity;
    alpha *= mix(0.6, 1.2, vIntensity);

    if (alpha < 0.01) {
      discard;
    }

    vec3 color = vColor;
    color *= mix(0.65, 0.95, vIntensity);
    color += vec3(0.35, 0.38, 0.5) * pow(core, 3.0) * mix(0.08, 0.22, vIntensity);
    color *= uBrightness;

    gl_FragColor = vec4(color, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const GalaxyCloudMaterial = shaderMaterial(
  {
    uTime: 0,
    uOpacity: 0.75,
    uBrightness: 0.7,
    uPointMultiplier: 180.0,
    uMinSize: 1.0,
    uTwinkleSpeed: 1.2,
  },
  vertexShader,
  fragmentShader,
);

GalaxyCloudMaterial.key = `GalaxyCloudMaterial_${THREE.MathUtils.generateUUID()}`;

extend({ GalaxyCloudMaterial });
