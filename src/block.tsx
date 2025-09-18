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
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(0, 255, 0, 0.05) 0%, transparent 50%)
        `,
        animation: 'float 6s ease-in-out infinite'
      }} />

      {/* Floating molecules animation */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        fontSize: '3rem',
        opacity: 0.3,
        animation: 'floatMolecule 8s ease-in-out infinite'
      }}>
        H₂O
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '8%',
        fontSize: '2.5rem',
        opacity: 0.2,
        animation: 'floatMolecule 6s ease-in-out infinite reverse'
      }}>
        CO₂
      </div>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        fontSize: '2rem',
        opacity: 0.25,
        animation: 'floatMolecule 10s ease-in-out infinite'
      }}>
        NH₃
      </div>

      {/* Instructions Box - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '15px 20px',
        borderRadius: '12px',
        border: '2px solid rgba(0, 255, 255, 0.5)',
        backdropFilter: 'blur(10px)',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: 10,
        animation: 'fadeIn 2s ease-out'
      }}>
        <div style={{ 
          color: '#00ffff', 
          fontWeight: 'bold', 
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          🎮 Quick Controls
        </div>
        <div style={{ 
          lineHeight: '1.4',
          color: 'rgba(255, 255, 255, 0.9)'
        }}>
          • <strong>WASD</strong> for camera movement<br/>
          • <strong>Right-click</strong> to rotate<br/>
          • <strong>Left-click</strong> to interact<br/>
          • <strong>Create Bonds:</strong> Enable Bond Mode, right-click two atoms<br/>
          • Build molecules by connecting atoms<br/>
          • Learn chemistry through interactive play
        </div>
      </div>

      {/* Main Title */}
      <div style={{
        textAlign: 'center',
        marginBottom: '80px',
        zIndex: 2,
        animation: 'fadeInUp 1s ease-out'
      }}>
        <h1 style={{
          fontSize: '4.5rem',
          margin: 0,
          background: 'linear-gradient(135deg, #00ffff 0%, #0099cc 50%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(0,255,255,0.3)',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          🧪 Molecular Bonding Lab
        </h1>
        <p style={{
          fontSize: '1.6rem',
          margin: 0,
          opacity: 0.9,
          color: '#00ffff',
          textShadow: '0 0 10px rgba(0,255,255,0.3)',
          marginBottom: '10px'
        }}>
          Interactive 3D Chemistry Simulation
        </p>
        <p style={{
          fontSize: '1.1rem',
          margin: '10px 0 0 0',
          opacity: 0.7,
          maxWidth: '700px',
          lineHeight: '1.6'
        }}>
          Master molecular bonding through hands-on experimentation. Build molecules, create chemical bonds, 
          and discover the fundamental principles of chemistry in an immersive 3D environment.
        </p>
      </div>

      {/* Welcome Message */}
      <div style={{
        textAlign: 'center',
        marginBottom: '50px',
        zIndex: 2,
        animation: 'fadeIn 2s ease-out'
      }}>
        <h2 style={{
          fontSize: '2rem',
          margin: '0 0 15px 0',
          color: '#ffd700',
          textShadow: '0 0 20px rgba(255,215,0,0.4)'
        }}>
          Choose Your Learning Path
        </h2>
        <p style={{
          fontSize: '1rem',
          opacity: 0.8,
          maxWidth: '600px'
        }}>
          Select a game mode to begin your chemistry adventure. Each mode offers a unique learning experience 
          tailored to different skill levels and goals.
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div style={{
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        zIndex: 2,
        animation: 'slideInUp 1.5s ease-out'
      }}>
        {/* Tutorial Mode */}
        <div
          style={{
            width: '300px',
            height: '380px',
            background: hoveredMode === 'tutorial' 
              ? 'linear-gradient(135deg, rgba(255,215,0,0.25) 0%, rgba(255,140,0,0.15) 100%)'
              : 'rgba(0, 0, 0, 0.4)',
            border: hoveredMode === 'tutorial' 
              ? '3px solid #ffd700' 
              : '2px solid rgba(255,255,255,0.2)',
            borderRadius: '25px',
            padding: '35px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hoveredMode === 'tutorial' ? 'translateY(-15px) scale(1.08)' : 'translateY(0) scale(1)',
            backdropFilter: 'blur(20px)',
            boxShadow: hoveredMode === 'tutorial' 
              ? '0 25px 50px rgba(255,215,0,0.4), 0 0 0 1px rgba(255,215,0,0.2)' 
              : '0 15px 35px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={() => setHoveredMode('tutorial')}
          onMouseLeave={() => setHoveredMode(null)}
          onClick={() => onModeSelect('tutorial')}
        >
          {/* Background glow effect */}
          {hoveredMode === 'tutorial' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
          )}
          
          <div style={{
            fontSize: '4.5rem',
            marginBottom: '25px',
            filter: hoveredMode === 'tutorial' ? 'brightness(1.3) drop-shadow(0 0 20px rgba(255,215,0,0.5))' : 'brightness(1)',
            transition: 'all 0.3s ease'
          }}>
            📚
          </div>
          <h3 style={{
            fontSize: '2.2rem',
            margin: '0 0 20px 0',
            color: hoveredMode === 'tutorial' ? '#ffd700' : '#00ffff',
            fontWeight: 'bold',
            textShadow: hoveredMode === 'tutorial' ? '0 0 10px rgba(255,215,0,0.5)' : 'none'
          }}>
            Tutorial
          </h3>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            opacity: 0.9,
            margin: '0 0 25px 0',
            flex: 1
          }}>
            Perfect for beginners! Learn the fundamentals of molecular bonding with guided step-by-step lessons and interactive examples.
          </p>
          <div style={{
            marginTop: 'auto',
            padding: '12px 20px',
            background: hoveredMode === 'tutorial' 
              ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' 
              : 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: hoveredMode === 'tutorial' ? 'black' : 'white',
            border: hoveredMode === 'tutorial' ? 'none' : '1px solid rgba(255,255,255,0.2)'
          }}>
            🎯 Guided Learning
          </div>
        </div>

        {/* Practice Mode */}
        <div
          style={{
            width: '300px',
            height: '380px',
            background: hoveredMode === 'practice' 
              ? 'linear-gradient(135deg, rgba(78,205,196,0.25) 0%, rgba(68,160,141,0.15) 100%)'
              : 'rgba(0, 0, 0, 0.4)',
            border: hoveredMode === 'practice' 
              ? '3px solid #4ecdc4' 
              : '2px solid rgba(255,255,255,0.2)',
            borderRadius: '25px',
            padding: '35px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hoveredMode === 'practice' ? 'translateY(-15px) scale(1.08)' : 'translateY(0) scale(1)',
            backdropFilter: 'blur(20px)',
            boxShadow: hoveredMode === 'practice' 
              ? '0 25px 50px rgba(78,205,196,0.4), 0 0 0 1px rgba(78,205,196,0.2)' 
              : '0 15px 35px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={() => setHoveredMode('practice')}
          onMouseLeave={() => setHoveredMode(null)}
          onClick={() => onModeSelect('practice')}
        >
          {/* Background glow effect */}
          {hoveredMode === 'practice' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(78,205,196,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
          )}
          
          <div style={{
            fontSize: '4.5rem',
            marginBottom: '25px',
            filter: hoveredMode === 'practice' ? 'brightness(1.3) drop-shadow(0 0 20px rgba(78,205,196,0.5))' : 'brightness(1)',
            transition: 'all 0.3s ease'
          }}>
            🔬
          </div>
          <h3 style={{
            fontSize: '2.2rem',
            margin: '0 0 20px 0',
            color: hoveredMode === 'practice' ? '#4ecdc4' : '#00ffff',
            fontWeight: 'bold',
            textShadow: hoveredMode === 'practice' ? '0 0 10px rgba(78,205,196,0.5)' : 'none'
          }}>
            Practice
          </h3>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            opacity: 0.9,
            margin: '0 0 25px 0',
            flex: 1
          }}>
            Unlimited experimentation! Build any molecules you want, test different combinations, and explore chemistry at your own pace.
          </p>
          <div style={{
            marginTop: 'auto',
            padding: '12px 20px',
            background: hoveredMode === 'practice' 
              ? 'linear-gradient(135deg, #4ecdc4 0%, #7bdcb5 100%)' 
              : 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: hoveredMode === 'practice' ? 'white' : 'white',
            border: hoveredMode === 'practice' ? 'none' : '1px solid rgba(255,255,255,0.2)'
          }}>
            🆓 Free Exploration
          </div>
        </div>

        {/* Challenge Mode */}
        <div
          style={{
            width: '300px',
            height: '380px',
            background: hoveredMode === 'challenge' 
              ? 'linear-gradient(135deg, rgba(255,107,107,0.25) 0%, rgba(255,71,87,0.15) 100%)'
              : 'rgba(0, 0, 0, 0.4)',
            border: hoveredMode === 'challenge' 
              ? '3px solid #ff6b6b' 
              : '2px solid rgba(255,255,255,0.2)',
            borderRadius: '25px',
            padding: '35px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hoveredMode === 'challenge' ? 'translateY(-15px) scale(1.08)' : 'translateY(0) scale(1)',
            backdropFilter: 'blur(20px)',
            boxShadow: hoveredMode === 'challenge' 
              ? '0 25px 50px rgba(255,107,107,0.4), 0 0 0 1px rgba(255,107,107,0.2)' 
              : '0 15px 35px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={() => setHoveredMode('challenge')}
          onMouseLeave={() => setHoveredMode(null)}
          onClick={() => onModeSelect('challenge')}
        >
          {/* Background glow effect */}
          {hoveredMode === 'challenge' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(255,107,107,0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
          )}
          
          <div style={{
            fontSize: '4.5rem',
            marginBottom: '25px',
            filter: hoveredMode === 'challenge' ? 'brightness(1.3) drop-shadow(0 0 20px rgba(255,107,107,0.5))' : 'brightness(1)',
            transition: 'all 0.3s ease'
          }}>
            🏆
          </div>
          <h3 style={{
            fontSize: '2.2rem',
            margin: '0 0 20px 0',
            color: hoveredMode === 'challenge' ? '#ff6b6b' : '#00ffff',
            fontWeight: 'bold',
            textShadow: hoveredMode === 'challenge' ? '0 0 10px rgba(255,107,107,0.5)' : 'none'
          }}>
            Challenge
          </h3>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            opacity: 0.9,
            margin: '0 0 25px 0',
            flex: 1
          }}>
            Test your skills! Complete specific molecular building tasks, solve chemistry puzzles, and earn achievements.
          </p>
          <div style={{
            marginTop: 'auto',
            padding: '12px 20px',
            background: hoveredMode === 'challenge' 
              ? 'linear-gradient(135deg, #ff6b6b 0%, #ff8a80 100%)' 
              : 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: hoveredMode === 'challenge' ? 'white' : 'white',
            border: hoveredMode === 'challenge' ? 'none' : '1px solid rgba(255,255,255,0.2)'
          }}>
            🎮 Goal-Oriented
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-10px) rotate(120deg); }
            66% { transform: translateY(5px) rotate(240deg); }
          }
          
          @keyframes floatMolecule {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.2; }
            25% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
            50% { transform: translateY(-10px) translateX(-5px); opacity: 0.25; }
            75% { transform: translateY(-30px) translateX(15px); opacity: 0.35; }
          }
          
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes slideInUp {
            0% { opacity: 0; transform: translateY(50px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
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