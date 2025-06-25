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
  onRemove?: () => void;
}

export const Bond3D: React.FC<Bond3DProps> = ({
  start,
  end,
  type,
  strength,
  animated = true,
  onRemove
}) => {
  const bondRef = useRef<THREE.Group>(null);
  const electricFieldRef = useRef<THREE.Group>(null);
  
  // Calculate bond properties
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const midpoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  
  // Calculate rotation to align cylinder with bond direction
  const up = new THREE.Vector3(0, 1, 0);
  const normalizedDirection = direction.clone().normalize();
  
  // Create a quaternion to rotate from up vector to bond direction
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normalizedDirection);

  // Animation for bond effects
  useFrame((state) => {
    if (bondRef.current && animated) {
      // Gentle pulsing for covalent bonds
      if (type === 'covalent') {
        const pulse = Math.sin(state.clock.getElapsedTime() * 2) * 0.05 + 1;
        bondRef.current.scale.set(pulse, 1, pulse); // Only scale x and z, not length
      }
    }
    
    // Electric field animation for ionic bonds
    if (electricFieldRef.current && type === 'ionic' && animated) {
      electricFieldRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
    }
  });

  const bondColor = type === 'ionic' ? '#ff6b6b' : '#4ecdc4';
  const bondRadius = type === 'ionic' ? 0.08 : 0.06;
  const opacity = type === 'ionic' ? 0.8 : 0.9;

  // Handle click to remove bond (if onRemove is provided)
  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  if (type === 'ionic') {
    // Ionic bond - dotted line effect with electric field
    const segments = 10;
    const segmentLength = length / segments;
    
    return (
      <group ref={bondRef}>
        {/* Dotted bond line */}
        {Array.from({ length: segments }).map((_, index) => {
          if (index % 2 === 0) return null; // Skip every other segment for dotted effect
          
          const t = (index + 0.5) / segments; // Center of segment
          const segmentCenter = startVec.clone().lerp(endVec, t);
          
          return (
            <group key={index} position={segmentCenter.toArray()}>
              <Cylinder
                args={[bondRadius, bondRadius, segmentLength * 0.8, 8]}
                quaternion={quaternion}
                onClick={handleClick}
              >
                <meshStandardMaterial
                  color={bondColor}
                  emissive={bondColor}
                  emissiveIntensity={0.4}
                  transparent
                  opacity={opacity}
                />
              </Cylinder>
            </group>
          );
        })}
        
        {/* Electric field visualization */}
        <group ref={electricFieldRef} position={midpoint.toArray()}>
          {Array.from({ length: 8 }).map((_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const radius = 0.4;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <mesh key={index} position={[x, 0, z]}>
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshStandardMaterial
                  color="#ffff00"
                  emissive="#ffff00"
                  emissiveIntensity={0.6}
                />
              </mesh>
            );
          })}
          
          {/* Central charge indicator */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
        
        {/* Bond formation effect */}
        <group position={midpoint.toArray()}>
          <mesh>
            <ringGeometry args={[0.2, 0.3, 16]} />
            <meshBasicMaterial
              color="#ffff00"
              transparent
              opacity={0.4}
            />
          </mesh>
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
        
        // Create perpendicular vector for multiple bond offset
        const perpendicular = new THREE.Vector3();
        if (Math.abs(normalizedDirection.y) < 0.9) {
          perpendicular.set(0, 1, 0);
        } else {
          perpendicular.set(1, 0, 0);
        }
        perpendicular.cross(normalizedDirection).normalize().multiplyScalar(offset);
        
        return (
          <group key={index} position={perpendicular.toArray()}>
            <Cylinder
              args={[bondRadius, bondRadius, length, 8]}
              quaternion={quaternion}
              onClick={handleClick}
            >
              <meshStandardMaterial
                color={bondColor}
                emissive={bondColor}
                emissiveIntensity={0.3}
                metalness={0.2}
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
            const time = Date.now() * 0.001;
            const angle = (index / 2) * Math.PI * 2 + time;
            const radius = 0.15;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <mesh key={index} position={[x, 0, z]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial
                  color="#00ffff"
                  emissive="#00ffff"
                  emissiveIntensity={0.5}
                />
              </mesh>
            );
          })}
        </group>
      )}
      
      {/* Bond strength indicator */}
      <group>
        <mesh>
          <ringGeometry args={[0.1, 0.15, 16]} />
          <meshBasicMaterial
            color="#00ff00"
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>

      {/* Remove bond indicator (if removable) */}
      {onRemove && (
        <group position={[0, 0, 0]}>
          <mesh onClick={handleClick}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={0.5}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};