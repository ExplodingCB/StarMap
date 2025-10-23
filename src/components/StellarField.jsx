import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSpectralColor } from '../shaders/starShaders';
import { MW_LOD_STELLAR_MIN, MW_LOD_STELLAR_MAX } from '../utils/constants';

/**
 * Stellar field component - renders many stars as points for performance
 * LOD Level 2: Shows stars when camera is 10-100 kpc from Milky Way center
 */
export function StellarField({ stars, cameraPosition }) {
  const pointsRef = useRef();
  
  if (!stars || stars.length === 0) {
    return null;
  }
  
  // Calculate distance from camera to Milky Way center (0, 0, 0)
  const distanceFromCenter = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0], 2) +
    Math.pow(cameraPosition[1], 2) +
    Math.pow(cameraPosition[2], 2)
  ) : 1000;
  
  // Only render at appropriate LOD level
  const shouldRender = distanceFromCenter >= MW_LOD_STELLAR_MIN && 
                       distanceFromCenter <= MW_LOD_STELLAR_MAX;
  
  // Calculate opacity for smooth fade-in/out
  const opacity = useMemo(() => {
    if (distanceFromCenter > MW_LOD_STELLAR_MAX) return 0;
    if (distanceFromCenter < MW_LOD_STELLAR_MIN) return 0;
    
    // Fade in from MAX
    if (distanceFromCenter > MW_LOD_STELLAR_MAX * 0.8) {
      const fadeRange = MW_LOD_STELLAR_MAX * 0.2;
      const fadeProgress = (MW_LOD_STELLAR_MAX - distanceFromCenter) / fadeRange;
      return Math.max(0, Math.min(1, fadeProgress));
    }
    
    // Fade out to MIN
    if (distanceFromCenter < MW_LOD_STELLAR_MIN * 2) {
      const fadeRange = MW_LOD_STELLAR_MIN;
      const fadeProgress = (distanceFromCenter - MW_LOD_STELLAR_MIN) / fadeRange;
      return Math.max(0, Math.min(1, fadeProgress));
    }
    
    return 1;
  }, [distanceFromCenter]);
  
  // Prepare star data for instanced rendering
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 3);
    const sizes = new Float32Array(stars.length);
    
    stars.forEach((star, i) => {
      // Position
      positions[i * 3] = star.position_3d.x;
      positions[i * 3 + 1] = star.position_3d.y;
      positions[i * 3 + 2] = star.position_3d.z;
      
      // Color based on spectral type
      const colorHex = star.color || getSpectralColor(star.spectralType);
      const color = new THREE.Color(colorHex);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Size based on absolute magnitude
      // Brighter stars (lower magnitude) = larger size
      const baseSizeFromMagnitude = Math.pow(2.512, -star.absoluteMagnitude / 2.5) * 5;
      sizes[i] = Math.max(1, Math.min(10, baseSizeFromMagnitude));
    });
    
    return { positions, colors, sizes };
  }, [stars]);
  
  // Gentle twinkling animation
  useFrame((state) => {
    if (pointsRef.current && pointsRef.current.material) {
      // Subtle opacity variation for twinkling effect
      const twinkle = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 0.9;
      pointsRef.current.material.opacity = opacity * twinkle;
    }
  });
  
  if (!shouldRender || opacity < 0.01) {
    return null;
  }
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={3}
        vertexColors
        transparent
        opacity={opacity}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

