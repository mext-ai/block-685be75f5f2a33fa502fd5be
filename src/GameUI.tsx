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
  onBackToHome: () => void;
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
  onBackToHome,
  builtMolecules,
  message,
  placedAtoms
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPeriodicTable, setShowPeriodicTable] = useState(true);
  const [showAtomsList, setShowAtomsList] = useState(true);
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

  // Get mode display info
  const getModeInfo = () => {
    switch (gameMode) {
      case 'tutorial':
        return { name: 'Tutorial', color: '#ffd700', emoji: '📚' };
      case 'practice':
        return { name: 'Practice', color: '#4ecdc4', emoji: '🔬' };
      case 'challenge':
        return { name: 'Challenge', color: '#ff6b6b', emoji: '🏆' };
      default:
        return { name: 'Game', color: '#00ffff', emoji: '🎮' };
    }
  };

  const modeInfo = getModeInfo();

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
      {/* Top Header Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,51,102,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '2px solid #00ffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        pointerEvents: 'auto',
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            style={{
              padding: '10px 15px',
              border: 'none',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255,107,107,0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255,107,107,0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,107,107,0.3)';
            }}
            title="Press ESC to go back to home"
          >
            ← Home
          </button>

          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              color: '#00ffff', 
              textShadow: '0 0 10px rgba(0,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              🧪 Molecular Bonding Lab
              <span style={{
                fontSize: '16px',
                background: `linear-gradient(135deg, ${modeInfo.color} 0%, ${modeInfo.color}aa 100%)`,
                color: gameMode === 'tutorial' ? 'black' : 'white',
                padding: '4px 12px',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                {modeInfo.emoji} {modeInfo.name}
              </span>
            </h1>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8 }}>
              Interactive 3D Chemistry Simulation • Press ESC for menu
            </p>
          </div>
        </div>
        
        {/* Score and Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Bond Mode Status */}
          {bondingMode && (
            <div style={{
              background: 'linear-gradient(135deg, #ffff00 0%, #ff9900 100%)',
              color: 'black',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              animation: 'pulse 2s infinite'
            }}>
              🔗 BOND MODE
              {firstAtomForBond && <span style={{ fontSize: '10px' }}>→ Select 2nd atom</span>}
            </div>
          )}
          
          {/* Keyboard Status */}
          {keyboardControlsEnabled && (
            <div style={{
              background: 'rgba(0, 255, 0, 0.2)',
              border: '1px solid #00ff00',
              color: '#00ff00',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              ⌨️ WASD
            </div>
          )}
          
          {/* Score Display */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,51,102,0.6) 100%)',
            padding: '12px 20px',
            borderRadius: '15px',
            border: '2px solid #00ffff',
            textAlign: 'center',
            minWidth: '120px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#00ffff' }}>
              {score}
            </div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              Score • {builtMolecules.length} molecules
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar */}
      <div style={{
        position: 'absolute',
        top: '90px',
        left: '10px',
        width: '280px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Challenge Info */}
        {gameMode === 'challenge' && currentTarget && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.9) 0%, rgba(255,140,0,0.8) 100%)',
            color: 'black',
            padding: '15px',
            borderRadius: '12px',
            border: '2px solid #ffff00',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
              🎯 Challenge {currentChallenge + 1}
            </h3>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
              Build: {currentTarget.formula}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>
              {currentTarget.name}
            </div>
            <div style={{ fontSize: '12px', display: 'flex', gap: '15px' }}>
              <span><strong>Type:</strong> {currentTarget.bondType}</span>
              <span><strong>Atoms:</strong> {currentTarget.atoms.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Atoms in Scene */}
        {placedAtoms.length > 0 && showAtomsList && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '12px',
            border: '2px solid #4ecdc4',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#4ecdc4' }}>
                ⚛️ Atoms in Scene ({placedAtoms.length})
              </h3>
              <button
                onClick={() => setShowAtomsList(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4ecdc4',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0',
                  width: '20px',
                  height: '20px'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {placedAtoms.map((atom) => (
                <div key={atom.id} style={{ 
                  padding: '4px 0',
                  color: atom.availableBonds > 0 ? '#00ff00' : '#ff9999',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: atom.atomData.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '8px',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    }}>
                      {atom.symbol}
                    </div>
                    {atom.atomData.name}
                  </span>
                  <span style={{ 
                    background: atom.availableBonds > 0 ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.2)',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '10px'
                  }}>
                    {atom.availableBonds} bonds
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Built Molecules */}
        {builtMolecules.length > 0 && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            padding: '15px',
            borderRadius: '12px',
            border: '2px solid #00ff00',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#00ff00' }}>
              ✅ Completed Molecules ({builtMolecules.length})
            </h3>
            <div style={{ fontSize: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {builtMolecules.map((molecule, index) => (
                <div key={index} style={{ 
                  background: 'rgba(0,255,0,0.2)',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  border: '1px solid #00ff00',
                  color: '#00ff00',
                  fontWeight: 'bold'
                }}>
                  {molecule}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Controls */}
      <div style={{
        position: 'absolute',
        top: '90px',
        right: '10px',
        width: '200px',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Main Controls */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '12px',
          border: '2px solid #00ffff',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#00ffff' }}>🎮 Controls</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={onToggleBondingMode}
              style={{
                padding: '12px 15px',
                border: 'none',
                borderRadius: '8px',
                background: bondingMode 
                  ? 'linear-gradient(135deg, #ffff00 0%, #ff9900 100%)' 
                  : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: bondingMode ? 'black' : 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {bondingMode ? '🔗 Exit Bond Mode' : '🔗 Bond Mode'}
            </button>

            <button
              onClick={onToggleElectrons}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: showElectrons 
                  ? 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)' 
                  : 'rgba(255,255,255,0.1)',
                color: showElectrons ? 'black' : 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {showElectrons ? '🔴 Hide Electrons' : '⚡ Show Electrons'}
            </button>

            <button
              onClick={onToggleKeyboardControls}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: keyboardControlsEnabled 
                  ? 'linear-gradient(135deg, #00ff00 0%, #32cd32 100%)' 
                  : 'rgba(255,255,255,0.1)',
                color: keyboardControlsEnabled ? 'black' : 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {keyboardControlsEnabled ? '⌨️ Keyboard ON' : '⌨️ Keyboard OFF'}
            </button>
            
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: showInstructions 
                  ? 'linear-gradient(135deg, #ffff00 0%, #ffd700 100%)' 
                  : 'rgba(255,255,255,0.1)',
                color: showInstructions ? 'black' : 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {showInstructions ? '📖 Hide Help' : '❓ Show Help'}
            </button>
            
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '5px 0' }} />
            
            <button
              onClick={onReset}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              🔄 Reset Scene
            </button>

            {gameMode === 'challenge' && (
              <button
                onClick={onNextChallenge}
                style={{
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                ➡️ Next Challenge
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Panel - Periodic Table */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'auto'
      }}>
        {showPeriodicTable ? (
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)',
            padding: '15px',
            borderRadius: '15px',
            border: '2px solid #00ffff',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 10px 30px rgba(0,255,255,0.3)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#00ffff' }}>
                🧪 Periodic Table
              </h3>
              <button
                onClick={() => setShowPeriodicTable(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid #00ffff',
                  color: '#00ffff',
                  cursor: 'pointer',
                  fontSize: '12px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}
              >
                ✕ Hide
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: '2px',
              width: 'fit-content',
              margin: '0 auto'
            }}>
              {periodicGrid.map((row, rowIndex) =>
                row.map((symbol, colIndex) => {
                  if (!symbol || !ATOMS[symbol]) {
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                          width: '28px',
                          height: '28px'
                        }}
                      />
                    );
                  }
                  
                  const atom = ATOMS[symbol];
                  const isSelected = selectedAtom === symbol;
                  
                  return (
                    <button
                      key={symbol}
                      onClick={() => onAtomSelect(symbol)}
                      style={{
                        width: '28px',
                        height: '28px',
                        border: isSelected ? '2px solid #ffff00' : '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '4px',
                        background: isSelected 
                          ? `linear-gradient(135deg, ${atom.color}ff, ${atom.color}cc)` 
                          : `linear-gradient(135deg, ${atom.color}aa, ${atom.color}88)`,
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                        padding: '1px',
                        transition: 'all 0.2s ease',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isSelected ? '0 0 10px rgba(255,255,0,0.5)' : 'none'
                      }}
                      title={`${atom.name} (${atom.symbol})\nAtomic #: ${atom.atomicNumber}\nValence: ${atom.valenceElectrons}e⁻\nGroup: ${atom.group}, Period: ${atom.period}`}
                    >
                      <div style={{ fontSize: '10px', lineHeight: '1' }}>{symbol}</div>
                      <div style={{ fontSize: '7px', lineHeight: '1', opacity: 0.8 }}>{atom.atomicNumber}</div>
                    </button>
                  );
                })
              )}
            </div>
            
            <div style={{ 
              marginTop: '10px', 
              fontSize: '9px', 
              color: '#888',
              display: 'flex',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <span>🔴 Non-metals</span>
              <span>🔵 Metals</span>
              <span>🟡 Metalloids</span>
              <span>⚪ Noble gases</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPeriodicTable(true)}
            style={{
              padding: '15px 25px',
              border: 'none',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #00ffff 0%, #0099cc 100%)',
              color: 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 5px 15px rgba(0,255,255,0.3)'
            }}
          >
            🧪 Show Periodic Table
          </button>
        )}
      </div>

      {/* Floating Atoms List Toggle */}
      {placedAtoms.length > 0 && !showAtomsList && (
        <div style={{
          position: 'absolute',
          top: '90px',
          left: '300px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={() => setShowAtomsList(true)}
            style={{
              padding: '8px 12px',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(78, 205, 196, 0.8)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              backdropFilter: 'blur(5px)'
            }}
          >
            ⚛️ Show Atoms ({placedAtoms.length})
          </button>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
          zIndex: 2000
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)',
            padding: '20px 30px',
            borderRadius: '15px',
            border: '2px solid #00ffff',
            textAlign: 'center',
            maxWidth: '500px',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 10px 30px rgba(0,255,255,0.3)'
          }}>
            <div style={{ 
              fontSize: '16px', 
              color: '#00ffff',
              lineHeight: '1.4'
            }}>
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Instructions Panel */}
      {showInstructions && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
          zIndex: 2000,
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.95)',
            padding: '25px',
            borderRadius: '15px',
            border: '2px solid #ffff00',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 10px 30px rgba(255,255,0,0.3)',
            width: '600px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#ffff00' }}>
                📚 How to Play
              </h3>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid #ffff00',
                  color: '#ffff00',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                ✕ Close
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>🎮 Camera Controls</h4>
                <ul style={{ margin: 0, paddingLeft: '15px', lineHeight: '1.6' }}>
                  <li><strong>Right Click + Drag:</strong> Rotate camera</li>
                  <li><strong>WASD Keys:</strong> Move camera position</li>
                  <li><strong>Q/E Keys:</strong> Move camera up/down</li>
                  <li><strong>IJKL Keys:</strong> Rotate camera view</li>
                  <li><strong>Mouse Wheel:</strong> Zoom in/out</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#00ffff', fontSize: '14px' }}>⚛️ Atom Controls</h4>
                <ul style={{ margin: 0, paddingLeft: '15px', lineHeight: '1.6' }}>
                  <li><strong>Add Atoms:</strong> Click elements in periodic table</li>
                  <li><strong>Move Atoms:</strong> Left click + drag atoms</li>
                  <li><strong>Create Bonds:</strong> Enable Bond Mode, click two atoms</li>
                  <li><strong>Remove Bonds:</strong> Right-click on bond lines</li>
                  <li><strong>Build Molecules:</strong> Follow bonding capacity limits</li>
                  <li><strong>Example:</strong> H₂O = H + H + O, bond each H to O</li>
                </ul>
              </div>
            </div>
            
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,255,255,0.1)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#00ffff', fontSize: '14px' }}>💡 Tips</h4>
              <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '12px', lineHeight: '1.6' }}>
                <li>Start with simple molecules like H₂ or H₂O</li>
                <li>Check atom bonding capacity (shown in atoms list)</li>
                <li>Use Bond Mode to connect atoms precisely</li>
                <li>Right-click on bond lines to remove unwanted bonds</li>
                <li>Noble gases (He, Ne, Ar) don't form bonds</li>
                <li>Press ESC to return to the main menu</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};