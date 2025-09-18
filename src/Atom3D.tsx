import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { AtomData, getShellRadius, getElectronColor } from './atomData';

interface Atom3DProps {
  atomData: AtomData;
  position: [number, number, number];
  selected: boolean;
  dragging: boolean;
  onSelect: (button: number) => void; // Updated to include button parameter
  onDragStart: (button: number) => void; // Updated to include button parameter
  onDragEnd: (position: [number, number, number]) => void;
  showElectrons: boolean;
  highlight?: boolean; // For bonding mode highlighting
  availableBonds?: number; // Number of bonds this atom can still make
}

interface ElectronShell {
  electrons: number;
  radius: number;
  color: string;
  shellIndex: number;
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
  const electronRefs = useRef<THREE.Group[][]>([]);
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<THREE.Vector3>(new THREE.Vector3());
  
  const { camera, gl, raycaster, pointer } = useThree();

  // Calculate electron shells from electron configuration
  const electronShells: ElectronShell[] = atomData.electronConfiguration.map((electrons, index) => ({
    electrons,
    radius: getShellRadius(index, atomData.radius),
    color: getElectronColor(index),
    shellIndex: index
  }));

  // Initialize electron refs for all shells
  useEffect(() => {
    electronRefs.current = electronShells.map((shell) => 
      new Array(shell.electrons).fill(null)
    );
  }, [atomData.symbol]);

  // Animation for electron orbits
  useFrame((state) => {
    if (showElectrons && electronRefs.current) {
      electronShells.forEach((shell, shellIndex) => {
        const shellRefs = electronRefs.current[shellIndex];
        if (!shellRefs) return;

        shellRefs.forEach((electronRef, electronIndex) => {
          if (electronRef) {
            const time = state.clock.getElapsedTime();
            const radius = shell.radius;
            
            // Different speeds for different shells and electrons
            const baseSpeed = 0.5 + shellIndex * 0.3;
            const electronSpeed = baseSpeed + (electronIndex * 0.1);
            
            // Distribute electrons evenly around the shell
            const angleOffset = (electronIndex * 2 * Math.PI) / shell.electrons;
            const angle = time * electronSpeed + angleOffset;
            
            // Add some 3D movement for outer shells
            const verticalRadius = shellIndex > 1 ? radius * 0.3 : radius * 0.1;
            const verticalAngle = time * (electronSpeed * 0.7) + angleOffset * 1.5;
            
            electronRef.position.x = Math.cos(angle) * radius;
            electronRef.position.z = Math.sin(angle) * radius;
            electronRef.position.y = Math.sin(verticalAngle) * verticalRadius;
          }
        });
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

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    // Detect which mouse button was pressed
    const button = event.nativeEvent?.button ?? 0; // Default to left click (0) if no button info
    
    // Only start dragging on left click (button 0)
    if (button === 0) {
      setIsDragging(true);
      onDragStart(button);
      
      // Calculate drag offset
      if (atomRef.current && event.point) {
        const offset = atomRef.current.position.clone().sub(event.point);
        setDragOffset(offset);
      }
      
      gl.domElement.style.cursor = 'grabbing';
    }
    
    // Call onSelect with button info for both left and right clicks
    onSelect(button);
  };

  const handlePointerUp = (event: any) => {
    event.stopPropagation();
    
    if (isDragging && atomRef.current) {
      setIsDragging(false);
      onDragEnd([
        atomRef.current.position.x,
        atomRef.current.position.y,
        atomRef.current.position.z
      ]);
    }
    
    gl.domElement.style.cursor = hovered ? 'grab' : 'default';
  };

  // Handle context menu to prevent browser right-click menu
  const handleContextMenu = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
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
      onContextMenu={handleContextMenu}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Main atom nucleus */}
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

      {/* Atomic number */}
      <Text
        position={[0, atomData.radius + 0.4, 0]}
        fontSize={0.15}
        color="cyan"
        anchorX="center"
        anchorY="middle"
      >
        Z = {atomData.atomicNumber}
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

      {/* Electron configuration display */}
      <Text
        position={[0, -atomData.radius - 0.5, 0]}
        fontSize={0.12}
        color="yellow"
        anchorX="center"
        anchorY="middle"
      >
        Config: {atomData.electronConfiguration.join('-')}
      </Text>

      {/* Electron shells and electrons */}
      {showElectrons && electronShells.map((shell, shellIndex) => (
        <group key={`shell-${shellIndex}`}>
          {/* Orbital ring for this shell */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[shell.radius - 0.02, shell.radius + 0.02, 64]} />
            <meshBasicMaterial 
              color={shell.color} 
              transparent 
              opacity={0.2} 
            />
          </mesh>

          {/* Shell label */}
          <Text
            position={[shell.radius + 0.2, 0, 0]}
            fontSize={0.1}
            color={shell.color}
            anchorX="center"
            anchorY="middle"
          >
            {['K', 'L', 'M', 'N', 'O', 'P', 'Q'][shellIndex]} ({shell.electrons}e⁻)
          </Text>

          {/* Individual electrons in this shell */}
          {Array.from({ length: shell.electrons }).map((_, electronIndex) => (
            <group
              key={`electron-${shellIndex}-${electronIndex}`}
              ref={(el) => {
                if (el && electronRefs.current[shellIndex]) {
                  electronRefs.current[shellIndex][electronIndex] = el;
                }
              }}
            >
              <Sphere args={[0.04, 16, 16]}>
                <meshStandardMaterial
                  color={shell.color}
                  emissive={shell.color}
                  emissiveIntensity={0.6}
                />
              </Sphere>
              
              {/* Electron trail effect */}
              <mesh>
                <sphereGeometry args={[0.06, 8, 8]} />
                <meshBasicMaterial
                  color={shell.color}
                  transparent
                  opacity={0.3}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

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

      {/* Electron density visualization for heavier atoms */}
      {atomData.atomicNumber > 18 && showElectrons && (
        <mesh>
          <sphereGeometry args={[atomData.radius + 0.6, 32, 32]} />
          <meshBasicMaterial
            color={atomData.color}
            transparent
            opacity={0.05}
            wireframe={false}
          />
        </mesh>
      )}

      {/* Nuclear composition info */}
      {selected && (
        <>
          <Text
            position={[0, -atomData.radius - 0.7, 0]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {atomData.name}
          </Text>
          <Text
            position={[0, -atomData.radius - 0.85, 0]}
            fontSize={0.08}
            color="lightgray"
            anchorX="center"
            anchorY="middle"
          >
            Group: {atomData.group} | Period: {atomData.period}
          </Text>
          <Text
            position={[0, -atomData.radius - 1.0, 0]}
            fontSize={0.08}
            color="lightblue"
            anchorX="center"
            anchorY="middle"
          >
            Electronegativity: {atomData.electronegativity}
          </Text>
        </>
      )}
    </group>
  );
};