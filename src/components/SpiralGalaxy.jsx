import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getGalaxyColor } from '../utils/colorMapping';
import { shouldRenderLabel } from '../utils/sizeMapping';
import { useAppStore } from '../store/appState';
import * as THREE from 'three';
import { GalaxyCloudMaterial } from '../shaders/GalaxyCloudMaterial';

/**
 * Procedural spiral galaxy particle system
 * Based on logarithmic spiral equations
 */
export function SpiralGalaxy({ galaxy, cameraPosition }) {
  const particlesRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const selectedGalaxy = useAppStore(state => state.selectedGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  const setHoveredGalaxy = useAppStore(state => state.setHoveredGalaxy);
  const showLabels = useAppStore(state => state.showLabels);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const startOrbit = useAppStore(state => state.startOrbit);
  
  const isSelected = selectedGalaxy?.id === galaxy.id;
  
  // Galaxy parameters based on size and type - optimized for cloud-like appearance
  const galaxyRadius = galaxy.size_estimate_kpc * 0.15;
  const particleCount = Math.min(Math.floor(galaxy.size_estimate_kpc * 200), 25000); // More particles for cloud effect
  
  // Generate spiral galaxy particle positions
  const { positions, colors, sizes, intensities, randomness } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const intensities = new Float32Array(particleCount);
    const randomSeeds = new Float32Array(particleCount);
    
    const baseColor = new THREE.Color(getGalaxyColor(galaxy.type));
    const innerColor = new THREE.Color('#ffffee');
    const midColor = new THREE.Color(getGalaxyColor(galaxy.type));
    const outerColor = new THREE.Color(getGalaxyColor(galaxy.type)).multiplyScalar(0.3);
    
    // Spiral parameters - vary by galaxy type with more randomness for cloud effect
    let branches = 2;
    let spin = 1.2;
    let spreadRandomness = 0.4; // Increased for wispy clouds
    let randomnessPower = 2.5; // Lower for more spread
    
    // Customize based on galaxy type
    if (galaxy.type === 'Sc') {
      // More open, loosely wound spirals (like M33)
      branches = 2;
      spin = 0.8;
      spreadRandomness = 0.5; // Very wispy
    } else if (galaxy.type === 'Sb') {
      // Tightly wound spirals (like Andromeda)
      branches = 2;
      spin = 1.5;
      spreadRandomness = 0.35; // Still defined but softer
    } else if (galaxy.type.includes('SB')) {
      // Barred spirals (like Milky Way)
      branches = 2;
      spin = 1.0;
      spreadRandomness = 0.4; // Nebulous arms
    }
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position on spiral
      const radius = Math.random() * galaxyRadius;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      const spinAngle = radius * spin;
      
      // Logarithmic spiral equation
      const angle = branchAngle + spinAngle;
      
      // Random offset with power distribution (more concentrated near center)
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spreadRandomness * radius;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spreadRandomness * radius * 0.2;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * spreadRandomness * radius;
      
      // Position in spiral arm
      positions[i3] = Math.cos(angle) * radius + randomX;
      positions[i3 + 1] = randomY; // Thin disk
      positions[i3 + 2] = Math.sin(angle) * radius + randomZ;
      
      // Color mixing with three stages (inner white, mid color, outer dim)
      const normalizedRadius = radius / galaxyRadius;
      const mixedColor = innerColor.clone();
      
      if (normalizedRadius < 0.3) {
        // Inner region: white to main color
        mixedColor.lerp(midColor, normalizedRadius / 0.3);
      } else {
        // Outer region: main color to dim outer
        mixedColor.copy(midColor);
        mixedColor.lerp(outerColor, (normalizedRadius - 0.3) / 0.7);
      }
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      // Highly variable sizes for cloud-like nebulous appearance
      const baseSizeByRadius = (1 - normalizedRadius) * 7;
      const randomVariation = Math.random() * 3.5;
      sizes[i] = Math.max(0.6, baseSizeByRadius + randomVariation);

      // Brighter core with gentle falloff
      const intensityBase = Math.pow(1 - normalizedRadius, 1.3);
      intensities[i] = THREE.MathUtils.clamp(intensityBase + Math.random() * 0.25, 0.1, 1.0);

      // Randomness seed for shader animation
      randomSeeds[i] = Math.random();
    }
    
    return { positions, colors, sizes, intensities, randomness: randomSeeds };
  }, [particleCount, galaxyRadius, galaxy.type]);
  
  // Calculate distance from camera
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - galaxy.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - galaxy.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - galaxy.position_3d.z, 2)
  ) : 1000;
  
  const showLabel = showLabels && shouldRenderLabel(distanceFromCamera, isSelected);
  
  // Gentle rotation animation - slower for more realistic appearance
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.018;
    }

    if (materialRef.current) {
      materialRef.current.uTime += delta;
      materialRef.current.uOpacity = THREE.MathUtils.lerp(
        materialRef.current.uOpacity,
        isSelected || hovered ? 0.95 : 0.75,
        0.08,
      );
      materialRef.current.uBrightness = THREE.MathUtils.lerp(
        materialRef.current.uBrightness,
        isSelected || hovered ? 1.35 : 1.0,
        0.08,
      );
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
      ref={groupRef}
      position={[galaxy.position_3d.x, galaxy.position_3d.y, galaxy.position_3d.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Particle cloud system */}
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
          <bufferAttribute
            attach="attributes-intensity"
            count={intensities.length}
            array={intensities}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-randomness"
            count={randomness.length}
            array={randomness}
            itemSize={1}
          />
        </bufferGeometry>
        <galaxyCloudMaterial
          ref={materialRef}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uPointMultiplier={220}
          uOpacity={isSelected || hovered ? 0.95 : 0.75}
          uBrightness={isSelected || hovered ? 1.35 : 1.0}
        />
      </points>
      
      {/* Central bulge */}
      <mesh>
        <sphereGeometry args={[galaxyRadius * 0.15, 16, 16]} />
        <meshStandardMaterial
          color={getGalaxyColor(galaxy.type)}
          emissive={getGalaxyColor(galaxy.type)}
          emissiveIntensity={isSelected || hovered ? 1.0 : 0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[galaxyRadius * 0.2, 16, 16]} />
        <meshBasicMaterial
          color={getGalaxyColor(galaxy.type)}
          transparent
          opacity={isSelected || hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[galaxyRadius * 1.2, galaxyRadius * 1.3, 64]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Label - billboarded to always face camera */}
      {showLabel && (
        <Text
          position={[0, galaxyRadius * 1.5, 0]}
          fontSize={Math.max(galaxyRadius * 0.5, 2)}
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
