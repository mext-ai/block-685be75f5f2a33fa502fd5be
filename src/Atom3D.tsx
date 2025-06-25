import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
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
  highlight?: boolean; // For bonding mode highlighting
  availableBonds?: number; // Number of bonds this atom can still make
}

export const Atom3D: React.FC<Atom3DProps> = ({
  atomData,
  position,
  selected,
  dragging,
  onSelect,
  onDragStart,
  onDragEnd,
  showElectrons,
  highlight = false,
  availableBonds = 0
}) => {
  const atomRef = useRef<THREE.Group>(null);
  const electronRefs = useRef<THREE.Group[]>([]);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3());
  
  const { camera, gl, raycaster, pointer } = useThree();

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
    
    // Gentle floating animation (only when not dragging)
    if (atomRef.current && !isDragging && !dragging) {
      const baseY = position[1];
      atomRef.current.position.y = baseY + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }

    // Handle dragging
    if (isDragging && atomRef.current) {
      // Create a plane for dragging
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersection = new THREE.Vector3();
      
      // Update raycaster with current mouse position
      raycaster.setFromCamera(pointer, camera);
      
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        atomRef.current.position.copy(intersection.add(dragOffset));
      }
    }

    // Highlight animation for bonding mode
    if (highlight && atomRef.current) {
      const pulse = Math.sin(state.clock.getElapsedTime() * 3) * 0.1 + 1;
      atomRef.current.scale.setScalar(pulse);
    } else if (atomRef.current && !selected && !hovered) {
      atomRef.current.scale.setScalar(1);
    }
  });

  const handlePointerDown = (event: THREE.Event) => {
    event.stopPropagation();
    setIsDragging(true);
    onDragStart();
    onSelect();
    
    // Calculate drag offset
    if (atomRef.current && event.point) {
      const offset = atomRef.current.position.clone().sub(event.point);
      setDragOffset(offset);
    }
    
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerUp = (event: THREE.Event) => {
    event.stopPropagation();
    
    if (setIsDragging && atomRef.current) {
      setIsDragging(false);
      onDragEnd([
        atomRef.current.position.x,
        atomRef.current.position.y,
        atomRef.current.position.z
      ]);
    }
    
    gl.domElement.style.cursor = hovered ? 'grab' : 'default';
  };

  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    onSelect();
  };

  const handlePointerEnter = () => {
    setHovered(true);
    gl.domElement.style.cursor = 'grab';
  };

  const handlePointerLeave = () => {
    setHovered(false);
    if (!isDragging) {
      gl.domElement.style.cursor = 'default';
    }
  };

  // Update position when prop changes
  useEffect(() => {
    if (atomRef.current && !isDragging) {
      atomRef.current.position.set(...position);
    }
  }, [position, isDragging]);

  const scale = selected ? 1.2 : hovered ? 1.1 : 1.0;
  const emissiveIntensity = 
    highlight ? 0.5 : 
    selected ? 0.3 : 
    hovered ? 0.2 : 0.1;

  // Color coding based on bonding availability
  const getBondingColor = () => {
    if (availableBonds === 0) return '#ff4444'; // Red if no bonds available
    if (highlight) return '#ffff00'; // Yellow if highlighted for bonding
    return atomData.color; // Default atom color
  };

  return (
    <group
      ref={atomRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Main atom sphere */}
      <Sphere args={[atomData.radius, 32, 32]} scale={scale}>
        <meshStandardMaterial
          color={getBondingColor()}
          emissive={getBondingColor()}
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
      >
        {atomData.symbol}
      </Text>

      {/* Available bonds indicator */}
      <Text
        position={[0, -atomData.radius - 0.3, 0]}
        fontSize={0.15}
        color={availableBonds > 0 ? "#00ff00" : "#ff4444"}
        anchorX="center"
        anchorY="middle"
      >
        Bonds: {availableBonds}
      </Text>

      {/* Valence electrons count */}
      <Text
        position={[0, -atomData.radius - 0.5, 0]}
        fontSize={0.12}
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
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[atomData.radius + 0.2, atomData.radius + 0.3, 32]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Highlight indicator for bonding mode */}
      {highlight && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[atomData.radius + 0.35, atomData.radius + 0.45, 32]} />
          <meshBasicMaterial color="#ffff00" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Bonding availability indicator */}
      {availableBonds > 0 && (
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[atomData.radius + 0.5, atomData.radius + 0.55, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.4} />
        </mesh>
      )}

      {/* No bonds available indicator */}
      {availableBonds === 0 && (
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[atomData.radius + 0.5, atomData.radius + 0.55, 32]} />
          <meshBasicMaterial color="#ff4444" transparent opacity={0.4} />
        </mesh>
      )}

      {/* Bonding range indicator when dragging */}
      {dragging && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};