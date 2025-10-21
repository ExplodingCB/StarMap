import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Galaxy } from './Galaxy';
import { SpiralGalaxy } from './SpiralGalaxy';
import { DwarfGalaxy } from './DwarfGalaxy';
import { StarField } from './StarField';
import { RoutePath } from './RoutePath';
import { CoordinateGrid } from './CoordinateGrid';
import { useAppStore, useFilteredGalaxies } from '../store/appState';
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR } from '../utils/constants';
import { useState, useRef } from 'react';

/**
 * Easing function - ease in-out cubic (Google Earth style)
 */
function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Lerp (linear interpolation) helper
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Camera orbit controller with smooth animations
 */
function CameraOrbitController() {
  const controlsRef = useRef();
  const lastUserInteraction = useRef(0);
  
  const isOrbiting = useAppStore(state => state.isOrbiting);
  const orbitTarget = useAppStore(state => state.orbitTarget);
  const orbitDistance = useAppStore(state => state.orbitDistance);
  const orbitAngle = useAppStore(state => state.orbitAngle);
  const orbitSpeed = useAppStore(state => state.orbitSpeed);
  const setOrbitAngle = useAppStore(state => state.setOrbitAngle);
  const stopOrbit = useAppStore(state => state.stopOrbit);
  
  const cameraAnimating = useAppStore(state => state.cameraAnimating);
  const cameraAnimationStart = useAppStore(state => state.cameraAnimationStart);
  const cameraAnimationEnd = useAppStore(state => state.cameraAnimationEnd);
  const cameraAnimationProgress = useAppStore(state => state.cameraAnimationProgress);
  const cameraAnimationDuration = useAppStore(state => state.cameraAnimationDuration);
  const setCameraAnimating = useAppStore(state => state.setCameraAnimating);
  const setCameraAnimationProgress = useAppStore(state => state.setCameraAnimationProgress);
  const setCameraPosition = useAppStore(state => state.setCameraPosition);
  
  useFrame((state, delta) => {
    // Handle camera animation (takes priority over orbit)
    if (cameraAnimating && cameraAnimationStart && cameraAnimationEnd && controlsRef.current) {
      const newProgress = Math.min(cameraAnimationProgress + delta / cameraAnimationDuration, 1);
      
      // Apply easing function (slow-fast-slow like Google Earth)
      const easedProgress = easeInOutCubic(newProgress);
      
      // Interpolate position
      const currentPos = [
        lerp(cameraAnimationStart.position[0], cameraAnimationEnd.position[0], easedProgress),
        lerp(cameraAnimationStart.position[1], cameraAnimationEnd.position[1], easedProgress),
        lerp(cameraAnimationStart.position[2], cameraAnimationEnd.position[2], easedProgress),
      ];
      
      // Interpolate look-at target
      const currentTarget = [
        lerp(cameraAnimationStart.target[0], cameraAnimationEnd.target[0], easedProgress),
        lerp(cameraAnimationStart.target[1], cameraAnimationEnd.target[1], easedProgress),
        lerp(cameraAnimationStart.target[2], cameraAnimationEnd.target[2], easedProgress),
      ];
      
      // Update camera
      state.camera.position.set(currentPos[0], currentPos[1], currentPos[2]);
      controlsRef.current.target.set(currentTarget[0], currentTarget[1], currentTarget[2]);
      controlsRef.current.update();
      
      // Update progress
      setCameraAnimationProgress(newProgress);
      
      // End animation when complete and start orbit if there's a target
      if (newProgress >= 1) {
        setCameraAnimating(false);
        setCameraPosition(currentPos);
        
        // Start orbit after animation completes
        const orbitTarget = useAppStore.getState().orbitTarget;
        if (orbitTarget) {
          useAppStore.getState().setIsOrbiting(true);
        }
      }
      
      return; // Don't run orbit while animating
    }
    
    // Handle orbit (only if not animating)
    if (isOrbiting && orbitTarget && controlsRef.current) {
      const pos = orbitTarget.position_3d;
      const newAngle = orbitAngle + delta * orbitSpeed;
      
      // Calculate camera position in orbit
      const x = pos.x + Math.cos(newAngle) * orbitDistance;
      const z = pos.z + Math.sin(newAngle) * orbitDistance;
      const y = pos.y + orbitDistance * 0.3; // Slightly elevated
      
      // Update camera position
      state.camera.position.set(x, y, z);
      
      // Look at target
      controlsRef.current.target.set(pos.x, pos.y, pos.z);
      controlsRef.current.update();
      
      // Update angle for next frame
      setOrbitAngle(newAngle);
    }
  });
  
  // Detect user interaction to stop orbit and animation
  const handleInteractionStart = () => {
    if (isOrbiting) {
      lastUserInteraction.current = Date.now();
      stopOrbit();
    }
    if (cameraAnimating) {
      setCameraAnimating(false);
    }
  };
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      minDistance={10}
      maxDistance={3000}
      onStart={handleInteractionStart}
    />
  );
}

/**
 * Main 3D map scene component
 */
export function Map3D() {
  const galaxies = useFilteredGalaxies();
  const routePath = useAppStore(state => state.routePath);
  const showGrid = useAppStore(state => state.showGrid);
  const cameraPosition = useAppStore(state => state.cameraPosition);
  
  const [currentCameraPos, setCurrentCameraPos] = useState(cameraPosition);
  
  return (
    <Canvas
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ camera }) => {
        setCurrentCameraPos([camera.position.x, camera.position.y, camera.position.z]);
      }}
    >
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        position={cameraPosition}
        fov={CAMERA_FOV}
        near={CAMERA_NEAR}
        far={CAMERA_FAR}
      />
      
      {/* Controls with orbit functionality */}
      <CameraOrbitController />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={1} />
      <pointLight position={[-100, -100, -100]} intensity={0.5} />
      
      {/* Background starfield */}
      <StarField count={8000} />
      
      {/* Galaxies */}
      {galaxies.map(galaxy => {
        const type = galaxy.type.toLowerCase();
        
        // Check if this is a spiral galaxy
        const isSpiral = type.startsWith('s') && 
                        !type.includes('sph') &&
                        !type.startsWith('se');
        
        // Check if this is a dwarf or irregular galaxy
        const isDwarfOrIrregular = type.startsWith('d') || 
                                   type.includes('sph') || 
                                   type.includes('irr');
        
        // Choose appropriate component
        if (isSpiral) {
          return (
            <SpiralGalaxy
              key={galaxy.id}
              galaxy={galaxy}
              cameraPosition={currentCameraPos}
            />
          );
        } else if (isDwarfOrIrregular) {
          return (
            <DwarfGalaxy
              key={galaxy.id}
              galaxy={galaxy}
              cameraPosition={currentCameraPos}
            />
          );
        } else {
          // Elliptical and other types
          return (
            <Galaxy
              key={galaxy.id}
              galaxy={galaxy}
              cameraPosition={currentCameraPos}
            />
          );
        }
      })}
      
      {/* Route visualization */}
      {routePath.length >= 2 && (
        <RoutePath path={routePath} />
      )}
      
      {/* Optional coordinate grid */}
      {showGrid && <CoordinateGrid />}
    </Canvas>
  );
}

