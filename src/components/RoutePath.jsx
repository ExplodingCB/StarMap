import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * Visualize route path as a line/tube
 */
export function RoutePath({ path, color = '#00ff00' }) {
  const pathGeometry = useMemo(() => {
    if (!path || path.length < 2) return null;
    
    const points = path.map(galaxy => 
      new THREE.Vector3(
        galaxy.position_3d.x,
        galaxy.position_3d.y,
        galaxy.position_3d.z
      )
    );
    
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.5, 8, false);
    
    return tubeGeometry;
  }, [path]);
  
  if (!pathGeometry) return null;
  
  return (
    <group>
      {/* Route tube */}
      <mesh geometry={pathGeometry}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Waypoint markers */}
      {path.map((galaxy, index) => (
        <mesh
          key={galaxy.id}
          position={[galaxy.position_3d.x, galaxy.position_3d.y, galaxy.position_3d.z]}
        >
          <sphereGeometry args={[2, 8, 8]} />
          <meshBasicMaterial
            color={index === 0 ? '#00ff00' : index === path.length - 1 ? '#ff0000' : '#ffff00'}
          />
        </mesh>
      ))}
    </group>
  );
}

