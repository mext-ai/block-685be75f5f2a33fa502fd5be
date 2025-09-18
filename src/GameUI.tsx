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
  const [expandedPanels, setExpandedPanels] = useState({
    elements: true,
    atoms: true,
    molecules: true
  });
  
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
        return { name: 'Tutorial', color: '#6366f1', emoji: '📚', gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' };
      case 'practice':
        return { name: 'Practice', color: '#06b6d4', emoji: '🔬', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' };
      case 'challenge':
        return { name: 'Challenge', color: '#f59e0b', emoji: '🏆', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' };
      default:
        return { name: 'Game', color: '#10b981', emoji: '🎮', gradient: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' };
    }
  };

  const modeInfo = getModeInfo();

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  // Modern card style
  const cardStyle: React.CSSProperties = {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  };

  // Modern button style
  const buttonStyle: React.CSSProperties = {
    border: 'none',
    borderRadius: '16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: 'white',
      fontSize: '14px',
      lineHeight: '1.5'
    }}>
      {/* Modern Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'auto',
        zIndex: 50
      }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Back Button */}
          <button
            onClick={onBackToHome}
            style={{
              ...buttonStyle,
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Press ESC to go back"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </button>

          {/* Title Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🧪
            </div>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Molecular Bonding Lab
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <span style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  background: modeInfo.gradient,
                  color: 'white'
                }}>
                  {modeInfo.emoji} {modeInfo.name}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Interactive 3D Chemistry
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Bond Mode Indicator */}
          {bondingMode && (
            <div style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: 'black',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: '700',
              animation: 'pulse 2s infinite'
            }}>
              🔗 BOND MODE {firstAtomForBond && '→ Select 2nd atom'}
            </div>
          )}

          {/* Keyboard Status */}
          {keyboardControlsEnabled && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '12px',
              color: '#22c55e',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              ⌨️ WASD
            </div>
          )}

          {/* Score Display */}
          <div style={{
            padding: '16px 24px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#06b6d4' }}>{score}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
              {builtMolecules.length} molecules
            </div>
          </div>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside style={{
        position: 'fixed',
        left: '20px',
        top: '100px',
        width: '320px',
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
        pointerEvents: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Challenge Card */}
        {gameMode === 'challenge' && currentTarget && (
          <div style={{ ...cardStyle, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎯
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                  Challenge {currentChallenge + 1}
                </h3>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                  Build the target molecule
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>
                  {currentTarget.formula}
                </span>
                <span style={{
                  padding: '6px 12px',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#f59e0b',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {currentTarget.bondType}
                </span>
              </div>
              <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                {currentTarget.name}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {currentTarget.atoms.map((atom, i) => (
                  <span key={i} style={{
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {atom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Atoms in Scene */}
        {placedAtoms.length > 0 && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onClick={() => togglePanel('atoms')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  ⚛️
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Atoms in Scene</h3>
                  <p style={{ margin: '2px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                    {placedAtoms.length} atoms placed
                  </p>
                </div>
              </div>
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  transform: expandedPanels.atoms ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPanels.atoms && (
              <div style={{ 
                padding: '0 20px 20px 20px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                maxHeight: '250px',
                overflowY: 'auto'
              }}>
                {placedAtoms.map((atom) => (
                  <div 
                    key={atom.id} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: atom.atomData.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                      }}>
                        {atom.symbol}
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: '500' }}>
                        {atom.atomData.name}
                      </span>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: atom.availableBonds > 0 
                        ? 'rgba(34, 197, 94, 0.2)' 
                        : 'rgba(239, 68, 68, 0.2)',
                      color: atom.availableBonds > 0 ? '#22c55e' : '#ef4444'
                    }}>
                      {atom.availableBonds} bonds
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Built Molecules */}
        {builtMolecules.length > 0 && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px',
                cursor: 'pointer'
              }}
              onClick={() => togglePanel('molecules')}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  ✅
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Completed</h3>
                  <p style={{ margin: '2px 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                    {builtMolecules.length} molecules built
                  </p>
                </div>
              </div>
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  transform: expandedPanels.molecules ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedPanels.molecules && (
              <div style={{ padding: '0 20px 20px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {builtMolecules.map((molecule, index) => (
                    <div key={index} style={{
                      padding: '8px 16px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      border: '1px solid rgba(34, 197, 94, 0.4)',
                      borderRadius: '12px',
                      color: '#22c55e',
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {molecule}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Right Control Panel */}
      <aside style={{
        position: 'fixed',
        right: '20px',
        top: '100px',
        width: '280px',
        pointerEvents: 'auto'
      }}>
        <div style={{ ...cardStyle, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎮
            </div>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Controls</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Bond Mode Toggle */}
            <button
              onClick={onToggleBondingMode}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '16px 20px',
                background: bondingMode
                  ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: bondingMode ? 'black' : 'white',
                border: bondingMode ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                transform: bondingMode ? 'scale(1.02)' : 'scale(1)',
                boxShadow: bondingMode ? '0 8px 32px rgba(251, 191, 36, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!bondingMode) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              }}
              onMouseLeave={(e) => {
                if (!bondingMode) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
                e.currentTarget.style.transform = bondingMode ? 'scale(1.02)' : 'scale(1)';
              }}
            >
              <span>🔗</span>
              {bondingMode ? 'Exit Bond Mode' : 'Bond Mode'}
            </button>

            {/* Other Controls */}
            <button
              onClick={onToggleElectrons}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '12px 20px',
                background: showElectrons
                  ? 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: showElectrons ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: showElectrons ? '0 4px 20px rgba(6, 182, 212, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!showElectrons) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!showElectrons) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{showElectrons ? '🔴' : '⚡'}</span>
              {showElectrons ? 'Hide Electrons' : 'Show Electrons'}
            </button>

            <button
              onClick={onToggleKeyboardControls}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '12px 20px',
                background: keyboardControlsEnabled
                  ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: keyboardControlsEnabled ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: keyboardControlsEnabled ? '0 4px 20px rgba(34, 197, 94, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!keyboardControlsEnabled) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                if (!keyboardControlsEnabled) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>⌨️</span>
              Keyboard {keyboardControlsEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowInstructions(!showInstructions)}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{showInstructions ? '📖' : '❓'}</span>
              {showInstructions ? 'Hide Help' : 'Show Help'}
            </button>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px 0' }} />

            <button
              onClick={onReset}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '12px 20px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>🔄</span>
              Reset Scene
            </button>

            {gameMode === 'challenge' && (
              <button
                onClick={onNextChallenge}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                <span>➡️</span>
                Next Challenge
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Modern Periodic Table */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'auto'
      }}>
        {showPeriodicTable ? (
          <div style={{
            ...cardStyle,
            padding: '24px',
            maxWidth: '1200px'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  🧪
                </div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Periodic Table</h3>
              </div>
              <button
                onClick={() => setShowPeriodicTable(false)}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(18, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: '3px',
              marginBottom: '20px'
            }}>
              {periodicGrid.map((row, rowIndex) =>
                row.map((symbol, colIndex) => {
                  if (!symbol || !ATOMS[symbol]) {
                    return <div key={`${rowIndex}-${colIndex}`} style={{ width: '36px', height: '36px' }} />;
                  }
                  
                  const atom = ATOMS[symbol];
                  const isSelected = selectedAtom === symbol;
                  
                  return (
                    <button
                      key={symbol}
                      onClick={() => onAtomSelect(symbol)}
                      style={{
                        width: '36px',
                        height: '36px',
                        border: isSelected ? '2px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        background: isSelected 
                          ? `linear-gradient(135deg, ${atom.color}ff, ${atom.color}cc)`
                          : `linear-gradient(135deg, ${atom.color}dd, ${atom.color}aa)`,
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '700',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                        padding: '2px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: isSelected 
                          ? '0 0 20px rgba(251, 191, 36, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}
                      title={`${atom.name} (${atom.symbol})\nAtomic #: ${atom.atomicNumber}\nValence: ${atom.valenceElectrons}e⁻`}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '12px', lineHeight: '1' }}>{symbol}</div>
                      <div style={{ fontSize: '8px', lineHeight: '1', opacity: 0.8 }}>
                        {atom.atomicNumber}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                <span>Non-metals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
                <span>Metals</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#eab308', borderRadius: '50%' }}></div>
                <span>Metalloids</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#a855f7', borderRadius: '50%' }}></div>
                <span>Noble gases</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPeriodicTable(true)}
            style={{
              ...buttonStyle,
              padding: '16px 24px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              color: 'white',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.3)',
              fontSize: '16px',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <span>🧪</span>
            Show Periodic Table
          </button>
        )}
      </div>

      {/* Modern Message Display */}
      {message && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
          zIndex: 100
        }}>
          <div style={{
            ...cardStyle,
            padding: '24px 32px',
            maxWidth: '600px',
            textAlign: 'center',
            border: '1px solid rgba(6, 182, 212, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(6, 182, 212, 0.1)'
          }}>
            <div style={{
              color: '#06b6d4',
              fontSize: '16px',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Modern Instructions Modal */}
      {showInstructions && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            ...cardStyle,
            padding: '32px',
            maxWidth: '900px',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📚
                </div>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>How to Play</h2>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                }}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '32px' }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  color: '#06b6d4', 
                  fontSize: '20px', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span>🎮</span> Camera Controls
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    ['Right Click + Drag:', 'Rotate camera'],
                    ['WASD Keys:', 'Move camera'],
                    ['Mouse Wheel:', 'Zoom in/out'],
                    ['Q/E Keys:', 'Up/down movement']
                  ].map(([action, description], index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{action}</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  color: '#06b6d4', 
                  fontSize: '20px', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span>⚛️</span> Atom Controls
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    ['Add Atoms:', 'Click periodic table'],
                    ['Move Atoms:', 'Left click + drag'],
                    ['Create Bonds:', 'Bond Mode + right click'],
                    ['Remove Bonds:', 'Right-click bond lines']
                  ].map(([action, description], index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{action}</span>
                      <span style={{ fontWeight: '600', color: 'white' }}>{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              padding: '24px',
              background: 'rgba(6, 182, 212, 0.1)',
              borderRadius: '16px',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <h4 style={{ 
                margin: '0 0 16px 0', 
                color: '#06b6d4', 
                fontWeight: '600',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>💡</span> Pro Tips
              </h4>
              <ul style={{
                margin: 0,
                padding: '0 0 0 20px',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.6'
              }}>
                <li style={{ marginBottom: '8px' }}>Start with simple molecules like H₂ or H₂O</li>
                <li style={{ marginBottom: '8px' }}>Check atom bonding capacity in the atoms panel</li>
                <li style={{ marginBottom: '8px' }}>Use Bond Mode for precise atom connections</li>
                <li style={{ marginBottom: '8px' }}>Noble gases (He, Ne, Ar) don't form bonds</li>
                <li>Press ESC to return to the main menu</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        * {
          box-sizing: border-box;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};