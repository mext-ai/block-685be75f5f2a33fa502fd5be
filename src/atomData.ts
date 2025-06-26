// Atom data and molecular bonding utilities
export interface AtomData {
  symbol: string;
  name: string;
  atomicNumber: number;
  valenceElectrons: number;
  electronegativity: number;
  color: string;
  radius: number;
  group: number;
  period: number;
}

export interface BondData {
  type: 'ionic' | 'covalent';
  strength: number;
  electrons: number;
}

export const ATOMS: Record<string, AtomData> = {
  // Period 1
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    valenceElectrons: 1,
    electronegativity: 2.1,
    color: '#ffffff',
    radius: 0.3,
    group: 1,
    period: 1
  },
  He: {
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    valenceElectrons: 2,
    electronegativity: 0,
    color: '#d9ffff',
    radius: 0.28,
    group: 18,
    period: 1
  },
  
  // Period 2
  Li: {
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    valenceElectrons: 1,
    electronegativity: 1.0,
    color: '#cc80ff',
    radius: 0.68,
    group: 1,
    period: 2
  },
  Be: {
    symbol: 'Be',
    name: 'Beryllium',
    atomicNumber: 4,
    valenceElectrons: 2,
    electronegativity: 1.5,
    color: '#c2ff00',
    radius: 0.35,
    group: 2,
    period: 2
  },
  B: {
    symbol: 'B',
    name: 'Boron',
    atomicNumber: 5,
    valenceElectrons: 3,
    electronegativity: 2.0,
    color: '#ffb5b5',
    radius: 0.83,
    group: 13,
    period: 2
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    valenceElectrons: 4,
    electronegativity: 2.5,
    color: '#909090',
    radius: 0.68,
    group: 14,
    period: 2
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    valenceElectrons: 5,
    electronegativity: 3.0,
    color: '#3050f8',
    radius: 0.68,
    group: 15,
    period: 2
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    valenceElectrons: 6,
    electronegativity: 3.5,
    color: '#ff0d0d',
    radius: 0.68,
    group: 16,
    period: 2
  },
  F: {
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    valenceElectrons: 7,
    electronegativity: 4.0,
    color: '#90e050',
    radius: 0.64,
    group: 17,
    period: 2
  },
  Ne: {
    symbol: 'Ne',
    name: 'Neon',
    atomicNumber: 10,
    valenceElectrons: 8,
    electronegativity: 0,
    color: '#b3e3f5',
    radius: 0.58,
    group: 18,
    period: 2
  },
  
  // Period 3
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    valenceElectrons: 1,
    electronegativity: 0.9,
    color: '#ab5cf2',
    radius: 1.66,
    group: 1,
    period: 3
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    valenceElectrons: 2,
    electronegativity: 1.2,
    color: '#8aff00',
    radius: 1.41,
    group: 2,
    period: 3
  },
  Al: {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    valenceElectrons: 3,
    electronegativity: 1.5,
    color: '#bfa6a6',
    radius: 1.21,
    group: 13,
    period: 3
  },
  Si: {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    valenceElectrons: 4,
    electronegativity: 1.8,
    color: '#f0c8a0',
    radius: 1.11,
    group: 14,
    period: 3
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    valenceElectrons: 5,
    electronegativity: 2.1,
    color: '#ff8000',
    radius: 0.98,
    group: 15,
    period: 3
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    valenceElectrons: 6,
    electronegativity: 2.5,
    color: '#ffff30',
    radius: 0.88,
    group: 16,
    period: 3
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    valenceElectrons: 7,
    electronegativity: 3.0,
    color: '#1ff01f',
    radius: 0.79,
    group: 17,
    period: 3
  },
  Ar: {
    symbol: 'Ar',
    name: 'Argon',
    atomicNumber: 18,
    valenceElectrons: 8,
    electronegativity: 0,
    color: '#80d1e3',
    radius: 0.71,
    group: 18,
    period: 3
  },
  
  // Period 4 (First row transition metals)
  K: {
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    valenceElectrons: 1,
    electronegativity: 0.8,
    color: '#8f40d4',
    radius: 2.03,
    group: 1,
    period: 4
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    valenceElectrons: 2,
    electronegativity: 1.0,
    color: '#3dff00',
    radius: 1.76,
    group: 2,
    period: 4
  },
  Sc: {
    symbol: 'Sc',
    name: 'Scandium',
    atomicNumber: 21,
    valenceElectrons: 3,
    electronegativity: 1.3,
    color: '#e6e6e6',
    radius: 1.70,
    group: 3,
    period: 4
  },
  Ti: {
    symbol: 'Ti',
    name: 'Titanium',
    atomicNumber: 22,
    valenceElectrons: 4,
    electronegativity: 1.5,
    color: '#bfc2c7',
    radius: 1.60,
    group: 4,
    period: 4
  },
  V: {
    symbol: 'V',
    name: 'Vanadium',
    atomicNumber: 23,
    valenceElectrons: 5,
    electronegativity: 1.6,
    color: '#a6a6ab',
    radius: 1.53,
    group: 5,
    period: 4
  },
  Cr: {
    symbol: 'Cr',
    name: 'Chromium',
    atomicNumber: 24,
    valenceElectrons: 6,
    electronegativity: 1.6,
    color: '#8a99c7',
    radius: 1.39,
    group: 6,
    period: 4
  },
  Mn: {
    symbol: 'Mn',
    name: 'Manganese',
    atomicNumber: 25,
    valenceElectrons: 7,
    electronegativity: 1.5,
    color: '#9c7ac7',
    radius: 1.39,
    group: 7,
    period: 4
  },
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    valenceElectrons: 8,
    electronegativity: 1.8,
    color: '#e06633',
    radius: 1.32,
    group: 8,
    period: 4
  },
  Co: {
    symbol: 'Co',
    name: 'Cobalt',
    atomicNumber: 27,
    valenceElectrons: 9,
    electronegativity: 1.8,
    color: '#f090a0',
    radius: 1.26,
    group: 9,
    period: 4
  },
  Ni: {
    symbol: 'Ni',
    name: 'Nickel',
    atomicNumber: 28,
    valenceElectrons: 10,
    electronegativity: 1.8,
    color: '#50d050',
    radius: 1.24,
    group: 10,
    period: 4
  },
  Cu: {
    symbol: 'Cu',
    name: 'Copper',
    atomicNumber: 29,
    valenceElectrons: 1,
    electronegativity: 1.9,
    color: '#c88033',
    radius: 1.32,
    group: 11,
    period: 4
  },
  Zn: {
    symbol: 'Zn',
    name: 'Zinc',
    atomicNumber: 30,
    valenceElectrons: 2,
    electronegativity: 1.6,
    color: '#7d80b0',
    radius: 1.22,
    group: 12,
    period: 4
  },
  Ga: {
    symbol: 'Ga',
    name: 'Gallium',
    atomicNumber: 31,
    valenceElectrons: 3,
    electronegativity: 1.6,
    color: '#c28f8f',
    radius: 1.22,
    group: 13,
    period: 4
  },
  Ge: {
    symbol: 'Ge',
    name: 'Germanium',
    atomicNumber: 32,
    valenceElectrons: 4,
    electronegativity: 1.8,
    color: '#668f8f',
    radius: 1.20,
    group: 14,
    period: 4
  },
  As: {
    symbol: 'As',
    name: 'Arsenic',
    atomicNumber: 33,
    valenceElectrons: 5,
    electronegativity: 2.0,
    color: '#bd80e3',
    radius: 1.19,
    group: 15,
    period: 4
  },
  Se: {
    symbol: 'Se',
    name: 'Selenium',
    atomicNumber: 34,
    valenceElectrons: 6,
    electronegativity: 2.4,
    color: '#ffa100',
    radius: 1.20,
    group: 16,
    period: 4
  },
  Br: {
    symbol: 'Br',
    name: 'Bromine',
    atomicNumber: 35,
    valenceElectrons: 7,
    electronegativity: 2.8,
    color: '#a62929',
    radius: 1.20,
    group: 17,
    period: 4
  },
  Kr: {
    symbol: 'Kr',
    name: 'Krypton',
    atomicNumber: 36,
    valenceElectrons: 8,
    electronegativity: 0,
    color: '#5cb8d1',
    radius: 1.16,
    group: 18,
    period: 4
  },
  
  // Period 5 (Common elements)
  Rb: {
    symbol: 'Rb',
    name: 'Rubidium',
    atomicNumber: 37,
    valenceElectrons: 1,
    electronegativity: 0.8,
    color: '#702eb0',
    radius: 2.20,
    group: 1,
    period: 5
  },
  Sr: {
    symbol: 'Sr',
    name: 'Strontium',
    atomicNumber: 38,
    valenceElectrons: 2,
    electronegativity: 1.0,
    color: '#00ff00',
    radius: 1.95,
    group: 2,
    period: 5
  },
  Ag: {
    symbol: 'Ag',
    name: 'Silver',
    atomicNumber: 47,
    valenceElectrons: 1,
    electronegativity: 1.9,
    color: '#c0c0c0',
    radius: 1.72,
    group: 11,
    period: 5
  },
  I: {
    symbol: 'I',
    name: 'Iodine',
    atomicNumber: 53,
    valenceElectrons: 7,
    electronegativity: 2.5,
    color: '#940094',
    radius: 1.39,
    group: 17,
    period: 5
  },
  
  // Period 6 (Common elements)
  Cs: {
    symbol: 'Cs',
    name: 'Cesium',
    atomicNumber: 55,
    valenceElectrons: 1,
    electronegativity: 0.7,
    color: '#57178f',
    radius: 2.44,
    group: 1,
    period: 6
  },
  Ba: {
    symbol: 'Ba',
    name: 'Barium',
    atomicNumber: 56,
    valenceElectrons: 2,
    electronegativity: 0.9,
    color: '#00c900',
    radius: 2.15,
    group: 2,
    period: 6
  },
  Au: {
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    valenceElectrons: 1,
    electronegativity: 2.4,
    color: '#ffd123',
    radius: 1.66,
    group: 11,
    period: 6
  },
  Hg: {
    symbol: 'Hg',
    name: 'Mercury',
    atomicNumber: 80,
    valenceElectrons: 2,
    electronegativity: 1.9,
    color: '#b8b8d0',
    radius: 1.55,
    group: 12,
    period: 6
  },
  Pb: {
    symbol: 'Pb',
    name: 'Lead',
    atomicNumber: 82,
    valenceElectrons: 4,
    electronegativity: 1.8,
    color: '#575961',
    radius: 1.54,
    group: 14,
    period: 6
  }
};

