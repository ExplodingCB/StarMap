import * as THREE from 'three';

/**
 * Optional coordinate grid for reference
 */
export function CoordinateGrid({ size = 2000, divisions = 20 }) {
  return (
    <group>
      {/* XY plane (blue) */}
      <gridHelper
        args={[size, divisions, '#0088ff', '#004488']}
        rotation={[0, 0, 0]}
        position={[0, 0, 0]}
      />
      
      {/* XZ plane (green) */}
      <gridHelper
        args={[size, divisions, '#00ff88', '#004444']}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      />
      
      {/* Axes */}
      <axesHelper args={[size / 2]} />
    </group>
  );
}

