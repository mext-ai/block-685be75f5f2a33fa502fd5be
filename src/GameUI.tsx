import React, { useState } from 'react';
import { ATOMS, MOLECULES, AtomData } from './atomData';

interface PlacedAtom {
  id: string;
  symbol: string;
  position: [number, number, number];
  atomData: AtomData;
  availableBonds: number;
}

interface GameUIProps {
  selectedAtom: string | null;
  currentChallenge: number;
  score: number;
  gameMode: 'tutorial' | 'practice' | 'challenge';
  showElectrons: boolean;
  bondingMode: boolean;
  firstAtomForBond: string | null;
  keyboardControlsEnabled: boolean;
  onAtomSelect: (atomSymbol: string) => void;
  onToggleElectrons: () => void;
  onToggleBondingMode: () => void;
  onToggleKeyboardControls: () => void;
  onModeChange: (mode: 'tutorial' | 'practice' | 'challenge') => void;
  onReset: () => void;
  onNextChallenge: () => void;
  builtMolecules: string[];
  message: string;
  placedAtoms: PlacedAtom[];
}

// Periodic table layout - position [row, col] for each element
const PERIODIC_LAYOUT: Record<string, [number, number]> = {
  // Period 1
  'H': [0, 0], 'He': [0, 17],
  
  // Period 2
  'Li': [1, 0], 'Be': [1, 1],
  'B': [1, 12], 'C': [1, 13], 'N': [1, 14], 'O': [1, 15], 'F': [1, 16], 'Ne': [1, 17],
  
  // Period 3
  'Na': [2, 0], 'Mg': [2, 1],
  'Al': [2, 12], 'Si': [2, 13], 'P': [2, 14], 'S': [2, 15], 'Cl': [2, 16], 'Ar': [2, 17],
  
  // Period 4
  'K': [3, 0], 'Ca': [3, 1],
  'Sc': [3, 2], 'Ti': [3, 3], 'V': [3, 4], 'Cr': [3, 5], 'Mn': [3, 6], 'Fe': [3, 7], 'Co': [3, 8], 'Ni': [3, 9], 'Cu': [3, 10], 'Zn': [3, 11],
  'Ga': [3, 12], 'Ge': [3, 13], 'As': [3, 14], 'Se': [3, 15], 'Br': [3, 16], 'Kr': [3, 17],
  
  // Period 5
  'Rb': [4, 0], 'Sr': [4, 1], 'Ag': [4, 10], 'I': [4, 16],
  
  // Period 6
  'Cs': [5, 0], 'Ba': [5, 1], 'Au': [5, 10], 'Hg': [5, 11], 'Pb': [5, 13]
};