export const MOLECULES = [
  { formula: 'H₂', atoms: ['H', 'H'], bondType: 'covalent', name: 'Hydrogen Gas' },
  { formula: 'O₂', atoms: ['O', 'O'], bondType: 'covalent', name: 'Oxygen Gas' },
  { formula: 'H₂O', atoms: ['H', 'O', 'H'], bondType: 'covalent', name: 'Water' },
  { formula: 'CO₂', atoms: ['C', 'O', 'O'], bondType: 'covalent', name: 'Carbon Dioxide' },
  { formula: 'NaCl', atoms: ['Na', 'Cl'], bondType: 'ionic', name: 'Sodium Chloride' },
  { formula: 'CH₄', atoms: ['C', 'H', 'H', 'H', 'H'], bondType: 'covalent', name: 'Methane' },
  { formula: 'NH₃', atoms: ['N', 'H', 'H', 'H'], bondType: 'covalent', name: 'Ammonia' },
  { formula: 'HCl', atoms: ['H', 'Cl'], bondType: 'covalent', name: 'Hydrogen Chloride' },
  { formula: 'H₂S', atoms: ['H', 'S', 'H'], bondType: 'covalent', name: 'Hydrogen Sulfide' },
  { formula: 'SO₂', atoms: ['S', 'O', 'O'], bondType: 'covalent', name: 'Sulfur Dioxide' }
];

