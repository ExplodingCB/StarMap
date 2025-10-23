import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Planet } from './Planet';
import { useAppStore } from '../store/appState';
import { MW_LOD_PLANET_MIN, MW_LOD_PLANET_MAX } from '../utils/constants';

/**
 * Solar System component with Sun and planets
 */
export function SolarSystem({ solarSystem, cameraPosition }) {
  const sunRef = useRef();
  
  if (!solarSystem || !solarSystem.planets) {
    return null;
  }
  
  const sunPos = solarSystem.position;
  
  // Calculate distance from camera to solar system
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - sunPos.x, 2) +
    Math.pow(cameraPosition[1] - sunPos.y, 2) +
    Math.pow(cameraPosition[2] - sunPos.z, 2)
  ) : 1000;
  
  // Only render when camera is VERY close (LOD level 4)
  // Changed to be much more restrictive to avoid rendering at wrong scales
  const shouldRenderPlanets = distanceFromCamera < 0.5; // Only render within 0.5 kpc
  
  // Calculate opacity for smooth fade-in
  const opacity = useMemo(() => {
    if (distanceFromCamera > MW_LOD_PLANET_MAX) return 0;
    if (distanceFromCamera < MW_LOD_PLANET_MIN) return 1;
    
    // Fade in between MAX and MIN
    const fadeRange = MW_LOD_PLANET_MAX - MW_LOD_PLANET_MIN;
    const fadeProgress = (MW_LOD_PLANET_MAX - distanceFromCamera) / fadeRange;
    return Math.max(0, Math.min(1, fadeProgress));
  }, [distanceFromCamera]);
  
  // Sun size (scaled for visibility)
  const sunRadius = 0.001; // Sun is tiny at this scale
  
  // Gentle rotation for Sun
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });
  
  if (opacity < 0.01) {
    return null; // Don't render if not visible
  }
  
  return (
    <group position={[sunPos.x, sunPos.y, sunPos.z]}>
      {/* The Sun */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[sunRadius, 32, 32]} />
        <meshBasicMaterial
          color={solarSystem.star.color}
          emissive={solarSystem.star.color}
          emissiveIntensity={1.5}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Sun glow */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[sunRadius, 16, 16]} />
        <meshBasicMaterial
          color={solarSystem.star.color}
          transparent
          opacity={opacity * 0.5}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[sunRadius, 16, 16]} />
        <meshBasicMaterial
          color={solarSystem.star.color}
          transparent
          opacity={opacity * 0.25}
        />
      </mesh>
      
      {/* Point light from Sun */}
      <pointLight
        color={solarSystem.star.color}
        intensity={opacity * 2}
        distance={0.1}
        decay={2}
      />
      
      {/* Planets (orbital paths disabled for now to prevent rendering issues) */}
      {shouldRenderPlanets && solarSystem.planets.map((planet) => (
        <group key={planet.id}>
          {/* Orbital path - only show when VERY close to prevent artifacts */}
          {distanceFromCamera < 0.05 && (
            <OrbitPath
              radius={planet.semiMajorAxis}
              color={planet.color}
              opacity={opacity * 0.3}
            />
          )}
          
          {/* Planet */}
          <Planet
            planet={planet}
            cameraPosition={cameraPosition}
          />
        </group>
      ))}
    </group>
  );
}

/**
 * Orbital path component (circle representing orbit)
 * Using Points instead of Line for better compatibility
 */
function OrbitPath({ radius, color, opacity }) {
  const points = useMemo(() => {
    const pointsArray = [];
    const segments = 128;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pointsArray.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        )
      );
    }
    
    return pointsArray;
  }, [radius]);
  
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);
  
  // Don't render if opacity is too low or radius is too small
  if (opacity < 0.01 || radius < 0.00001) {
    return null;
  }
  
  return (
    <points geometry={geometry} rotation={[Math.PI / 2, 0, 0]}>
      <pointsMaterial
        color={color}
        transparent
        opacity={opacity}
        size={0.00005}
        sizeAttenuation={false}
      />
    </points>
  );
}

