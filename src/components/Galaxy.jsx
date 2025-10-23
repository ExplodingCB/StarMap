import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { getGalaxyColor } from '../utils/colorMapping';
import { calculateGalaxySize, shouldRenderLabel } from '../utils/sizeMapping';
import { useAppStore } from '../store/appState';
import * as THREE from 'three';
import { formatDistance } from '../services/distanceCalculator';
import './Galaxy.css';

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
  const labelClassName = useMemo(() => {
    const classes = ['galaxy-label'];
    if (isSelected) classes.push('galaxy-label--active');
    if (hovered) classes.push('galaxy-label--hover');
    return classes.join(' ');
  }, [isSelected, hovered]);
  
  const labelDistanceFactor = useMemo(() => {
    if (!distanceFromCamera) return 18;
    return Math.min(26, Math.max(12, distanceFromCamera / 18));
  }, [distanceFromCamera]);
  
  const typeLabel = galaxy.morphological_type || galaxy.type || 'Galaxy';
  const distanceLabel = useMemo(() => {
    if (typeof galaxy.distance_kpc !== 'number') return null;
    return formatDistance(galaxy.distance_kpc);
  }, [galaxy.distance_kpc]);
  
  const connectorStart = size * 0.95;
  const labelAnchor = useMemo(() => {
    const base = size + 2.2;
    return Math.min(9.5, Math.max(connectorStart + 1.4, base));
  }, [size, connectorStart]);
  const connectorHeight = Math.max(labelAnchor - connectorStart, 0.6);
  const connectorMid = connectorStart + connectorHeight / 2;
  const connectorThickness = Math.min(0.12, Math.max(0.04, size * 0.05));
  const anchorSize = Math.max(0.35, Math.min(0.8, size * 0.4));
  const pinColor = isSelected ? '#1a73e8' : '#3b82f6';
  
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
        <group>
          {/* Slim connector to visually link the badge to the galaxy */}
          <mesh position={[0, connectorMid, 0]}>
            <cylinderGeometry args={[connectorThickness, connectorThickness, connectorHeight, 20]} />
            <meshStandardMaterial
              color="#2563eb"
              transparent
              opacity={0.75}
              emissive="#2563eb"
              emissiveIntensity={0.35}
            />
          </mesh>
          
          {/* Accent glow just beneath the label */}
          <mesh position={[0, labelAnchor + 0.2, 0]}>
            <sphereGeometry args={[connectorThickness * 2.4, 16, 16]} />
            <meshStandardMaterial
              color="#c7d2fe"
              emissive="#93c5fd"
              emissiveIntensity={0.25}
              transparent
              opacity={0.6}
            />
          </mesh>
          
          {/* Anchoring pin */}
          <mesh position={[0, connectorStart - anchorSize * 0.35, 0]}>
            <coneGeometry args={[anchorSize * 0.6, anchorSize * 1.4, 24]} />
            <meshStandardMaterial
              color={pinColor}
              emissive={pinColor}
              emissiveIntensity={isSelected ? 0.55 : 0.4}
              transparent
              opacity={0.95}
            />
          </mesh>
          <mesh position={[0, connectorStart + anchorSize * 0.25, 0]}>
            <sphereGeometry args={[anchorSize * 0.65, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#bfdbfe"
              emissiveIntensity={0.45}
            />
          </mesh>
          
          <Html
            position={[0, labelAnchor, 0]}
            sprite
            distanceFactor={labelDistanceFactor}
            pointerEvents="none"
          >
            <div className={labelClassName}>
              <div className="galaxy-label__indicator" />
              <div className="galaxy-label__content">
                <div className="galaxy-label__name">{galaxy.name}</div>
                <div className="galaxy-label__meta">
                  <span>{typeLabel}</span>
                  {distanceLabel && <span className="galaxy-label__separator">•</span>}
                  {distanceLabel && <span>{distanceLabel}</span>}
                </div>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
