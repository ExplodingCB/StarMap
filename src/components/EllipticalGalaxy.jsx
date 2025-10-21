import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { getGalaxyColor } from '../utils/colorMapping';
import { shouldRenderLabel } from '../utils/sizeMapping';
import { useAppStore } from '../store/appState';
import * as THREE from 'three';
import { GalaxyCloudMaterial } from '../shaders/GalaxyCloudMaterial';

export function EllipticalGalaxy({ galaxy, cameraPosition }) {
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

  const subtypeMatch = typeof galaxy.type === 'string' ? galaxy.type.match(/E(\d)/i) : null;
  const subtype = subtypeMatch ? parseInt(subtypeMatch[1], 10) : 0;
  const axisRatio = THREE.MathUtils.clamp(1 - (subtype || 0) / 10, 0.3, 1);
  const majorAxisMultiplier = 1 / axisRatio;

  const galaxyRadius = Math.max(galaxy.size_estimate_kpc * 0.28, 3.5);
  const particleCount = Math.min(Math.floor(galaxy.size_estimate_kpc * 240), 16000);

  const { rotation, positions, colors, sizes, intensities, randomness } = useMemo(() => {
    const seed = galaxy.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (n) => {
      const x = Math.sin(seed + n * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    const rotation = {
      x: seededRandom(1) * Math.PI,
      y: seededRandom(2) * Math.PI,
      z: seededRandom(3) * Math.PI,
    };

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const intensities = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount);

    const baseColor = new THREE.Color(getGalaxyColor(galaxy.type));
    const innerColor = new THREE.Color('#fef7e4');
    const midColor = baseColor.clone().lerp(new THREE.Color('#d6d7ff'), 0.35);
    const outerColor = baseColor.clone().multiplyScalar(0.45);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const u = seededRandom(30 + i) * 2.0 - 1.0;
      const v = seededRandom(60 + i);
      const theta = 2.0 * Math.PI * v;
      const radiusCore = Math.pow(seededRandom(90 + i), 0.45);
      const radiusEnvelope = Math.pow(seededRandom(120 + i), 2.5);
      const concentration = THREE.MathUtils.lerp(radiusEnvelope, radiusCore, 0.65);
      const radius = concentration * galaxyRadius;

      const sqrtTerm = Math.sqrt(1.0 - u * u);
      let x = radius * sqrtTerm * Math.cos(theta);
      let y = radius * sqrtTerm * Math.sin(theta);
      let z = radius * u;

      x *= majorAxisMultiplier;
      z *= axisRatio;

      x += (seededRandom(150 + i) - 0.5) * galaxyRadius * 0.22;
      y += (seededRandom(180 + i) - 0.5) * galaxyRadius * 0.18;
      z += (seededRandom(210 + i) - 0.5) * galaxyRadius * 0.18;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      const actualRadius = Math.sqrt(x * x + y * y + z * z);
      const normalizedRadius = Math.min(actualRadius / galaxyRadius, 1);

      const color = innerColor.clone();
      if (normalizedRadius < 0.35) {
        color.lerp(midColor, normalizedRadius / 0.35);
      } else {
        color.copy(midColor);
        color.lerp(outerColor, (normalizedRadius - 0.35) / 0.65);
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      const baseSizeByRadius = (1 - normalizedRadius) * 6.0;
      const randomVariation = seededRandom(240 + i) * 2.5;
      sizes[i] = Math.max(0.7, baseSizeByRadius + randomVariation);

      intensities[i] = THREE.MathUtils.clamp(Math.pow(1 - normalizedRadius, 1.4) + seededRandom(270 + i) * 0.3, 0.1, 1.0);
      randomness[i] = seededRandom(300 + i);
    }

    return { rotation, positions, colors, sizes, intensities, randomness };
  }, [axisRatio, galaxy.id, galaxy.size_estimate_kpc, galaxy.type, galaxyRadius, majorAxisMultiplier, particleCount]);

  const distanceFromCamera = cameraPosition ? Math.sqrt(
    Math.pow(cameraPosition[0] - galaxy.position_3d.x, 2) +
    Math.pow(cameraPosition[1] - galaxy.position_3d.y, 2) +
    Math.pow(cameraPosition[2] - galaxy.position_3d.z, 2)
  ) : 1000;

  const showLabel = showLabels && shouldRenderLabel(distanceFromCamera, isSelected);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.006;
    }

    if (materialRef.current) {
      materialRef.current.uTime += delta * 0.7;
      materialRef.current.uOpacity = THREE.MathUtils.lerp(
        materialRef.current.uOpacity,
        isSelected || hovered ? 0.92 : 0.72,
        0.08,
      );
      materialRef.current.uBrightness = THREE.MathUtils.lerp(
        materialRef.current.uBrightness,
        isSelected || hovered ? 1.4 : 1.05,
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
      position={[galaxy.position_3d.x, galaxy.position_3d.y, galaxy.position_3d.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={groupRef} rotation={[rotation.x, rotation.y, rotation.z]}>
        <points>
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
            uPointMultiplier={210}
            uOpacity={isSelected || hovered ? 0.92 : 0.72}
            uBrightness={isSelected || hovered ? 1.4 : 1.05}
          />
        </points>
      </group>

      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[galaxyRadius * 1.2, galaxyRadius * 1.3, 48]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}

      {showLabel && (
        <Text
          position={[0, galaxyRadius * 1.6, 0]}
          fontSize={Math.max(galaxyRadius * 0.6, 2)}
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
