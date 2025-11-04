import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROUTE_COLOR = '#4FC3F7';
const END_COLOR = '#FF5252';
const START_COLOR = '#40C4FF';

/**
 * Visualize route path with a dotted ribbon and animated ship indicator
 */
export function RoutePath({ path, color = ROUTE_COLOR }) {
  const routeData = useMemo(() => {
    if (!path || path.length < 2) return null;

    const points = path.map(galaxy =>
      new THREE.Vector3(
        galaxy.position_3d.x,
        galaxy.position_3d.y,
        galaxy.position_3d.z
      )
    );

    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.8);
    const segments = Math.max(128, points.length * 32);
    const tubeGeometry = new THREE.TubeGeometry(curve, segments, 0.45, 16, false);

    const totalLength = curve.getLength();
    const dotSpacing = 12;
    const dotCount = Math.max(2, Math.floor(totalLength / dotSpacing));
    const dottedPoints = curve.getSpacedPoints(dotCount).slice(1, -1);

    return {
      curve,
      tubeGeometry,
      dottedPoints,
      totalLength,
      startPoint: points[0],
      endPoint: points[points.length - 1],
    };
  }, [path]);

  useEffect(() => {
    return () => {
      routeData?.tubeGeometry?.dispose();
    };
  }, [routeData]);

  const spaceshipRef = useRef();
  const glowRef = useRef();
  const progressRef = useRef(Math.random());

  useEffect(() => {
    progressRef.current = Math.random();
  }, [routeData]);

  useFrame((state, delta) => {
    if (!routeData || !spaceshipRef.current) return;

    const { curve, totalLength } = routeData;
    if (!curve || totalLength === 0) return;

    const minDuration = 8;
    const maxDuration = 18;
    const duration = THREE.MathUtils.clamp(totalLength / 350, minDuration, maxDuration);

    progressRef.current += delta / duration;
    if (progressRef.current > 1) {
      progressRef.current = 0;
    }

    const t = progressRef.current;
    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t);

    spaceshipRef.current.position.copy(position);
    const lookAtTarget = position.clone().add(tangent);
    spaceshipRef.current.lookAt(lookAtTarget);

    if (glowRef.current) {
      glowRef.current.position.copy(position);
      glowRef.current.material.opacity = 0.25 + 0.15 * Math.sin(state.clock.elapsedTime * 4);
    }
  });

  if (!routeData) return null;

  const { tubeGeometry, dottedPoints, startPoint, endPoint } = routeData;

  return (
    <group>
      {/* Sleek ribbon base */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.22}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Dotted guide points */}
      {dottedPoints.map((point, index) => (
        <mesh key={`route-dot-${index}`} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[1.3, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.9}
            roughness={0.25}
            metalness={0.15}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Start marker */}
      <mesh position={[startPoint.x, startPoint.y, startPoint.z]}>
        <octahedronGeometry args={[2.8, 0]} />
        <meshStandardMaterial
          color={START_COLOR}
          emissive={START_COLOR}
          emissiveIntensity={0.7}
          metalness={0.2}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Destination marker */}
      <mesh position={[endPoint.x, endPoint.y, endPoint.z]}>
        <octahedronGeometry args={[3, 0]} />
        <meshStandardMaterial
          color={END_COLOR}
          emissive={END_COLOR}
          emissiveIntensity={0.85}
          metalness={0.25}
          roughness={0.35}
          toneMapped={false}
        />
      </mesh>

      {/* Animated spaceship indicator */}
      <group ref={spaceshipRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.1]}>
          <coneGeometry args={[1.8, 4.6, 16]} />
          <meshStandardMaterial
            color="#FAFAFA"
            emissive="#BBDEFB"
            emissiveIntensity={0.6}
            metalness={0.35}
            roughness={0.25}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.6]}>
          <cylinderGeometry args={[0.8, 1.3, 3.2, 12]} />
          <meshStandardMaterial
            color="#1A237E"
            emissive="#536DFE"
            emissiveIntensity={1.1}
            metalness={0.45}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3.2]}>
          <cylinderGeometry args={[0.5, 0.8, 1.6, 12]} />
          <meshStandardMaterial
            color="#E0F2F1"
            emissive="#80DEEA"
            emissiveIntensity={0.9}
            metalness={0.3}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Soft glow following the ship */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.6, 20, 20]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