export const GameUI: React.FC<GameUIProps> = ({
  selectedAtom,
  currentChallenge,
  score,
  gameMode,
  showElectrons,
  bondingMode,
  firstAtomForBond,
  keyboardControlsEnabled,
  onAtomSelect,
  onToggleElectrons,
  onToggleBondingMode,
  onToggleKeyboardControls,
  onModeChange,
  onReset,
  onNextChallenge,
  builtMolecules,
  message,
  placedAtoms
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [showPeriodicTable, setShowPeriodicTable] = useState(true);
  const currentTarget = MOLECULES[currentChallenge];

  // Create periodic table grid
  const createPeriodicTableGrid = () => {
    const grid: (string | null)[][] = Array(6).fill(null).map(() => Array(18).fill(null));
    
    // Place atoms in their positions
    Object.entries(PERIODIC_LAYOUT).forEach(([symbol, [row, col]]) => {
      if (ATOMS[symbol]) {
        grid[row][col] = symbol;
      }
    });
    
    return grid;
  };

  const periodicGrid = createPeriodicTableGrid();

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'auto'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#00ffff' }}>
            🧪 Molecular Bonding Lab
          </h1>
          <p style={{ margin: '5px 0', fontSize: '14px', opacity: 0.8 }}>
            Left click = move atoms, Right click = rotate camera, WASD = move camera
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Score: {score}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Molecules: {builtMolecules.length}
            </div>
          </div>
        </div>
      </div>

      {/* Bond Mode Status */}
      {bondingMode && (
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(255, 215, 0, 0.9)',
            color: 'black',
            padding: '10px 20px',
            borderRadius: '20px',
            textAlign: 'center',
            fontWeight: 'bold',
            border: '2px solid #ffff00'
          }}>
            🔗 BOND MODE ACTIVE 
            {firstAtomForBond ? ' - Click second atom to bond' : ' - Click first atom'}
          </div>
        </div>
      )}

      {/* Keyboard Controls Status */}
      {keyboardControlsEnabled && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '280px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 255, 0, 0.8)',
            color: 'black',
            padding: '5px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            ⌨️ WASD Controls ON
          </div>
        </div>
      )}

      {/* Game Mode Selector */}
      <div style={{
        position: 'absolute',
        top: '130px',
        left: '20px',
        pointerEvents: 'auto'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '10px',
          minWidth: '200px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Game Mode</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {(['tutorial', 'practice', 'challenge'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => onModeChange(mode)}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  background: gameMode === mode ? '#00ffff' : '#444',
                  color: gameMode === mode ? 'black' : 'white',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Periodic Table */}
      {showPeriodicTable && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #00ffff'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Periodic Table</h3>
              <button
                onClick={() => setShowPeriodicTable(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00ffff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  width: '20px',
                  height: '20px'
                }}
                title="Hide periodic table"
              >
                ✕
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: '2px',
              width: 'fit-content'
            }}>
              {periodicGrid.map((row, rowIndex) =>
                row.map((symbol, colIndex) => {
                  if (!symbol || !ATOMS[symbol]) {
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          width: '32px',
                          height: '32px'
                        }}
                      />
                    );
                  }
                  
                  const atom = ATOMS[symbol];
                  return (
                    <button
                      key={symbol}
                      onClick={() => onAtomSelect(symbol)}
                      style={{
                        width: '32px',
                        height: '32px',
                        border: selectedAtom === symbol ? '2px solid #ffff00' : '1px solid #666',
                        borderRadius: '4px',
                        background: `linear-gradient(135deg, ${atom.color}88, ${atom.color}cc)`,
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        padding: '1px'
                      }}
                      title={`${atom.name} (${atom.symbol})\nAtomic #: ${atom.atomicNumber}\nValence: ${atom.valenceElectrons}e⁻\nGroup: ${atom.group}, Period: ${atom.period}`}
                    >
                      <div style={{ fontSize: '12px', lineHeight: '1' }}>{symbol}</div>
                      <div style={{ fontSize: '8px', lineHeight: '1', opacity: 0.8 }}>{atom.atomicNumber}</div>
                    </button>
                  );
                })
              )}
            </div>
            
            <div style={{ 
              marginTop: '10px', 
              fontSize: '10px', 
              color: '#888',
              display: 'flex',
              gap: '15px'
            }}>
              <div>🔴 <span style={{ color: '#ff6666' }}>Non-metals</span></div>
              <div>🔵 <span style={{ color: '#66b3ff' }}>Metals</span></div>
              <div>🟡 <span style={{ color: '#ffff66' }}>Metalloids</span></div>
              <div>⚪ <span style={{ color: '#cccccc' }}>Noble gases</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Periodic Table Button (when hidden) */}
      {!showPeriodicTable && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setShowPeriodicTable(true)}
            style={{
              padding: '15px 20px',
              border: 'none',
              borderRadius: '10px',
              background: '#00ffff',
              color: 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            📊 Show Periodic Table
          </button>
        </div>
      )}

      {/* Controls */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        pointerEvents: 'auto'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            onClick={onToggleBondingMode}
            style={{
              padding: '12px 15px',
              border: 'none',
              borderRadius: '5px',
              background: bondingMode ? '#ffff00' : '#4ecdc4',
              color: bondingMode ? 'black' : 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {bondingMode ? '🔗 Exit Bond Mode' : '🔗 Bond Mode'}
          </button>

          <button
            onClick={onToggleKeyboardControls}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              background: keyboardControlsEnabled ? '#00ff00' : '#666',
              color: keyboardControlsEnabled ? 'black' : 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {keyboardControlsEnabled ? '⌨️ Keyboard ON' : '⌨️ Keyboard OFF'}
          </button>

          <button
            onClick={onToggleElectrons}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              background: showElectrons ? '#00ffff' : '#666',
              color: showElectrons ? 'black' : 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showElectrons ? '🔴 Hide Electrons' : '⚡ Show Electrons'}
          </button>
          
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              background: showInstructions ? '#ffff00' : '#666',
              color: showInstructions ? 'black' : 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showInstructions ? '📖 Hide Instructions' : '❓ Show Instructions'}
          </button>
          
          <button
            onClick={onReset}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              background: '#ff6b6b',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄 Reset
          </button>

          {gameMode === 'challenge' && (
            <button
              onClick={onNextChallenge}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                background: '#4ecdc4',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Next Challenge
            </button>
          )}
        </div>
      </div>

      {/* Atoms in Scene Display */}
      {placedAtoms.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '260px',
          left: '20px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            maxWidth: '220px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4ecdc4' }}>
              Atoms in Scene
            </h3>
            <div style={{ fontSize: '12px' }}>
              {placedAtoms.map((atom, index) => (
                <div key={atom.id} style={{ 
                  padding: '3px 0',
                  color: atom.availableBonds > 0 ? '#00ff00' : '#ff9999',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>{atom.symbol} - {atom.atomData.name}</span>
                  <span>Bonds: {atom.availableBonds}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Info */}
      {gameMode === 'challenge' && currentTarget && (
        <div style={{
          position: 'absolute',
          top: '130px',
          right: '20px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            minWidth: '200px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#ffff00' }}>
              Challenge {currentChallenge + 1}
            </h3>
            <div style={{ fontSize: '14px' }}>
              <strong>Build: {currentTarget.formula}</strong>
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '5px' }}>
              {currentTarget.name}
            </div>
            <div style={{ fontSize: '12px', marginTop: '10px' }}>
              <strong>Bond Type:</strong> {currentTarget.bondType}
            </div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              <strong>Atoms needed:</strong> {currentTarget.atoms.join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Built Molecules Display */}
      {builtMolecules.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '420px',
          left: '20px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            maxWidth: '200px'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#4ecdc4' }}>
              Built Molecules ✅
            </h3>
            <div style={{ fontSize: '12px' }}>
              {builtMolecules.map((molecule, index) => (
                <div key={index} style={{ 
                  padding: '3px 0',
                  color: '#00ff00'
                }}>
                  {molecule}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #00ffff',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{ fontSize: '16px', color: '#00ffff' }}>
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Instructions - Now toggleable */}
      {showInstructions && (
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
          pointerEvents: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '10px',
            maxWidth: '300px',
            fontSize: '12px',
            border: '2px solid #ffff00'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: 0, fontSize: '14px', color: '#ffff00' }}>
                How to Play
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Close instructions"
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#00ffff', fontSize: '12px' }}>Camera Controls:</h4>
              <ul style={{ margin: 0, paddingLeft: '15px' }}>
                <li><strong>Right Click + Drag:</strong> Rotate camera</li>
                <li><strong>WASD Keys:</strong> Move camera position</li>
                <li><strong>Q/E Keys:</strong> Move camera up/down</li>
                <li><strong>IJKL Keys:</strong> Rotate camera view</li>
                <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: '0 0 5px 0', color: '#00ffff', fontSize: '12px' }}>Atom Controls:</h4>
              <ul style={{ margin: 0, paddingLeft: '15px' }}>
                <li><strong>Add Atoms:</strong> Click elements in periodic table</li>
                <li><strong>Move Atoms:</strong> Left click + drag atoms</li>
                <li><strong>Create Bonds:</strong> Enable Bond Mode, click two atoms</li>
                <li><strong>Build Molecules:</strong> Follow bonding capacity limits</li>
                <li><strong>H2O Example:</strong> H + H + O, bond each H to O</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};