import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useAppStore } from '../store/appState';
import { getSpectralColor } from '../shaders/starShaders';
import { MW_LOD_SYSTEM_MIN, MW_LOD_SYSTEM_MAX } from '../utils/constants';

/**
 * Individual star system component
 */
export function StarSystem({ star, cameraPosition }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const selectedStar = useAppStore(state => state.selectedStar);
  const setSelectedStar = useAppStore(state => state.setSelectedStar);
  const setHoveredStar = useAppStore(state => state.setHoveredStar);
  const setInfoPanelOpen = useAppStore(state => state.setInfoPanelOpen);
  const focusOnStar = useAppStore(state => state.focusOnStar);
  
  const isSelected = selectedStar?.id === star.id;
  
  // Calculate distance from camera
  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - star.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - star.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - star.position_3d.z, 2)
  ) : 1000;
  
  // Only render at appropriate LOD level (LOD 3: 0.1-10 kpc)
  const shouldRender = distanceFromCamera >= MW_LOD_SYSTEM_MIN && 
                       distanceFromCamera <= MW_LOD_SYSTEM_MAX;
  
  // Calculate opacity for smooth transitions
  const opacity = useMemo(() => {
    if (distanceFromCamera > MW_LOD_SYSTEM_MAX) return 0;
    if (distanceFromCamera < MW_LOD_SYSTEM_MIN) return 0;
    
    // Fade in from MAX
    if (distanceFromCamera > MW_LOD_SYSTEM_MAX * 0.8) {
      const fadeRange = MW_LOD_SYSTEM_MAX * 0.2;
      const fadeProgress = (MW_LOD_SYSTEM_MAX - distanceFromCamera) / fadeRange;
      return Math.max(0, Math.min(1, fadeProgress));
    }
    
    // Fade out to MIN
    if (distanceFromCamera < MW_LOD_SYSTEM_MIN * 1.5) {
      const fadeRange = MW_LOD_SYSTEM_MIN * 0.5;
      const fadeProgress = (distanceFromCamera - MW_LOD_SYSTEM_MIN) / fadeRange;
      return Math.max(0, Math.min(1, fadeProgress));
    }
    
    return 1;
  }, [distanceFromCamera]);
  
  // Calculate star size based on magnitude and distance
  const starSize = useMemo(() => {
    const baseSizeFromMagnitude = Math.pow(2.512, -star.absoluteMagnitude / 2.5) * 0.02;
    const minSize = 0.01;
    const maxSize = 0.2;
    return Math.max(minSize, Math.min(maxSize, baseSizeFromMagnitude));
  }, [star.absoluteMagnitude]);
  
  const showLabel = distanceFromCamera < 5; // Show labels when closer
  
  // Get star color
  const starColor = star.color || getSpectralColor(star.spectralType);
  
  // Gentle pulsing animation
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      meshRef.current.material.emissiveIntensity = (isSelected || hovered ? 1.2 : 0.8) * pulse;
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedStar(star);
    setInfoPanelOpen(true);
    focusOnStar(star);
  };
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    setHoveredStar(star);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    setHoveredStar(null);
    document.body.style.cursor = 'auto';
  };
  
  if (!shouldRender || opacity < 0.01) {
    return null;
  }
  
  return (
    <group position={[star.position_3d.x, star.position_3d.y, star.position_3d.z]}>
      {/* Star sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[starSize, 16, 16]} />
        <meshBasicMaterial
          color={starColor}
          emissive={starColor}
          emissiveIntensity={isSelected || hovered ? 1.2 : 0.8}
          transparent
          opacity={opacity}
        />
      </mesh>
      
      {/* Inner glow */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[starSize, 12, 12]} />
        <meshBasicMaterial
          color={starColor}
          transparent
          opacity={opacity * 0.4}
        />
      </mesh>
      
      {/* Outer glow */}
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[starSize, 12, 12]} />
        <meshBasicMaterial
          color={starColor}
          transparent
          opacity={opacity * 0.2}
        />
      </mesh>
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh>
          <ringGeometry args={[starSize * 2, starSize * 2.5, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={opacity * 0.8}
            side={2}
          />
        </mesh>
      )}
      
      {/* Special indicator for Solar System */}
      {star.isSolarSystem && (
        <mesh>
          <ringGeometry args={[starSize * 3, starSize * 3.5, 32]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={opacity * 0.6}
            side={2}
          />
        </mesh>
      )}
      
      {/* Label */}
      {showLabel && (
        <Html
          position={[0, starSize * 4, 0]}
          sprite
          distanceFactor={2}
          pointerEvents="none"
        >
          <div style={{
            background: star.isSolarSystem 
              ? 'rgba(0, 128, 0, 0.9)' 
              : 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: star.isSolarSystem ? 'bold' : 'normal',
            whiteSpace: 'nowrap',
            border: isSelected ? '2px solid #1a73e8' : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <div>{star.properName || star.name}</div>
            {star.spectralType && (
              <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
                {star.spectralType}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