export function getBondType(atom1: AtomData, atom2: AtomData): 'ionic' | 'covalent' {
  const electronegativityDiff = Math.abs(atom1.electronegativity - atom2.electronegativity);
  return electronegativityDiff > 1.7 ? 'ionic' : 'covalent';
}

export function canBond(atom1: AtomData, atom2: AtomData): boolean {
  const symbol1 = atom1.symbol;
  const symbol2 = atom2.symbol;
  
  // Noble gases (except under extreme conditions)
  const nobleGases = ['He', 'Ne', 'Ar', 'Kr'];
  if (nobleGases.includes(symbol1) || nobleGases.includes(symbol2)) {
    return false;
  }
  
  // Hydrogen bonds
  if (symbol1 === 'H' || symbol2 === 'H') {
    const nonHydrogen = symbol1 === 'H' ? symbol2 : symbol1;
    const commonHydrogenBonds = ['C', 'N', 'O', 'F', 'S', 'Cl', 'Br', 'I'];
    return nonHydrogen === 'H' || commonHydrogenBonds.includes(nonHydrogen);
  }
  
  // Carbon bonds (very versatile)
  if (symbol1 === 'C' || symbol2 === 'C') {
    const nonCarbon = symbol1 === 'C' ? symbol2 : symbol1;
    const carbonBonds = ['C', 'N', 'O', 'F', 'S', 'Cl', 'Br', 'I', 'Si', 'P'];
    return carbonBonds.includes(nonCarbon);
  }
  
  // Common diatomic molecules
  const diatomic = [
    ['H', 'H'], ['O', 'O'], ['N', 'N'], ['F', 'F'], ['Cl', 'Cl'], ['Br', 'Br'], ['I', 'I']
  ];
  
  if (diatomic.some(([a, b]) => 
    (a === symbol1 && b === symbol2) || (a === symbol2 && b === symbol1))) {
    return true;
  }
  
  // Ionic bonds - metals with nonmetals
  const metals = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Mg', 'Ca', 'Sr', 'Ba', 'Al', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Pb', 'Hg'];
  const nonmetals = ['F', 'Cl', 'Br', 'I', 'O', 'S', 'N', 'P'];
  
  if ((metals.includes(symbol1) && nonmetals.includes(symbol2)) ||
      (metals.includes(symbol2) && nonmetals.includes(symbol1))) {
    return true;
  }
  
  // Common covalent bonds between nonmetals
  const covalentPairs = [
    ['N', 'O'], ['N', 'F'], ['N', 'Cl'],
    ['O', 'F'], ['O', 'Cl'], ['O', 'S'],
    ['S', 'F'], ['S', 'Cl'], ['S', 'Br'],
    ['P', 'O'], ['P', 'F'], ['P', 'Cl'],
    ['Si', 'O'], ['Si', 'F'], ['Si', 'Cl']
  ];
  
  if (covalentPairs.some(([a, b]) => 
    (a === symbol1 && b === symbol2) || (a === symbol2 && b === symbol1))) {
    return true;
  }
  
  // General rule: similar electronegativity can bond
  const electronegativityDiff = Math.abs(atom1.electronegativity - atom2.electronegativity);
  return electronegativityDiff <= 3.0 && atom1.electronegativity > 0 && atom2.electronegativity > 0;
}

