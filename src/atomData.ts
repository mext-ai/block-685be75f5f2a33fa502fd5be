// Atom data and molecular bonding utilities
export interface AtomData {
  symbol: string;
  name: string;
  atomicNumber: number;
  valenceElectrons: number;
  electronegativity: number;
  color: string;
  radius: number;
}

export interface BondData {
  type: 'ionic' | 'covalent';
  strength: number;
  electrons: number;
}

export const ATOMS: Record<string, AtomData> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    valenceElectrons: 1,
    electronegativity: 2.1,
    color: '#ffffff',
    radius: 0.3
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    valenceElectrons: 4,
    electronegativity: 2.5,
    color: '#404040',
    radius: 0.4
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    valenceElectrons: 5,
    electronegativity: 3.0,
    color: '#0066cc',
    radius: 0.35
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    valenceElectrons: 6,
    electronegativity: 3.5,
    color: '#ff0000',
    radius: 0.35
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    valenceElectrons: 7,
    electronegativity: 4.0,
    color: '#90ee90',
    radius: 0.3
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    valenceElectrons: 1,
    electronegativity: 0.9,
    color: '#ab5cf2',
    radius: 0.5
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    valenceElectrons: 7,
    electronegativity: 3.0,
    color: '#00ff00',
    radius: 0.45
  }
};

export const MOLECULES = [
  { formula: 'H₂', atoms: ['H', 'H'], bondType: 'covalent', name: 'Hydrogen Gas' },
  { formula: 'O₂', atoms: ['O', 'O'], bondType: 'covalent', name: 'Oxygen Gas' },
  { formula: 'H₂O', atoms: ['H', 'O', 'H'], bondType: 'covalent', name: 'Water' },
  { formula: 'CO₂', atoms: ['C', 'O', 'O'], bondType: 'covalent', name: 'Carbon Dioxide' },
  { formula: 'NaCl', atoms: ['Na', 'Cl'], bondType: 'ionic', name: 'Sodium Chloride' },
  { formula: 'CH₄', atoms: ['C', 'H', 'H', 'H', 'H'], bondType: 'covalent', name: 'Methane' }
];

export function getBondType(atom1: AtomData, atom2: AtomData): 'ionic' | 'covalent' {
  const electronegativityDiff = Math.abs(atom1.electronegativity - atom2.electronegativity);
  return electronegativityDiff > 1.7 ? 'ionic' : 'covalent';
}

export function canBond(atom1: AtomData, atom2: AtomData): boolean {
  // Specific bonding rules for better accuracy
  const symbol1 = atom1.symbol;
  const symbol2 = atom2.symbol;
  
  // Hydrogen can bond with most atoms (except other hydrogen in some cases)
  if (symbol1 === 'H' || symbol2 === 'H') {
    // H-H bond (hydrogen gas)
    if (symbol1 === 'H' && symbol2 === 'H') return true;
    // H with C, N, O, F, Cl
    if ((symbol1 === 'H' && ['C', 'N', 'O', 'F', 'Cl'].includes(symbol2)) ||
        (symbol2 === 'H' && ['C', 'N', 'O', 'F', 'Cl'].includes(symbol1))) {
      return true;
    }
  }
  
  // Carbon bonds
  if (symbol1 === 'C' || symbol2 === 'C') {
    if ((symbol1 === 'C' && ['O', 'N', 'F', 'Cl'].includes(symbol2)) ||
        (symbol2 === 'C' && ['O', 'N', 'F', 'Cl'].includes(symbol1))) {
      return true;
    }
  }
  
  // Oxygen bonds
  if (symbol1 === 'O' || symbol2 === 'O') {
    // O-O bond (oxygen gas)
    if (symbol1 === 'O' && symbol2 === 'O') return true;
    // O with N, F
    if ((symbol1 === 'O' && ['N', 'F'].includes(symbol2)) ||
        (symbol2 === 'O' && ['N', 'F'].includes(symbol1))) {
      return true;
    }
  }
  
  // Nitrogen bonds
  if (symbol1 === 'N' || symbol2 === 'N') {
    // N-N, N-F
    if ((symbol1 === 'N' && ['N', 'F'].includes(symbol2)) ||
        (symbol2 === 'N' && ['N', 'F'].includes(symbol1))) {
      return true;
    }
  }
  
  // Ionic bonds - metal + nonmetal
  const metals = ['Na'];
  const nonmetals = ['Cl', 'F', 'O'];
  
  if ((metals.includes(symbol1) && nonmetals.includes(symbol2)) ||
      (metals.includes(symbol2) && nonmetals.includes(symbol1))) {
    return true;
  }
  
  // Halogen-Halogen bonds
  const halogens = ['F', 'Cl'];
  if (halogens.includes(symbol1) && halogens.includes(symbol2)) {
    return true;
  }
  
  return false;
}

export function getElectronsNeeded(atomSymbol: string): number {
  const atom = ATOMS[atomSymbol];
  if (!atom) return 0;
  
  if (atom.valenceElectrons <= 4) {
    return atom.valenceElectrons; // Tends to lose electrons
  } else {
    return 8 - atom.valenceElectrons; // Tends to gain electrons
  }
}

// Get maximum bonds an atom can form
export function getMaxBonds(atomSymbol: string): number {
  const atom = ATOMS[atomSymbol];
  if (!atom) return 0;
  
  switch (atomSymbol) {
    case 'H': return 1;
    case 'C': return 4;
    case 'N': return 3;
    case 'O': return 2;
    case 'F': return 1;
    case 'Na': return 1;
    case 'Cl': return 1;
    default: return 1;
  }
}

// Check if two specific atoms can bond based on common molecules
export function canFormSpecificBond(atom1Symbol: string, atom2Symbol: string): boolean {
  const bondPairs = [
    ['H', 'H'], // H₂
    ['O', 'O'], // O₂
    ['H', 'O'], // H₂O
    ['C', 'O'], // CO₂
    ['Na', 'Cl'], // NaCl
    ['C', 'H'], // CH₄
    ['N', 'H'], // NH₃
    ['C', 'C'], // Various organic compounds
    ['C', 'N'], // Various organic compounds
    ['N', 'O'], // Various compounds
  ];
  
  return bondPairs.some(([a, b]) => 
    (a === atom1Symbol && b === atom2Symbol) || 
    (a === atom2Symbol && b === atom1Symbol)
  );
}