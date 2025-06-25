import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
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
}

interface MolecularBond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  type: 'ionic' | 'covalent';
  strength: number;
}

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

  // Add atom to scene
  const addAtom = (atomSymbol: string) => {
    if (!ATOMS[atomSymbol]) return;

    const newAtom: PlacedAtom = {
      id: `atom-${++atomIdCounter.current}`,
      symbol: atomSymbol,
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ],
      atomData: ATOMS[atomSymbol]
    };

    setPlacedAtoms(prev => [...prev, newAtom]);
    showMessage(`Added ${ATOMS[atomSymbol].name} atom. Drag it to build molecules!`);
  };

  // Handle atom selection from periodic table
  const handleAtomSelect = (atomSymbol: string) => {
    setSelectedAtom(atomSymbol);
    addAtom(atomSymbol);
  };

  // Handle atom drag start
  const handleAtomDragStart = (atomId: string) => {
    setDragging(atomId);
    setSelectedAtomId(atomId);
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

      // Check if we have the exact atoms needed (not more)
      const hasExactAtoms = Object.entries(atomCounts).every(([symbol, count]) => 
        placedCounts[symbol] === count
      ) && Object.keys(placedCounts).length === Object.keys(atomCounts).length;

      // Check if we have the right number of bonds
      const requiredBonds = molecule.atoms.length - 1;
      const hasCorrectBonds = currentBonds.length === requiredBonds;

      if (hasExactAtoms && hasCorrectBonds && !builtMolecules.includes(molecule.formula)) {
        setBuiltMolecules(prev => [...prev, molecule.formula]);
        setScore(prev => prev + 50);
        showMessage(`🎉 Molecule completed: ${molecule.name} (${molecule.formula})! +50 points`, 4000);
        
        // Auto-advance challenge mode
        if (gameMode === 'challenge' && currentChallenge < MOLECULES.length - 1) {
          setTimeout(() => {
            setCurrentChallenge(prev => prev + 1);
            showMessage(`Next challenge: Build ${MOLECULES[currentChallenge + 1]?.formula}`);
          }, 3000);
        }
      }
    });
  }, [builtMolecules, gameMode, currentChallenge, showMessage]);

  // Handle atom drag end - check for bonding
  const handleAtomDragEnd = (atomId: string, newPosition: [number, number, number]) => {
    setDragging(null);
    
    // Update atom position
    setPlacedAtoms(prev => {
      const updatedAtoms = prev.map(atom => 
        atom.id === atomId ? { ...atom, position: newPosition } : atom
      );

      // Check for potential bonds with nearby atoms
      const draggedAtom = updatedAtoms.find(a => a.id === atomId);
      if (!draggedAtom) return updatedAtoms;

      let newBonds: MolecularBond[] = [];
      let bondsFormed = false;

      updatedAtoms.forEach(otherAtom => {
        if (otherAtom.id === atomId) return;

        const distance = Math.sqrt(
          Math.pow(newPosition[0] - otherAtom.position[0], 2) +
          Math.pow(newPosition[1] - otherAtom.position[1], 2) +
          Math.pow(newPosition[2] - otherAtom.position[2], 2)
        );

        // If atoms are close enough and can bond
        if (distance < 1.5 && canBond(draggedAtom.atomData, otherAtom.atomData)) {
          // Check if bond already exists
          const bondExists = bonds.some(bond => 
            (bond.atom1Id === atomId && bond.atom2Id === otherAtom.id) ||
            (bond.atom1Id === otherAtom.id && bond.atom2Id === atomId)
          );

          if (!bondExists) {
            const bondType = getBondType(draggedAtom.atomData, otherAtom.atomData);
            const newBond: MolecularBond = {
              id: `bond-${Date.now()}-${Math.random()}`,
              atom1Id: atomId,
              atom2Id: otherAtom.id,
              type: bondType,
              strength: 1
            };

            newBonds.push(newBond);
            bondsFormed = true;
            setScore(prev => prev + (bondType === 'ionic' ? 15 : 10));
            showMessage(`${bondType.toUpperCase()} bond formed! ${draggedAtom.symbol}-${otherAtom.symbol} (+${bondType === 'ionic' ? 15 : 10} points)`);
          }
        }
      });

      // Update bonds if new ones were formed
      if (bondsFormed) {
        setBonds(prev => {
          const updatedBonds = [...prev, ...newBonds];
          // Check for molecule completion with updated state
          setTimeout(() => checkMoleculeCompletion(updatedAtoms, updatedBonds), 100);
          return updatedBonds;
        });
      }

      return updatedAtoms;
    });
  };

  // Reset the scene
  const handleReset = () => {
    setPlacedAtoms([]);
    setBonds([]);
    setBuiltMolecules([]);
    setScore(0);
    setSelectedAtomId(null);
    setDragging(null);
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
      mode === 'tutorial' ? 'Tutorial mode: Explore and learn about molecular bonding!' :
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
      // Add a couple of hydrogen atoms to get started
      setTimeout(() => {
        addAtom('H');
        setTimeout(() => addAtom('H'), 500);
      }, 1000);
    }
  }, [gameMode, placedAtoms.length]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
        
        {/* Environment */}
        <Stars radius={300} depth={60} count={1000} factor={7} />
        <Environment preset="night" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={15}
          minDistance={3}
        />

        {/* Atoms */}
        {placedAtoms.map(atom => (
          <Atom3D
            key={atom.id}
            atomData={atom.atomData}
            position={atom.position}
            selected={selectedAtomId === atom.id}
            dragging={dragging === atom.id}
            onSelect={() => setSelectedAtomId(atom.id)}
            onDragStart={() => handleAtomDragStart(atom.id)}
            onDragEnd={(newPosition) => handleAtomDragEnd(atom.id, newPosition)}
            showElectrons={showElectrons}
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
        onAtomSelect={handleAtomSelect}
        onToggleElectrons={() => setShowElectrons(!showElectrons)}
        onModeChange={handleModeChange}
        onReset={handleReset}
        onNextChallenge={handleNextChallenge}
        builtMolecules={builtMolecules}
        message={message}
      />
    </div>
  );
};

export default Block;