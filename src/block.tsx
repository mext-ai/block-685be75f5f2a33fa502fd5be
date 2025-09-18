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

// Tutorial steps
const TUTORIAL_STEPS = [
  {
    title: "Welcome to the Tutorial! 📚",
    content: "Let's learn how to build molecules step by step. We'll create a Water molecule (H₂O) together.",
    action: "Click Next to continue"
  },
  {
    title: "Camera Controls 🎮",
    content: "First, let's learn how to navigate:\n• Use WASD keys to move the camera\n• Right-click and drag to rotate the view\n• Mouse wheel to zoom in/out",
    action: "Try moving the camera, then click Next"
  },
  {
    title: "Atoms Are Ready ⚛️",
    content: "I've placed some atoms in the scene for you:\n• 2 Hydrogen atoms (H) - shown in white\n• 1 Oxygen atom (O) - shown in red\n\nThese are the building blocks for water!",
    action: "Look around and find the atoms, then click Next"
  },
  {
    title: "Moving Atoms 👆",
    content: "You can move atoms by left-clicking and dragging them. Try moving the atoms closer together - they need to be near each other to bond.",
    action: "Drag some atoms around, then click Next"
  },
  {
    title: "Bond Mode 🔗",
    content: "To create bonds between atoms, you need to enable Bond Mode. Look for the 'Bond Mode' button in the controls panel on the right side of the screen.",
    action: "Click the Bond Mode button to enable it, then click Next"
  },
  {
    title: "Creating Bonds ⚡",
    content: "Now that Bond Mode is ON:\n1. RIGHT-CLICK on the Oxygen atom first\n2. Then RIGHT-CLICK on a Hydrogen atom\n3. This creates a covalent bond!\n\nThe atoms will connect with a line.\n\n💡 Tip: You can right-click on bond lines to remove them if needed.",
    action: "Create your first bond, then click Next"
  },
  {
    title: "Complete the Molecule 💧",
    content: "Great! Now create a second bond:\n1. RIGHT-CLICK the Oxygen atom again\n2. RIGHT-CLICK the other Hydrogen atom\n\nThis will complete the H₂O (water) molecule!",
    action: "Create the second bond to finish water"
  },
  {
    title: "Removing Bonds 🔧",
    content: "Good to know: If you make a mistake, you can remove bonds!\n• RIGHT-CLICK on any bond line to delete it\n• This allows you to fix errors and try again\n• Atoms will become available for new bonds",
    action: "Try right-clicking a bond, then click Next"
  },
  {
    title: "Congratulations! 🎉",
    content: "You've successfully built your first molecule! You should see a completion message when the water molecule is finished. You can now:\n• Try building other molecules\n• Use Practice mode for free exploration\n• Try Challenge mode for guided objectives",
    action: "Click Finish to end the tutorial"
  }
];

