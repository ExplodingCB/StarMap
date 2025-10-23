import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useAppStore } from '../store/appState';

/**
 * Individual planet component
 */
export function Planet({ planet, cameraPosition }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const selectedPlanet = useAppStore(state => state.selectedPlanet);
  const setSelectedPlanet = useAppStore(state => state.setSelectedPlanet);
  const setHoveredPlanet = useAppStore(state => state.setHoveredPlanet);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const focusOnPlanet = useAppStore(state => state.focusOnPlanet);
  
  const isSelected = selectedPlanet?.id === planet.id;
  
  // Scale planet size for visibility (planets are tiny compared to distances)
  const visualRadius = planet.radius * 0.0001; // Scale down for proper display
  
  // Calculate distance from camera
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - planet.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - planet.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - planet.position_3d.z, 2)
  ) : 1000;
  
  const showLabel = distanceFromCamera < 0.05; // Show labels when very close
  
  // Gentle rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPlanet(planet);
    setInfoPanelOpen(true);
    focusOnPlanet(planet);
  };
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredPlanet(planet);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    setHoveredPlanet(null);
    document.body.style.cursor = 'auto';
  };
  
  return (
    <group position={[planet.position_3d.x, planet.position_3d.y, planet.position_3d.z]}>
      {/* Planet sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[visualRadius, 32, 32]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.color}
          emissiveIntensity={isSelected || hovered ? 0.5 : 0.2}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Glow effect */}
      {(isSelected || hovered) && (
        <mesh scale={[1.5, 1.5, 1.5]}>
          <sphereGeometry args={[visualRadius, 16, 16]} />
          <meshBasicMaterial
            color={planet.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (
        <Html
          position={[0, visualRadius * 2, 0]}
          sprite
          distanceFactor={0.01}
          pointerEvents="none"
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            border: isSelected ? '1px solid #1a73e8' : '1px solid rgba(255, 255, 255, 0.3)',
          }}>
            {planet.name}
          </div>
        </Html>
      )}
    </group>
  );
}

