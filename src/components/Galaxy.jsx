import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getGalaxyColor } from '../utils/colorMapping';
import { calculateGalaxySize, shouldRenderLabel } from '../utils/sizeMapping';
import { useAppStore } from '../store/appState';
import * as THREE from 'three';

/**
 * Individual galaxy component
 */
export function Galaxy({ galaxy, cameraPosition }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const selectedGalaxy = useAppStore(state => state.selectedGalaxy);
  const setSelectedGalaxy = useAppStore(state => state.setSelectedGalaxy);
  const setHoveredGalaxy = useAppStore(state => state.setHoveredGalaxy);
  const showLabels = useAppStore(state => state.showLabels);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const focusOnGalaxy = useAppStore(state => state.focusOnGalaxy);
  const startOrbit = useAppStore(state => state.startOrbit);
  
  const isSelected = selectedGalaxy?.id === galaxy.id;
  
  // Calculate visual properties
  const color = getGalaxyColor(galaxy.type);
  const size = calculateGalaxySize(galaxy.size_estimate_kpc, galaxy.distance_kpc);
  
  // Calculate distance from camera
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - galaxy.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - galaxy.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - galaxy.position_3d.z, 2)
  ) : 1000;
  
  const showLabel = showLabels && shouldRenderLabel(distanceFromCamera, isSelected);
  
  // Gentle rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
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
    <group position={[galaxy.position_3d.x, galaxy.position_3d.y, galaxy.position_3d.z]}>
      {/* Main galaxy sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || hovered ? 0.6 : 0.4}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Multi-layer glow for cloud-like appearance */}
      <mesh scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || hovered ? 0.25 : 0.15}
        />
      </mesh>
      
      {/* Outer halo */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isSelected || hovered ? 0.15 : 0.08}
        />
      </mesh>
      
      {/* Selection ring */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Label - billboarded to always face camera */}
      {showLabel && (
        <Text
          position={[0, size * 1.5, 0]}
          fontSize={Math.max(size * 0.8, 2)}
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