// Home Page Component
const HomePage: React.FC<{ onModeSelect: (mode: 'tutorial' | 'practice' | 'challenge') => void }> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  // Send initial completion event for home page load
  useEffect(() => {
    window.postMessage({ 
      type: 'BLOCK_COMPLETION', 
      blockId: 'molecular-bonding-lab', 
      completed: true,
      stage: 'home_loaded'
    }, '*');
    window.parent.postMessage({ 
      type: 'BLOCK_COMPLETION', 
      blockId: 'molecular-bonding-lab', 
      completed: true,
      stage: 'home_loaded'
    }, '*');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background with particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-pink-400/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-32 right-32 w-2 h-2 bg-yellow-400/50 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-green-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-cyan-500/25">
              <span className="text-4xl">🧪</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
            Molecular
            <br />
            Bonding Lab
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-4 max-w-2xl">
            Master chemistry through interactive 3D experimentation
          </p>
          
          <p className="text-slate-400 max-w-3xl leading-relaxed">
            Build molecules, create chemical bonds, and explore the fundamental principles 
            of chemistry in an immersive environment powered by advanced 3D visualization.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-wrap justify-center gap-8 mb-16 text-sm">
          {[
            { icon: '⚛️', text: 'Interactive Atoms' },
            { icon: '🔗', text: 'Real Bonding' },
            { icon: '🎮', text: 'Gamified Learning' },
            { icon: '🎯', text: 'Guided Tutorials' }
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-lg">{feature.icon}</span>
              <span className="text-slate-300 font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Mode selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Tutorial Mode */}
          <div
            className={`group relative p-8 rounded-3xl border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-500 ${
              hoveredMode === 'tutorial' 
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 scale-105 shadow-2xl shadow-yellow-500/25' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onMouseEnter={() => setHoveredMode('tutorial')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onModeSelect('tutorial')}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
              hoveredMode === 'tutorial' ? 'opacity-100' : 'opacity-0'
            } bg-gradient-to-br from-yellow-500/10 to-orange-500/10`}></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                  hoveredMode === 'tutorial' 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/25' 
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }`}>
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Tutorial</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  hoveredMode === 'tutorial' 
                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' 
                    : 'bg-white/10 text-slate-300 border border-white/20'
                }`}>
                  Beginner Friendly
                </span>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                Perfect introduction to molecular chemistry. Learn fundamental concepts through 
                guided step-by-step lessons with interactive examples and real-time feedback.
              </p>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Step-by-step guidance
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Interactive examples
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Progress tracking
                </div>
              </div>
              
              <div className={`mt-6 flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                hoveredMode === 'tutorial' 
                  ? 'bg-yellow-400/20 border border-yellow-400/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <span className="text-sm font-medium text-white">Start Learning</span>
                <span className="text-lg">→</span>
              </div>
            </div>
          </div>

          {/* Practice Mode */}
          <div
            className={`group relative p-8 rounded-3xl border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-500 ${
              hoveredMode === 'practice' 
                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 scale-105 shadow-2xl shadow-cyan-500/25' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onMouseEnter={() => setHoveredMode('practice')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onModeSelect('practice')}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
              hoveredMode === 'practice' ? 'opacity-100' : 'opacity-0'
            } bg-gradient-to-br from-cyan-500/10 to-blue-500/10`}></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                  hoveredMode === 'practice' 
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/25' 
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }`}>
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Practice</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  hoveredMode === 'practice' 
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' 
                    : 'bg-white/10 text-slate-300 border border-white/20'
                }`}>
                  Free Exploration
                </span>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                Unlimited experimentation workspace. Build any molecules you want, test different 
                combinations, and explore chemistry at your own pace without restrictions.
              </p>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> No time limits
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Full periodic table
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Creative freedom
                </div>
              </div>
              
              <div className={`mt-6 flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                hoveredMode === 'practice' 
                  ? 'bg-cyan-400/20 border border-cyan-400/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <span className="text-sm font-medium text-white">Start Exploring</span>
                <span className="text-lg">→</span>
              </div>
            </div>
          </div>

          {/* Challenge Mode */}
          <div
            className={`group relative p-8 rounded-3xl border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-500 ${
              hoveredMode === 'challenge' 
                ? 'bg-gradient-to-br from-pink-500/20 to-red-500/20 border-pink-500/30 scale-105 shadow-2xl shadow-pink-500/25' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onMouseEnter={() => setHoveredMode('challenge')}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => onModeSelect('challenge')}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
              hoveredMode === 'challenge' ? 'opacity-100' : 'opacity-0'
            } bg-gradient-to-br from-pink-500/10 to-red-500/10`}></div>
            
            <div className="relative z-10">
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                  hoveredMode === 'challenge' 
                    ? 'bg-gradient-to-br from-pink-400 to-red-500 shadow-lg shadow-pink-500/25' 
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }`}>
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Challenge</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  hoveredMode === 'challenge' 
                    ? 'bg-pink-400/20 text-pink-300 border border-pink-400/30' 
                    : 'bg-white/10 text-slate-300 border border-white/20'
                }`}>
                  Goal Oriented
                </span>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-6">
                Test your molecular building skills. Complete specific molecular construction tasks, 
                solve chemistry puzzles, and earn achievements in timed challenges.
              </p>
              
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Specific objectives
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Achievement system
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> Skill assessment
                </div>
              </div>
              
              <div className={`mt-6 flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                hoveredMode === 'challenge' 
                  ? 'bg-pink-400/20 border border-pink-400/30' 
                  : 'bg-white/5 border border-white/10'
              }`}>
                <span className="text-sm font-medium text-white">Start Challenge</span>
                <span className="text-lg">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick controls hint */}
        <div className="mt-16 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-2xl">
          <div className="text-center">
            <div className="text-2xl mb-2">🎮</div>
            <h4 className="text-lg font-semibold text-white mb-2">Quick Controls Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div><span className="text-cyan-400 font-mono">WASD</span> Camera movement</div>
              <div><span className="text-cyan-400 font-mono">Right-click</span> Bond atoms</div>
              <div><span className="text-cyan-400 font-mono">Left-click</span> Move atoms</div>
              <div><span className="text-cyan-400 font-mono">Mouse wheel</span> Zoom</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

