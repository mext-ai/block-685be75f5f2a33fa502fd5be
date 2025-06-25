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
  onAtomSelect: (atomSymbol: string) => void;
  onToggleElectrons: () => void;
  onToggleBondingMode: () => void;
  onModeChange: (mode: 'tutorial' | 'practice' | 'challenge') => void;
  onReset: () => void;
  onNextChallenge: () => void;
  builtMolecules: string[];
  message: string;
  placedAtoms: PlacedAtom[];
}

export const GameUI: React.FC<GameUIProps> = ({
  selectedAtom,
  currentChallenge,
  score,
  gameMode,
  showElectrons,
  bondingMode,
  firstAtomForBond,
  onAtomSelect,
  onToggleElectrons,
  onToggleBondingMode,
  onModeChange,
  onReset,
  onNextChallenge,
  builtMolecules,
  message,
  placedAtoms
}) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const currentTarget = MOLECULES[currentChallenge];

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
            Use Bond Mode to manually create bonds between atoms!
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
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        pointerEvents: 'auto'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px',
          borderRadius: '10px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Periodic Table</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '10px'
          }}>
            {Object.entries(ATOMS).map(([symbol, atom]) => (
              <button
                key={symbol}
                onClick={() => onAtomSelect(symbol)}
                style={{
                  width: '60px',
                  height: '60px',
                  border: selectedAtom === symbol ? '3px solid #ffff00' : '2px solid #666',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${atom.color}88, ${atom.color}cc)`,
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
                title={`${atom.name} - ${atom.valenceElectrons} valence electrons`}
              >
                <div style={{ fontSize: '16px' }}>{symbol}</div>
                <div style={{ fontSize: '10px' }}>{atom.valenceElectrons}e⁻</div>
              </button>
            ))}
          </div>
        </div>
      </div>

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
            maxWidth: '280px',
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
            <ul style={{ margin: 0, paddingLeft: '15px' }}>
              <li><strong>Add Atoms:</strong> Click elements in the periodic table</li>
              <li><strong>Move Atoms:</strong> Drag atoms in 3D space (when Bond Mode is OFF)</li>
              <li><strong>Create Bonds:</strong> Turn on Bond Mode, then click two atoms</li>
              <li><strong>Build Molecules:</strong> Connect atoms according to their bonding capacity</li>
              <li><strong>H2O Example:</strong> Add H + H + O, then bond each H to O</li>
              <li><strong>Bond Limits:</strong> H=1 bond, O=2 bonds, N=3, C=4</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};