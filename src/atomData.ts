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
  // Simplified bonding rules
  if (atom1.symbol === 'H' && atom2.valenceElectrons >= 4) return true;
  if (atom2.symbol === 'H' && atom1.valenceElectrons >= 4) return true;
  if (atom1.valenceElectrons + atom2.valenceElectrons === 8) return true;
  
  // Ionic bonding (metal + nonmetal)
  const electronegativityDiff = Math.abs(atom1.electronegativity - atom2.electronegativity);
  if (electronegativityDiff > 1.7) return true;
  
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