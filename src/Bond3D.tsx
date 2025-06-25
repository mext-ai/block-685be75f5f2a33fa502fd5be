import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface Bond3DProps {
  start: [number, number, number];
  end: [number, number, number];
  type: 'ionic' | 'covalent';
  strength: number;
  animated?: boolean;
}

export const Bond3D: React.FC<Bond3DProps> = ({
  start,
  end,
  type,
  strength,
  animated = true
}) => {
  const bondRef = useRef<THREE.Group>(null);
  
  // Calculate bond properties
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  
  // Calculate rotation to align cylinder with bond direction
  const up = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.normalize());

  // Animation for bond pulsing
  useFrame((state) => {
    if (bondRef.current && animated) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 1;
      bondRef.current.scale.setScalar(pulse);
    }
  });

  const bondColor = type === 'ionic' ? '#ff6b6b' : '#4ecdc4';
  const bondRadius = type === 'ionic' ? 0.08 : 0.06;
  const opacity = type === 'ionic' ? 0.7 : 0.9;

  if (type === 'ionic') {
    // Ionic bond - dotted line effect
    const segments = 8;
    const segmentLength = length / segments;
    
    return (
      <group ref={bondRef}>
        {Array.from({ length: segments }).map((_, index) => {
          if (index % 2 === 0) return null; // Skip every other segment for dotted effect
          
          const segmentStart = startVec.clone().add(
            direction.clone().normalize().multiplyScalar(index * segmentLength)
          );
          const segmentEnd = startVec.clone().add(
            direction.clone().normalize().multiplyScalar((index + 1) * segmentLength)
          );
          const segmentMidpoint = segmentStart.clone().add(segmentEnd).multiplyScalar(0.5);
          
          return (
            <group key={index} position={segmentMidpoint.toArray()}>
              <Cylinder
                args={[bondRadius, bondRadius, segmentLength * 0.8, 8]}
                rotation={[quaternion.x, quaternion.y, quaternion.z]}
              >
                <meshStandardMaterial
                  color={bondColor}
                  emissive={bondColor}
                  emissiveIntensity={0.3}
                  transparent
                  opacity={opacity}
                />
              </Cylinder>
            </group>
          );
        })}
        
        {/* Electric field visualization */}
        <group position={midpoint.toArray()}>
          {Array.from({ length: 6 }).map((_, index) => {
            const angle = (index / 6) * Math.PI * 2;
            const radius = 0.3;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <mesh key={index} position={[x, 0, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={0.5}
                />
              </mesh>
            );
          })}
        </group>
      </group>
    );
  }

  // Covalent bond - solid cylinder(s)
  const bondCount = Math.min(strength, 3); // Single, double, or triple bond
  
  return (
    <group ref={bondRef} position={midpoint.toArray()}>
      {Array.from({ length: bondCount }).map((_, index) => {
        const offset = bondCount > 1 ? (index - (bondCount - 1) / 2) * 0.15 : 0;
        const perpendicular = new THREE.Vector3(0, 0, 1).cross(direction).normalize();
        const offsetVector = perpendicular.multiplyScalar(offset);
        
        return (
          <group key={index} position={offsetVector.toArray()}>
            <Cylinder
              args={[bondRadius, bondRadius, length, 8]}
              rotation={[quaternion.x, quaternion.y, quaternion.z]}
            >
              <meshStandardMaterial
                color={bondColor}
                emissive={bondColor}
                emissiveIntensity={0.2}
                metalness={0.3}
                roughness={0.4}
                transparent
                opacity={opacity}
              />
            </Cylinder>
          </group>
        );
      })}
      
      {/* Electron sharing visualization for covalent bonds */}
      {animated && (
        <group>
          {Array.from({ length: 2 }).map((_, index) => {
            const t = (index / 2) * Math.PI * 2;
            
            return (
              <group key={index}>
                <mesh>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshStandardMaterial
                    color="#00ffff"
                    emissive="#00ffff"
                    emissiveIntensity={0.4}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      )}
    </group>
  );
};