// Tutorial Modal Component
const TutorialModal: React.FC<{
  step: number;
  onNext: () => void;
  onClose: () => void;
}> = ({ step, onNext, onClose }) => {
  const currentStep = TUTORIAL_STEPS[step];
  const isLastStep = step === TUTORIAL_STEPS.length - 1;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      pointerEvents: 'auto'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(25, 25, 60, 0.9) 100%)',
        padding: '30px',
        borderRadius: '20px',
        border: '3px solid #ffd700',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 40px rgba(255, 215, 0, 0.4)',
        maxWidth: '600px',
        width: '90%',
        color: 'white',
        textAlign: 'center',
        animation: 'tutorialSlideIn 0.5s ease-out'
      }}>
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
          gap: '8px'
        }}>
          {TUTORIAL_STEPS.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index <= step ? '#ffd700' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '2rem',
          color: '#ffd700',
          textShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
        }}>
          {currentStep.title}
        </h2>

        <div style={{
          fontSize: '1.1rem',
          lineHeight: '1.6',
          margin: '20px 0 30px 0',
          color: 'rgba(255, 255, 255, 0.9)',
          whiteSpace: 'pre-line'
        }}>
          {currentStep.content}
        </div>

        <div style={{
          fontSize: '1rem',
          margin: '20px 0',
          padding: '15px',
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '10px',
          color: '#ffd700'
        }}>
          💡 {currentStep.action}
        </div>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginTop: '25px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Skip Tutorial
          </button>

          <button
            onClick={onNext}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              color: 'black',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              minWidth: '120px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 215, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isLastStep ? 'Finish Tutorial' : 'Next Step'}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes tutorialSlideIn {
            0% { opacity: 0; transform: translateY(-50px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </div>
  );
};

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
  // Main app state - START WITH HOME PAGE
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  
  // Game state
  const [gameMode, setGameMode] = useState<'tutorial' | 'practice' | 'challenge'>('tutorial');
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');

  // Tutorial state
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

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

  // Handle mode selection from home page
  const handleModeSelect = (mode: 'tutorial' | 'practice' | 'challenge') => {
    setGameMode(mode);
    setCurrentChallenge(0);
    setCurrentScreen('game');
    
    // Reset game state
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
    
    // Start tutorial if tutorial mode is selected
    if (mode === 'tutorial') {
      setTutorialStep(0);
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
      // Set appropriate welcome message for other modes
      const messages = {
        practice: 'Practice mode: Build any molecules you want! Add atoms from the periodic table and experiment freely.',
        challenge: `Challenge mode: Build ${MOLECULES[0]?.formula} to start! Follow the instructions to complete each challenge.`
      };
      
      setMessage(messages[mode] || '');
    }
  };

  // Go back to home page
  const handleBackToHome = () => {
    setCurrentScreen('home');
    setShowTutorial(false);
    // Reset all game state
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
  };

  // Tutorial handlers
  const handleTutorialNext = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      // Tutorial finished
      setShowTutorial(false);
      setMessage('Tutorial complete! You can now explore freely or try other game modes.');
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setMessage('Tutorial skipped. You can now explore freely!');
  };

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

  // Helper function to show temporary messages (but not in tutorial mode)
  const showMessage = useCallback((msg: string, duration = 3000) => {
    if (gameMode !== 'tutorial' || !showTutorial) {
      setMessage(msg);
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => {
        setMessage('');
      }, duration);
    }
  }, [gameMode, showTutorial]);

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
      
      // ESC key to go back to home (only if in game)
      if (event.key === 'Escape' && currentScreen === 'game') {
        event.preventDefault();
        handleBackToHome();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedAtomId, deleteAtom, currentScreen]);

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
    // Only handle right-click in bonding mode, left-click for selection
    if (bondingMode && button !== 2) return; // In bonding mode, only right-click works
    if (!bondingMode && button !== 0) return; // In normal mode, only left-click works

    // Prevent event from firing if we're currently dragging
    if (dragging) return;

    if (!bondingMode) {
      setSelectedAtomId(atomId);
      return;
    }

    // In bonding mode - handle bond creation logic with right-click
    if (!firstAtomForBond) {
      // Select first atom for bonding
      const atom = placedAtoms.find(a => a.id === atomId);
      if (atom && atom.availableBonds > 0) {
        setFirstAtomForBond(atomId);
        showMessage(`Selected ${atom.symbol}. Now right-click another atom to create a bond.`);
      } else {
        showMessage(`${atom?.symbol} cannot form more bonds!`);
      }
    } else if (firstAtomForBond === atomId) {
      // Clicked same atom, cancel bonding
      setFirstAtomForBond(null);
      showMessage('Bond creation cancelled.');
    } else {
      // Try to create bond between first and second atom
      createBond(firstAtomForBond, atomId);
      setFirstAtomForBond(null); // Reset after creating bond
    }
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
    const newBondingMode = !bondingMode;
    setBondingMode(newBondingMode);
    setFirstAtomForBond(null);
    
    if (newBondingMode) {
      showMessage('Bond Mode ON: Right-click two atoms to create a bond between them.');
    } else {
      showMessage('Bond Mode OFF: You can now drag atoms to move them.');
    }
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

  // Toggle game mode (no longer used, but kept for compatibility)
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
    if (gameMode === 'tutorial' && placedAtoms.length === 0 && currentScreen === 'game' && tutorialStep >= 2) {
      // Add H2O atoms for tutorial (starting from step 2 - "Atoms Are Ready")
      setTimeout(() => {
        addAtom('H');
        setTimeout(() => {
          addAtom('H');
          setTimeout(() => addAtom('O'), 500);
        }, 500);
      }, 1000);
    }
  }, [gameMode, placedAtoms.length, currentScreen, tutorialStep]);

  // Render home page or game based on current screen
  if (currentScreen === 'home') {
    return <HomePage onModeSelect={handleModeSelect} />;
  }

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

      {/* Tutorial Modal */}
      {showTutorial && (
        <TutorialModal
          step={tutorialStep}
          onNext={handleTutorialNext}
          onClose={handleTutorialClose}
        />
      )}

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
        onBackToHome={handleBackToHome}
        builtMolecules={builtMolecules}
        message={message}
        placedAtoms={placedAtoms}
      />
    </div>
  );
};

export default Block;