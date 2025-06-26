import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Atom3D } from './Atom3D';
import { Bond3D } from './Bond3D';
import { GameUI } from './GameUI';
import { ATOMS, MOLECULES, getBondType, canBond, AtomData } from './atomData';

interface BlockProps {
  title?: string;
  description?: string;
}

interface PlacedAtom {
  id: string;
  symbol: string;
  position: [number, number, number];
  atomData: AtomData;
  availableBonds: number; // Track how many bonds this atom can still make
}

interface MolecularBond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  type: 'ionic' | 'covalent';
  strength: number;
}

// Keyboard camera controls component
const KeyboardCameraControls: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const { camera } = useThree();
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.code.toLowerCase());
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.code.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  useFrame(() => {
    if (!enabled) return;

    const moveSpeed = 0.1;
    const rotateSpeed = 0.02;

    // Movement controls (WASD + Arrow Keys)
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0);

    // Forward/Backward
    if (keysPressed.current.has('keyw') || keysPressed.current.has('arrowup')) {
      camera.position.add(forward.multiplyScalar(moveSpeed));
    }
    if (keysPressed.current.has('keys') || keysPressed.current.has('arrowdown')) {
      camera.position.add(forward.multiplyScalar(-moveSpeed));
    }

    // Left/Right
    if (keysPressed.current.has('keya') || keysPressed.current.has('arrowleft')) {
      camera.position.add(right.multiplyScalar(-moveSpeed));
    }
    if (keysPressed.current.has('keyd') || keysPressed.current.has('arrowright')) {
      camera.position.add(right.multiplyScalar(moveSpeed));
    }

    // Up/Down
    if (keysPressed.current.has('keyq') || keysPressed.current.has('space')) {
      camera.position.add(up.multiplyScalar(moveSpeed));
    }
    if (keysPressed.current.has('keye') || keysPressed.current.has('shiftleft')) {
      camera.position.add(up.multiplyScalar(-moveSpeed));
    }

    // Rotation controls
    if (keysPressed.current.has('keyi')) {
      camera.rotation.x -= rotateSpeed;
    }
    if (keysPressed.current.has('keyk')) {
      camera.rotation.x += rotateSpeed;
    }
    if (keysPressed.current.has('keyj')) {
      camera.rotation.y += rotateSpeed;
    }
    if (keysPressed.current.has('keyl')) {
      camera.rotation.y -= rotateSpeed;
    }
  });

  return null;
};