export function getElectronsNeeded(atomSymbol: string): number {
  const atom = ATOMS[atomSymbol];
  if (!atom) return 0;
  
  if (atom.valenceElectrons <= 4) {
    return atom.valenceElectrons;
  } else {
    return 8 - atom.valenceElectrons;
  }
}

export function getMaxBonds(atomSymbol: string): number {
  const atom = ATOMS[atomSymbol];
  if (!atom) return 0;
  
  const maxBondsMap: Record<string, number> = {
    'H': 1, 'He': 0,
    'Li': 1, 'Be': 2, 'B': 3, 'C': 4, 'N': 3, 'O': 2, 'F': 1, 'Ne': 0,
    'Na': 1, 'Mg': 2, 'Al': 3, 'Si': 4, 'P': 5, 'S': 6, 'Cl': 1, 'Ar': 0,
    'K': 1, 'Ca': 2, 'Fe': 6, 'Cu': 2, 'Zn': 2, 'Br': 1, 'Kr': 0,
    'Rb': 1, 'Sr': 2, 'Ag': 1, 'I': 1,
    'Cs': 1, 'Ba': 2, 'Au': 3, 'Hg': 2, 'Pb': 4
  };
  
  return maxBondsMap[atomSymbol] || 1;
}

export function canFormSpecificBond(atom1Symbol: string, atom2Symbol: string): boolean {
  const bondPairs = [
    ['H', 'H'], ['O', 'O'], ['N', 'N'], ['F', 'F'], ['Cl', 'Cl'], ['Br', 'Br'], ['I', 'I'],
    ['H', 'O'], ['H', 'N'], ['H', 'F'], ['H', 'Cl'], ['H', 'Br'], ['H', 'I'], ['H', 'S'],
    ['C', 'O'], ['C', 'N'], ['C', 'F'], ['C', 'Cl'], ['C', 'H'], ['C', 'C'],
    ['N', 'O'], ['N', 'F'], ['N', 'Cl'], ['O', 'F'], ['O', 'S'], ['S', 'O'],
    ['Na', 'Cl'], ['Na', 'F'], ['K', 'Cl'], ['K', 'F'], ['Mg', 'O'], ['Ca', 'O'],
    ['Al', 'O'], ['Al', 'F'], ['Al', 'Cl'], ['Si', 'O'], ['P', 'O'], ['S', 'O']
  ];
  
  return bondPairs.some(([a, b]) => 
    (a === atom1Symbol && b === atom2Symbol) || 
    (a === atom2Symbol && b === atom1Symbol)
  );
}