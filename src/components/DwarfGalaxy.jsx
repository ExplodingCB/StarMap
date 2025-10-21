import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getGalaxyColor } from '../utils/colorMapping';
import { shouldRenderLabel } from '../utils/sizeMapping';
import { useAppStore } from '../store/appState';
import * as THREE from 'three';

/**
 * Dwarf galaxy particle system with random orientation
 * For dSph, dE, and other small galaxies
 */
export function DwarfGalaxy({ galaxy, cameraPosition }) {
  const particlesRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const selectedGalaxy = useAppStore(state => state.selectedGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  const setHoveredGalaxy = useAppStore(state => state.setHoveredGalaxy);
  const showLabels = useAppStore(state => state.showLabels);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const startOrbit = useAppStore(state => state.startOrbit);
  
  const isSelected = selectedGalaxy?.id === galaxy.id;
  
  // Galaxy parameters - adjusted for better visual spread
  const galaxyRadius = Math.max(galaxy.size_estimate_kpc * 0.3, 2); // Larger radius for better spread
  const particleCount = Math.min(Math.floor(galaxy.size_estimate_kpc * 80), 2000); // More particles but capped lower
  
  // Generate random orientation for this galaxy (seeded by galaxy ID for consistency)
  const { rotation, positions, colors, sizes } = useMemo(() => {
    // Use galaxy ID as seed for consistent random rotation
    const seed = galaxy.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (n) => {
      const x = Math.sin(seed + n) * 10000;
      return x - Math.floor(x);
    };
    
    // Random rotation angles (in radians)
    const rotation = {
      x: seededRandom(1) * Math.PI * 2,
      y: seededRandom(2) * Math.PI * 2,
      z: seededRandom(3) * Math.PI * 2,
    };
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const baseColor = new THREE.Color(getGalaxyColor(galaxy.type));
    const innerColor = new THREE.Color('#ffffdd');
    const outerColor = new THREE.Color(getGalaxyColor(galaxy.type)).multiplyScalar(0.4);
    
    // Determine distribution shape based on galaxy type
    let distribution = 'spheroidal'; // default
    let flatteningFactor = 1.0;
    
    if (galaxy.type.toLowerCase().includes('sph')) {
      // Dwarf spheroidal - slightly flattened sphere
      distribution = 'spheroidal';
      flatteningFactor = 0.6; // Flatten along y-axis
    } else if (galaxy.type.toLowerCase().includes('de')) {
      // Dwarf elliptical - more spherical
      distribution = 'elliptical';
      flatteningFactor = 0.8;
    } else if (galaxy.type.toLowerCase().includes('irr')) {
      // Irregular - very chaotic
      distribution = 'irregular';
      flatteningFactor = 0.5;
    }
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Generate position based on distribution type
      let x, y, z, radius;
      
      if (distribution === 'irregular') {
        // Very random, chaotic distribution - more spread out
        radius = Math.pow(Math.random(), 1.2) * galaxyRadius; // Less concentrated
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta) * flatteningFactor;
        z = radius * Math.cos(phi);
        
        // Add extra randomness for messy appearance
        x += (Math.random() - 0.5) * galaxyRadius * 0.6;
        y += (Math.random() - 0.5) * galaxyRadius * 0.6;
        z += (Math.random() - 0.5) * galaxyRadius * 0.6;
      } else {
        // Spheroidal/elliptical - more spread out, less clumped
        radius = Math.pow(Math.random(), 1.5) * galaxyRadius; // Less concentrated than before
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        x = radius * Math.sin(phi) * Math.cos(theta);
        y = radius * Math.sin(phi) * Math.sin(theta) * flatteningFactor;
        z = radius * Math.cos(phi);
        
        // More randomness for better spread
        const randomFactor = 0.25; // Increased from 0.15
        x += (Math.random() - 0.5) * galaxyRadius * randomFactor;
        y += (Math.random() - 0.5) * galaxyRadius * randomFactor;
        z += (Math.random() - 0.5) * galaxyRadius * randomFactor;
      }
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Calculate normalized radius for color
      const actualRadius = Math.sqrt(x * x + y * y + z * z);
      const normalizedRadius = Math.min(actualRadius / galaxyRadius, 1);
      
      // Color gradient from bright center to dim edge
      const mixedColor = innerColor.clone();
      if (normalizedRadius < 0.5) {
        mixedColor.lerp(baseColor, normalizedRadius / 0.5);
      } else {
        mixedColor.copy(baseColor);
        mixedColor.lerp(outerColor, (normalizedRadius - 0.5) / 0.5);
      }
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      // Size varies with distance from center - more variation
      sizes[i] = Math.max(0.1, (1 - normalizedRadius) * 2 + Math.random() * 0.5);
    }
    
    return { rotation, positions, colors, sizes };
  }, [particleCount, galaxyRadius, galaxy.type, galaxy.id]);
  
  // Calculate distance from camera
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - galaxy.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - galaxy.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - galaxy.position_3d.z, 2)
  ) : 1000;
  
  const showLabel = showLabels && shouldRenderLabel(distanceFromCamera, isSelected);
  
  // Very gentle rotation animation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.01;
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedGalaxy(galaxy);
    setInfoPanelOpen(true);
    focusOnGalaxy(galaxy);
    startOrbit(galaxy);
  };
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredGalaxy(galaxy);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    setHoveredGalaxy(null);
    document.body.style.cursor = 'auto';
  };
  
  return (
    <group 
      position={[galaxy.position_3d.x, galaxy.position_3d.y, galaxy.position_3d.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Apply random rotation to the entire galaxy */}
      <group
        ref={groupRef}
        rotation={[rotation.x, rotation.y, rotation.z]}
      >
        {/* Particle system */}
        <points ref={particlesRef}>
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
          size={0.3}
          vertexColors
          transparent
          opacity={isSelected || hovered ? 0.9 : 0.7}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.001}
        />
        </points>
        
        {/* Small central core */}
        <mesh>
          <sphereGeometry args={[galaxyRadius * 0.1, 12, 12]} />
          <meshStandardMaterial
            color={getGalaxyColor(galaxy.type)}
            emissive={getGalaxyColor(galaxy.type)}
            emissiveIntensity={isSelected || hovered ? 0.8 : 0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        {/* Subtle glow */}
        <mesh>
          <sphereGeometry args={[galaxyRadius * 0.15, 12, 12]} />
          <meshBasicMaterial
            color={getGalaxyColor(galaxy.type)}
            transparent
            opacity={isSelected || hovered ? 0.25 : 0.15}
          />
        </mesh>
      </group>
      
      {/* Selection ring (outside the rotated group so it stays horizontal) */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[galaxyRadius * 1.3, galaxyRadius * 1.4, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Label - billboarded to always face camera (outside rotation) */}
      {showLabel && (
        <Text
          position={[0, galaxyRadius * 1.8, 0]}
          fontSize={Math.max(galaxyRadius * 0.8, 1.5)}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.15}
          outlineColor="#000000"
          outlineOpacity={0.8}
          fillOpacity={1}
        >
          {galaxy.name}
        </Text>
      )}
    </group>
  );
}