const Block: React.FC<BlockProps> = ({ title, description }) => {
  // Game state
  const [gameMode, setGameMode] = useState<'tutorial' | 'practice' | 'challenge'>('tutorial');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Welcome! Select atoms from the periodic table to start building molecules.');

  // 3D scene state
  const [placedAtoms, setPlacedAtoms] = useState<PlacedAtom[]>([]);
  const [bonds, setBonds] = useState<MolecularBond[]>([]);
  const [selectedAtom, setSelectedAtom] = useState<string | null>('H');
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [showElectrons, setShowElectrons] = useState(true);
  const [builtMolecules, setBuiltMolecules] = useState<string[]>([]);
  
  // Bond creation mode
  const [bondingMode, setBondingMode] = useState(false);
  const [firstAtomForBond, setFirstAtomForBond] = useState<string | null>(null);

  // Camera control state
  const [cameraControlsEnabled, setCameraControlsEnabled] = useState(true);
  const [keyboardControlsEnabled, setKeyboardControlsEnabled] = useState(true);
  const orbitControlsRef = useRef<any>(null);

  const atomIdCounter = useRef(0);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  // Send completion event
  useEffect(() => {
    if (builtMolecules.length > 0) {
      window.postMessage({ 
        type: 'BLOCK_COMPLETION', 
        blockId: 'molecular-bonding-lab', 
        completed: true,
        score: score,
        moleculesBuilt: builtMolecules.length
      }, '*');
      window.parent.postMessage({ 
        type: 'BLOCK_COMPLETION', 
        blockId: 'molecular-bonding-lab', 
        completed: true,
        score: score,
        moleculesBuilt: builtMolecules.length
      }, '*');
    }
  }, [builtMolecules.length, score]);

  // Helper function to show temporary messages
  const showMessage = useCallback((msg: string, duration = 3000) => {
    setMessage(msg);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage('');
    }, duration);
  }, []);

  // Delete atom function
  const deleteAtom = useCallback((atomId: string) => {
    const atomToDelete = placedAtoms.find(atom => atom.id === atomId);
    if (!atomToDelete) return;

    // Remove all bonds connected to this atom
    const bondsToRemove = bonds.filter(bond => 
      bond.atom1Id === atomId || bond.atom2Id === atomId
    );
    
    setBonds(prev => prev.filter(bond => 
      bond.atom1Id !== atomId && bond.atom2Id !== atomId
    ));

    // Update available bonds for atoms that were connected to the deleted atom
    const affectedAtomIds = bondsToRemove.flatMap(bond => 
      bond.atom1Id === atomId ? [bond.atom2Id] : [bond.atom1Id]
    );

    setPlacedAtoms(prev => {
      const updatedAtoms = prev.filter(atom => atom.id !== atomId);
      
      // Update available bonds for affected atoms
      return updatedAtoms.map(atom => {
        if (affectedAtomIds.includes(atom.id)) {
          const remainingBonds = bonds.filter(bond => 
            (bond.atom1Id === atom.id || bond.atom2Id === atom.id) &&
            bond.atom1Id !== atomId && bond.atom2Id !== atomId
          ).length;
          
          return {
            ...atom,
            availableBonds: calculateAvailableBonds(atom.atomData, remainingBonds)
          };
        }
        return atom;
      });
    });

    // Clear selection if the deleted atom was selected
    if (selectedAtomId === atomId) {
      setSelectedAtomId(null);
    }
    if (firstAtomForBond === atomId) {
      setFirstAtomForBond(null);
    }

    showMessage(`${atomToDelete.symbol} atom deleted!`);
  }, [placedAtoms, bonds, selectedAtomId, firstAtomForBond, showMessage]);

  // Handle keyboard events for deletion
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Delete or Suppr key (different keyboard layouts)
      if ((event.key === 'Delete' || event.code === 'Delete' || 
           event.key === 'Suppr' || event.code === 'Suppr') && 
          selectedAtomId) {
        event.preventDefault();
        deleteAtom(selectedAtomId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAtomId, deleteAtom]);

  // Calculate available bonds for an atom based on valence electrons and existing bonds
  const calculateAvailableBonds = (atomData: AtomData, existingBonds: number): number => {
    // Simple bonding rules based on valence electrons
    const maxBonds = {
      'H': 1,  // Hydrogen can make 1 bond
      'O': 2,  // Oxygen can make 2 bonds
      'N': 3,  // Nitrogen can make 3 bonds
      'C': 4,  // Carbon can make 4 bonds
      'F': 1,  // Fluorine can make 1 bond
      'Cl': 1, // Chlorine can make 1 bond
      'Na': 1, // Sodium can make 1 bond (ionic)
      'Mg': 2  // Magnesium can make 2 bonds (ionic)
    };
    
    const max = maxBonds[atomData.symbol as keyof typeof maxBonds] || 1;
    return Math.max(0, max - existingBonds);
  };

  // Add atom to scene
  const addAtom = (atomSymbol: string) => {
    if (!ATOMS[atomSymbol]) return;

    const atomData = ATOMS[atomSymbol];
    const newAtom: PlacedAtom = {
      id: `atom-${++atomIdCounter.current}`,
      symbol: atomSymbol,
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ],
      atomData: atomData,
      availableBonds: calculateAvailableBonds(atomData, 0)
    };

    setPlacedAtoms(prev => [...prev, newAtom]);
    showMessage(`Added ${atomData.name} atom. Use Bond Mode to connect atoms!`);
  };

  // Handle atom selection from periodic table
  const handleAtomSelect = (atomSymbol: string) => {
    setSelectedAtom(atomSymbol);
    addAtom(atomSymbol);
  };

  // Handle atom drag start
  const handleAtomDragStart = (atomId: string, button: number) => {
    // Only handle left mouse button (button 0) for dragging
    if (button !== 0) return;
    
    if (!bondingMode) {
      setDragging(atomId);
      setSelectedAtomId(atomId);
      // Disable camera controls when dragging atoms
      setCameraControlsEnabled(false);
      setKeyboardControlsEnabled(false);
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }
    }
  };

  // Handle atom click for bonding or selection
  const handleAtomClick = (atomId: string, button: number) => {
    // Right click should not interact with atoms - let camera handle it
    if (button === 2) return;

    // Prevent event from firing if we're currently dragging
    if (dragging) return;

    if (!bondingMode) {
      setSelectedAtomId(atomId);
      return;
    }

    // In bonding mode - use a callback to ensure we have the latest state
    setFirstAtomForBond(currentFirst => {
      if (!currentFirst) {
        // Select first atom for bonding
        const atom = placedAtoms.find(a => a.id === atomId);
        if (atom && atom.availableBonds > 0) {
          showMessage(`Selected ${atom.symbol}. Now click another atom to create a bond.`);
          return atomId;
        } else {
          showMessage(`${atom?.symbol} cannot form more bonds!`);
          return null;
        }
      } else if (currentFirst === atomId) {
        // Clicked same atom, cancel
        showMessage('Bond creation cancelled.');
        return null;
      } else {
        // Try to create bond between first and second atom
        createBond(currentFirst, atomId);
        return null; // Reset after creating bond
      }
    });
  };

  // Create bond between two atoms
  const createBond = (atom1Id: string, atom2Id: string) => {
    const atom1 = placedAtoms.find(a => a.id === atom1Id);
    const atom2 = placedAtoms.find(a => a.id === atom2Id);

    if (!atom1 || !atom2) {
      showMessage('Invalid atoms selected!');
      return;
    }

    // Check if bond already exists
    const bondExists = bonds.some(bond => 
      (bond.atom1Id === atom1Id && bond.atom2Id === atom2Id) ||
      (bond.atom1Id === atom2Id && bond.atom2Id === atom1Id)
    );

    if (bondExists) {
      showMessage('Bond already exists between these atoms!');
      return;
    }

    // Check if atoms can bond
    if (atom1.availableBonds === 0) {
      showMessage(`${atom1.symbol} cannot form more bonds!`);
      return;
    }

    if (atom2.availableBonds === 0) {
      showMessage(`${atom2.symbol} cannot form more bonds!`);
      return;
    }

    if (!canBond(atom1.atomData, atom2.atomData)) {
      showMessage(`${atom1.symbol} and ${atom2.symbol} cannot bond together!`);
      return;
    }

    // Calculate distance to ensure atoms are reasonably close
    const distance = Math.sqrt(
      Math.pow(atom1.position[0] - atom2.position[0], 2) +
      Math.pow(atom1.position[1] - atom2.position[1], 2) +
      Math.pow(atom1.position[2] - atom2.position[2], 2)
    );

    if (distance > 4) {
      showMessage('Atoms are too far apart! Move them closer together first.');
      return;
    }

    // Create the bond
    const bondType = getBondType(atom1.atomData, atom2.atomData);
    const newBond: MolecularBond = {
      id: `bond-${Date.now()}-${Math.random()}`,
      atom1Id: atom1Id,
      atom2Id: atom2Id,
      type: bondType,
      strength: 1
    };

    // Update bonds
    setBonds(prev => [...prev, newBond]);

    // Update available bonds for both atoms
    setPlacedAtoms(prev => prev.map(atom => {
      if (atom.id === atom1Id || atom.id === atom2Id) {
        const existingBonds = bonds.filter(bond => 
          bond.atom1Id === atom.id || bond.atom2Id === atom.id
        ).length + 1; // +1 for the bond we're adding
        
        return {
          ...atom,
          availableBonds: calculateAvailableBonds(atom.atomData, existingBonds)
        };
      }
      return atom;
    }));

    // Update score
    setScore(prev => prev + (bondType === 'ionic' ? 15 : 10));
    showMessage(`${bondType.toUpperCase()} bond created! ${atom1.symbol}-${atom2.symbol} (+${bondType === 'ionic' ? 15 : 10} points)`);

    // Check for molecule completion
    setTimeout(() => {
      const updatedAtoms = placedAtoms;
      const updatedBonds = [...bonds, newBond];
      checkMoleculeCompletion(updatedAtoms, updatedBonds);
    }, 100);
  };

  // Remove bond
  const removeBond = (bondId: string) => {
    const bondToRemove = bonds.find(b => b.id === bondId);
    if (!bondToRemove) return;

    setBonds(prev => prev.filter(bond => bond.id !== bondId));

    // Update available bonds for affected atoms
    setPlacedAtoms(prev => prev.map(atom => {
      if (atom.id === bondToRemove.atom1Id || atom.id === bondToRemove.atom2Id) {
        const existingBonds = bonds.filter(bond => 
          bond.id !== bondId && (bond.atom1Id === atom.id || bond.atom2Id === atom.id)
        ).length;
        
        return {
          ...atom,
          availableBonds: calculateAvailableBonds(atom.atomData, existingBonds)
        };
      }
      return atom;
    }));

    showMessage('Bond removed!');
  };

  // Check if molecule is complete
  const checkMoleculeCompletion = useCallback((currentAtoms: PlacedAtom[], currentBonds: MolecularBond[]) => {
    MOLECULES.forEach(molecule => {
      const atomCounts = molecule.atoms.reduce((acc, atom) => {
        acc[atom] = (acc[atom] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const placedCounts = currentAtoms.reduce((acc, atom) => {
        acc[atom.symbol] = (acc[atom.symbol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Check if we have the exact atoms needed
      const hasExactAtoms = Object.entries(atomCounts).every(([symbol, count]) => 
        placedCounts[symbol] === count
      ) && Object.keys(placedCounts).length === Object.keys(atomCounts).length;

      // For simple molecules, check if we have the right number of bonds
      let hasCorrectBonds = false;
      if (molecule.formula === 'H2O') {
        // Water: O should have 2 bonds, each H should have 1 bond
        const oxygenAtom = currentAtoms.find(a => a.symbol === 'O');
        const hydrogenAtoms = currentAtoms.filter(a => a.symbol === 'H');
        
        if (oxygenAtom && hydrogenAtoms.length === 2) {
          const oxygenBonds = currentBonds.filter(b => 
            b.atom1Id === oxygenAtom.id || b.atom2Id === oxygenAtom.id
          );
          hasCorrectBonds = oxygenBonds.length === 2;
        }
      } else {
        // General rule: number of bonds should be atoms - 1 for simple molecules
        const requiredBonds = molecule.atoms.length - 1;
        hasCorrectBonds = currentBonds.length === requiredBonds;
      }

      if (hasExactAtoms && hasCorrectBonds && !builtMolecules.includes(molecule.formula)) {
        setBuiltMolecules(prev => [...prev, molecule.formula]);
        setScore(prev => prev + 100);
        showMessage(`🎉 Molecule completed: ${molecule.name} (${molecule.formula})! +100 points`, 4000);
        
        // Auto-advance challenge mode
        if (gameMode === 'challenge' && currentChallenge < MOLECULES.length - 1) {
          setTimeout(() => {
            setCurrentChallenge(prev => prev + 1);
            showMessage(`Next challenge: Build ${MOLECULES[currentChallenge + 1]?.formula}`);
          }, 3000);
        }
      }
    });
  }, [builtMolecules, gameMode, currentChallenge, showMessage, bonds]);

  // Handle atom drag end (only for positioning, no auto-bonding)
  const handleAtomDragEnd = (atomId: string, newPosition: [number, number, number]) => {
    setDragging(null);
    
    // Re-enable camera controls
    setCameraControlsEnabled(true);
    setKeyboardControlsEnabled(true);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = true;
    }
    
    // Just update atom position
    setPlacedAtoms(prev => 
      prev.map(atom => 
        atom.id === atomId ? { ...atom, position: newPosition } : atom
      )
    );
  };

  // Toggle bonding mode
  const toggleBondingMode = () => {
    setBondingMode(!bondingMode);
    setFirstAtomForBond(null);
    showMessage(
      !bondingMode 
        ? 'Bond Mode ON: Click two atoms to create a bond between them.'
        : 'Bond Mode OFF: You can now drag atoms to move them.'
    );
  };

  // Toggle keyboard controls
  const toggleKeyboardControls = () => {
    setKeyboardControlsEnabled(!keyboardControlsEnabled);
    showMessage(
      !keyboardControlsEnabled 
        ? 'Keyboard controls ON: Use WASD/Arrow keys to move camera'
        : 'Keyboard controls OFF: Only mouse controls camera'
    );
  };

  // Handle mouse events on canvas to control camera
  const handleCanvasPointerDown = (event: any) => {
    // Right mouse button - enable camera controls
    if (event.button === 2) {
      setCameraControlsEnabled(true);
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }
  };

  // Reset the scene
  const handleReset = () => {
    setPlacedAtoms([]);
    setBonds([]);
    setBuiltMolecules([]);
    setScore(0);
    setSelectedAtomId(null);
    setDragging(null);
    setBondingMode(false);
    setFirstAtomForBond(null);
    setCameraControlsEnabled(true);
    setKeyboardControlsEnabled(true);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    showMessage('Scene reset. Select atoms from the periodic table to start building!');
  };

  // Toggle game mode
  const handleModeChange = (mode: 'tutorial' | 'practice' | 'challenge') => {
    setGameMode(mode);
    setCurrentChallenge(0);
    handleReset(); // Reset when changing modes
    showMessage(
      mode === 'tutorial' ? 'Tutorial mode: Learn to create bonds manually!' :
      mode === 'practice' ? 'Practice mode: Build any molecules you want!' :
      `Challenge mode: Build ${MOLECULES[0]?.formula} to start!`
    );
  };

  // Next challenge
  const handleNextChallenge = () => {
    if (currentChallenge < MOLECULES.length - 1) {
      setCurrentChallenge(prev => prev + 1);
      showMessage(`Challenge ${currentChallenge + 2}: Build ${MOLECULES[currentChallenge + 1]?.formula}`);
      // Clear current atoms and bonds for new challenge
      setPlacedAtoms([]);
      setBonds([]);
    } else {
      showMessage('🏆 All challenges completed! Congratulations!', 5000);
    }
  };

  // Add some starter atoms in tutorial mode
  useEffect(() => {
    if (gameMode === 'tutorial' && placedAtoms.length === 0) {
      // Add H2O atoms for tutorial
      setTimeout(() => {
        addAtom('H');
        setTimeout(() => {
          addAtom('H');
          setTimeout(() => addAtom('O'), 500);
        }, 500);
        showMessage('Try building Water (H2O)! Left click = move atoms, Right click = move camera, WASD = camera movement, Bond Mode = connect atoms. Click an atom and press Delete/Suppr to remove it.', 10000);
      }, 1000);
    }
  }, [gameMode, placedAtoms.length]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
        onPointerDown={handleCanvasPointerDown}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        
        {/* Environment */}
        <Stars radius={300} depth={60} count={1000} factor={7} />
        <Environment preset="night" />
        
        {/* Keyboard Camera Controls */}
        <KeyboardCameraControls enabled={keyboardControlsEnabled} />
        
        {/* Controls */}
        <OrbitControls
          ref={orbitControlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={cameraControlsEnabled}
          maxDistance={15}
          minDistance={3}
          mouseButtons={{
            LEFT: null, // Disable left click for camera
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE // Only right click rotates camera
          }}
          touches={{
            ONE: null, // Disable single touch for camera on mobile
            TWO: THREE.TOUCH.DOLLY_PAN
          }}
        />

        {/* Atoms */}
        {placedAtoms.map(atom => (
          <Atom3D
            key={atom.id}
            atomData={atom.atomData}
            position={atom.position}
            selected={selectedAtomId === atom.id || firstAtomForBond === atom.id}
            dragging={dragging === atom.id}
            onSelect={(button) => handleAtomClick(atom.id, button)}
            onDragStart={(button) => handleAtomDragStart(atom.id, button)}
            onDragEnd={(newPosition) => handleAtomDragEnd(atom.id, newPosition)}
            showElectrons={showElectrons}
            highlight={bondingMode && firstAtomForBond === atom.id}
            availableBonds={atom.availableBonds}
          />
        ))}

        {/* Bonds */}
        {bonds.map(bond => {
          const atom1 = placedAtoms.find(a => a.id === bond.atom1Id);
          const atom2 = placedAtoms.find(a => a.id === bond.atom2Id);
          
          if (!atom1 || !atom2) return null;
          
          return (
            <Bond3D
              key={bond.id}
              start={atom1.position}
              end={atom2.position}
              type={bond.type}
              strength={bond.strength}
              animated={true}
              onRemove={() => removeBond(bond.id)}
            />
          );
        })}

        {/* Grid for reference */}
        <gridHelper args={[20, 20, '#333333', '#333333']} position={[0, -3, 0]} />
      </Canvas>

      {/* UI Overlay */}
      <GameUI
        selectedAtom={selectedAtom}
        currentChallenge={currentChallenge}
        score={score}
        gameMode={gameMode}
        showElectrons={showElectrons}
        bondingMode={bondingMode}
        firstAtomForBond={firstAtomForBond}
        keyboardControlsEnabled={keyboardControlsEnabled}
        onAtomSelect={handleAtomSelect}
        onToggleElectrons={() => setShowElectrons(!showElectrons)}
        onToggleBondingMode={toggleBondingMode}
        onToggleKeyboardControls={toggleKeyboardControls}
        onModeChange={handleModeChange}
        onReset={handleReset}
        onNextChallenge={handleNextChallenge}
        builtMolecules={builtMolecules}
        message={message}
        placedAtoms={placedAtoms}
      />
    </div>
  );
};

export default Block;