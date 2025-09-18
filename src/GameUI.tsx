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
        return { name: 'Tutorial', color: '#6366f1', emoji: '📚', bgGradient: 'from-indigo-500 to-purple-600' };
      case 'practice':
        return { name: 'Practice', color: '#06b6d4', emoji: '🔬', bgGradient: 'from-cyan-500 to-blue-500' };
      case 'challenge':
        return { name: 'Challenge', color: '#f59e0b', emoji: '🏆', bgGradient: 'from-amber-500 to-orange-500' };
      default:
        return { name: 'Game', color: '#10b981', emoji: '🎮', bgGradient: 'from-emerald-500 to-teal-500' };
    }
  };

  const modeInfo = getModeInfo();

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  return (
    <div className="fixed inset-0 pointer-events-none font-inter text-white">
      {/* Modern Glass Morphism Header */}
      <header className="fixed top-0 left-0 right-0 h-16 pointer-events-auto z-50">
        <div className="h-full bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              title="Press ESC to go back"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </button>

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-lg">
                🧪
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Molecular Bonding Lab
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${modeInfo.bgGradient} text-white`}>
                    {modeInfo.emoji} {modeInfo.name}
                  </span>
                  <span className="text-xs text-white/60">Interactive 3D Chemistry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Status Indicators */}
          <div className="flex items-center gap-3">
            {/* Bond Mode Indicator */}
            {bondingMode && (
              <div className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-black text-sm font-bold animate-pulse">
                🔗 BOND MODE {firstAtomForBond && '→ Select 2nd atom'}
              </div>
            )}

            {/* Keyboard Status */}
            {keyboardControlsEnabled && (
              <div className="px-2 py-1 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-xs font-medium">
                ⌨️ WASD
              </div>
            )}

            {/* Score Display */}
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-lg font-bold text-cyan-400">{score}</div>
              <div className="text-xs text-white/60">{builtMolecules.length} molecules</div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Sidebar - Left */}
      <aside className="fixed left-4 top-20 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto pointer-events-auto">
        <div className="space-y-4">
          {/* Challenge Card */}
          {gameMode === 'challenge' && currentTarget && (
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl">
                  🎯
                </div>
                <div>
                  <h3 className="font-bold text-lg">Challenge {currentChallenge + 1}</h3>
                  <p className="text-white/60 text-sm">Build the target molecule</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-amber-400">{currentTarget.formula}</span>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm font-medium">
                    {currentTarget.bondType}
                  </span>
                </div>
                <p className="text-white/80">{currentTarget.name}</p>
                <div className="flex flex-wrap gap-1">
                  {currentTarget.atoms.map((atom, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                      {atom}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Atoms in Scene */}
          {placedAtoms.length > 0 && (
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => togglePanel('atoms')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    ⚛️
                  </div>
                  <div>
                    <h3 className="font-semibold">Atoms in Scene</h3>
                    <p className="text-white/60 text-sm">{placedAtoms.length} atoms placed</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedPanels.atoms ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {expandedPanels.atoms && (
                <div className="px-4 pb-4 space-y-2 max-h-48 overflow-y-auto">
                  {placedAtoms.map((atom) => (
                    <div 
                      key={atom.id} 
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
                          style={{ background: atom.atomData.color }}
                        >
                          {atom.symbol}
                        </div>
                        <span className="font-medium">{atom.atomData.name}</span>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        atom.availableBonds > 0 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
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
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => togglePanel('molecules')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    ✅
                  </div>
                  <div>
                    <h3 className="font-semibold">Completed Molecules</h3>
                    <p className="text-white/60 text-sm">{builtMolecules.length} built</p>
                  </div>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${expandedPanels.molecules ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {expandedPanels.molecules && (
                <div className="px-4 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {builtMolecules.map((molecule, index) => (
                      <div key={index} className="px-3 py-2 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 font-bold text-sm">
                        {molecule}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Modern Control Panel - Right */}
      <aside className="fixed right-4 top-20 w-64 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
              🎮
            </div>
            <h3 className="font-semibold text-lg">Controls</h3>
          </div>

          <div className="space-y-3">
            {/* Bond Mode Toggle */}
            <button
              onClick={onToggleBondingMode}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                bondingMode
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <span>🔗</span>
              {bondingMode ? 'Exit Bond Mode' : 'Bond Mode'}
            </button>

            {/* Other Controls */}
            <button
              onClick={onToggleElectrons}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                showElectrons
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <span>{showElectrons ? '🔴' : '⚡'}</span>
              {showElectrons ? 'Hide Electrons' : 'Show Electrons'}
            </button>

            <button
              onClick={onToggleKeyboardControls}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                keyboardControlsEnabled
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <span>⌨️</span>
              Keyboard {keyboardControlsEnabled ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
            >
              <span>{showInstructions ? '📖' : '❓'}</span>
              {showInstructions ? 'Hide Help' : 'Show Help'}
            </button>

            <div className="h-px bg-white/20 my-4" />

            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 transition-all duration-300"
            >
              <span>🔄</span>
              Reset Scene
            </button>

            {gameMode === 'challenge' && (
              <button
                onClick={onNextChallenge}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>➡️</span>
                Next Challenge
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Modern Periodic Table - Bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        {showPeriodicTable ? (
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl max-w-6xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  🧪
                </div>
                <h3 className="font-semibold text-lg">Periodic Table</h3>
              </div>
              <button
                onClick={() => setShowPeriodicTable(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-18 gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
              {periodicGrid.map((row, rowIndex) =>
                row.map((symbol, colIndex) => {
                  if (!symbol || !ATOMS[symbol]) {
                    return <div key={`${rowIndex}-${colIndex}`} className="w-8 h-8" />;
                  }
                  
                  const atom = ATOMS[symbol];
                  const isSelected = selectedAtom === symbol;
                  
                  return (
                    <button
                      key={symbol}
                      onClick={() => onAtomSelect(symbol)}
                      className={`w-8 h-8 rounded-lg text-white text-xs font-bold transition-all duration-200 flex flex-col items-center justify-center shadow-lg hover:scale-110 ${
                        isSelected 
                          ? 'ring-2 ring-yellow-400 scale-110 shadow-yellow-400/50' 
                          : 'hover:shadow-xl'
                      }`}
                      style={{ 
                        background: isSelected 
                          ? `linear-gradient(135deg, ${atom.color}ff, ${atom.color}cc)`
                          : `linear-gradient(135deg, ${atom.color}dd, ${atom.color}aa)`
                      }}
                      title={`${atom.name} (${atom.symbol})\nAtomic #: ${atom.atomicNumber}\nValence: ${atom.valenceElectrons}e⁻`}
                    >
                      <div className="leading-none">{symbol}</div>
                      <div className="text-[8px] opacity-80 leading-none">{atom.atomicNumber}</div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex justify-center gap-4 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Non-metals</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Metals</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Metalloids</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Noble gases</span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowPeriodicTable(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span>🧪</span>
            Show Periodic Table
          </button>
        )}
      </div>

      {/* Modern Message Display */}
      {message && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-50">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/50 p-6 shadow-2xl max-w-lg">
            <div className="text-cyan-400 text-center leading-relaxed">
              {message}
            </div>
          </div>
        </div>
      )}

      {/* Modern Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50 p-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-8 max-w-4xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-xl">
                  📚
                </div>
                <h2 className="text-2xl font-bold">How to Play</h2>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <span>🎮</span> Camera Controls
                </h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Right Click + Drag:</span>
                    <span className="font-medium">Rotate camera</span>
                  </div>
                  <div className="flex justify-between">
                    <span>WASD Keys:</span>
                    <span className="font-medium">Move camera</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mouse Wheel:</span>
                    <span className="font-medium">Zoom in/out</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Q/E Keys:</span>
                    <span className="font-medium">Up/down movement</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
                  <span>⚛️</span> Atom Controls
                </h3>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Add Atoms:</span>
                    <span className="font-medium">Click periodic table</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Move Atoms:</span>
                    <span className="font-medium">Left click + drag</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Create Bonds:</span>
                    <span className="font-medium">Bond Mode + right click</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remove Bonds:</span>
                    <span className="font-medium">Right-click bond lines</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <span>💡</span> Pro Tips
              </h4>
              <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                <li>Start with simple molecules like H₂ or H₂O</li>
                <li>Check atom bonding capacity in the atoms panel</li>
                <li>Use Bond Mode for precise atom connections</li>
                <li>Noble gases (He, Ne, Ar) don't form bonds</li>
                <li>Press ESC to return to the main menu</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Tailwind-style animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .grid-cols-18 {
          grid-template-columns: repeat(18, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};