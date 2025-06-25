import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { AtomData } from './atomData';

interface Atom3DProps {
  atomData: AtomData;
  position: [number, number, number];
  selected: boolean;
  dragging: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: (position: [number, number, number]) => void;
  showElectrons: boolean;
}

export const Atom3D: React.FC<Atom3DProps> = ({
  atomData,
  position,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
  showElectrons
}) => {
  const atomRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Group[]>([]);
  const [hovered, setHovered] = useState(false);

  // Animation for electron orbits
  useFrame((state) => {
    if (showElectrons && electronRefs.current) {
      electronRefs.current.forEach((electronRef, index) => {
        if (electronRef) {
          const time = state.clock.getElapsedTime();
          const radius = 0.8 + index * 0.3;
          const speed = 1 + index * 0.5;
          const angle = time * speed + index * Math.PI * 2 / atomData.valenceElectrons;
          
          electronRef.position.x = Math.cos(angle) * radius;
          electronRef.position.z = Math.sin(angle) * radius;
          electronRef.position.y = Math.sin(angle * 2) * 0.2;
        }
      });
    }
    
    // Gentle floating animation
    if (atomRef.current && !dragging) {
      atomRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const handlePointerDown = (event: THREE.Event) => {
    event.stopPropagation();
    onDragStart();
    onSelect();
  };

  const handlePointerUp = (event: THREE.Event) => {
    event.stopPropagation();
    if (atomRef.current) {
      onDragEnd([
        atomRef.current.position.x,
        atomRef.current.position.y,
        atomRef.current.position.z
      ]);
    }
  };

  const scale = selected ? 1.2 : hovered ? 1.1 : 1.0;
  const emissiveIntensity = selected ? 0.3 : hovered ? 0.2 : 0.1;

  return (
    <group
      ref={atomRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main atom sphere */}
      <Sphere args={[atomData.radius, 32, 32]} scale={scale}>
        <meshStandardMaterial
          color={atomData.color}
          emissive={atomData.color}
          emissiveIntensity={emissiveIntensity}
          metalness={0.1}
          roughness={0.3}
        />
      </Sphere>

      {/* Atom symbol */}
      <Text
        position={[0, 0, atomData.radius + 0.1]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-regular.woff"
      >
        {atomData.symbol}
      </Text>

      {/* Valence electrons count */}
      <Text
        position={[0, -atomData.radius - 0.3, 0]}
        fontSize={0.15}
        color="yellow"
        anchorX="center"
        anchorY="middle"
      >
        {atomData.valenceElectrons}e⁻
      </Text>

      {/* Electron orbits */}
      {showElectrons && Array.from({ length: atomData.valenceElectrons }).map((_, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) electronRefs.current[index] = el;
          }}
        >
          <Sphere args={[0.05, 8, 8]}>
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={0.5}
            />
          </Sphere>
        </group>
      ))}

      {/* Orbital rings */}
      {showElectrons && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.75, 0.8, 32]} />
            <meshBasicMaterial color="#444444" transparent opacity={0.3} />
          </mesh>
          {atomData.valenceElectrons > 2 && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.05, 1.1, 32]} />
              <meshBasicMaterial color="#444444" transparent opacity={0.3} />
            </mesh>
          )}
        </>
      )}

      {/* Selection indicator */}
      {selected && (
        <mesh>
          <ringGeometry args={[atomData.radius + 0.2, atomData.radius + 0.3, 32]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};