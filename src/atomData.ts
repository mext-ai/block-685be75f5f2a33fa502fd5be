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
  electronConfiguration: number[]; // Electrons per shell [K, L, M, N, O, P, Q]
}

export interface BondData {
  type: 'ionic' | 'covalent';
  strength: number;
  electrons: number;
}

// Helper function to get electron configuration
export function getElectronConfiguration(atomicNumber: number): number[] {
  const maxElectronsPerShell = [2, 8, 18, 32, 32, 18, 2]; // K, L, M, N, O, P, Q shells
  const config: number[] = [];
  let remaining = atomicNumber;
  
  for (let i = 0; i < maxElectronsPerShell.length && remaining > 0; i++) {
    const electronsInShell = Math.min(remaining, maxElectronsPerShell[i]);
    config.push(electronsInShell);
    remaining -= electronsInShell;
  }
  
  return config;
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
    period: 1,
    electronConfiguration: [1]
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
    period: 1,
    electronConfiguration: [2]
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
    period: 2,
    electronConfiguration: [2, 1]
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
    period: 2,
    electronConfiguration: [2, 2]
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
    period: 2,
    electronConfiguration: [2, 3]
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
    period: 2,
    electronConfiguration: [2, 4]
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
    period: 2,
    electronConfiguration: [2, 5]
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
    period: 2,
    electronConfiguration: [2, 6]
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
    period: 2,
    electronConfiguration: [2, 7]
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
    period: 2,
    electronConfiguration: [2, 8]
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
    period: 3,
    electronConfiguration: [2, 8, 1]
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
    period: 3,
    electronConfiguration: [2, 8, 2]
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
    period: 3,
    electronConfiguration: [2, 8, 3]
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
    period: 3,
    electronConfiguration: [2, 8, 4]
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
    period: 3,
    electronConfiguration: [2, 8, 5]
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
    period: 3,
    electronConfiguration: [2, 8, 6]
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
    period: 3,
    electronConfiguration: [2, 8, 7]
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
    period: 3,
    electronConfiguration: [2, 8, 8]
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
    period: 4,
    electronConfiguration: [2, 8, 8, 1]
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
    period: 4,
    electronConfiguration: [2, 8, 8, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 9, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 10, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 11, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 13, 1]
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
    period: 4,
    electronConfiguration: [2, 8, 13, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 14, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 15, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 16, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 1]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 2]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 3]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 4]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 5]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 6]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 7]
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
    period: 4,
    electronConfiguration: [2, 8, 18, 8]
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
    period: 5,
    electronConfiguration: [2, 8, 18, 8, 1]
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
    period: 5,
    electronConfiguration: [2, 8, 18, 8, 2]
  },
  Y: {
    symbol: 'Y',
    name: 'Yttrium',
    atomicNumber: 39,
    valenceElectrons: 3,
    electronegativity: 1.2,
    color: '#94ffff',
    radius: 1.90,
    group: 3,
    period: 5,
    electronConfiguration: [2, 8, 18, 9, 2]
  },
  Zr: {
    symbol: 'Zr',
    name: 'Zirconium',
    atomicNumber: 40,
    valenceElectrons: 4,
    electronegativity: 1.3,
    color: '#94e0e0',
    radius: 1.75,
    group: 4,
    period: 5,
    electronConfiguration: [2, 8, 18, 10, 2]
  },
  Nb: {
    symbol: 'Nb',
    name: 'Niobium',
    atomicNumber: 41,
    valenceElectrons: 5,
    electronegativity: 1.6,
    color: '#73c2c9',
    radius: 1.64,
    group: 5,
    period: 5,
    electronConfiguration: [2, 8, 18, 12, 1]
  },
  Mo: {
    symbol: 'Mo',
    name: 'Molybdenum',
    atomicNumber: 42,
    valenceElectrons: 6,
    electronegativity: 2.2,
    color: '#54b5b5',
    radius: 1.54,
    group: 6,
    period: 5,
    electronConfiguration: [2, 8, 18, 13, 1]
  },
  Tc: {
    symbol: 'Tc',
    name: 'Technetium',
    atomicNumber: 43,
    valenceElectrons: 7,
    electronegativity: 1.9,
    color: '#3b9e9e',
    radius: 1.47,
    group: 7,
    period: 5,
    electronConfiguration: [2, 8, 18, 13, 2]
  },
  Ru: {
    symbol: 'Ru',
    name: 'Ruthenium',
    atomicNumber: 44,
    valenceElectrons: 8,
    electronegativity: 2.2,
    color: '#248f8f',
    radius: 1.46,
    group: 8,
    period: 5,
    electronConfiguration: [2, 8, 18, 15, 1]
  },
  Rh: {
    symbol: 'Rh',
    name: 'Rhodium',
    atomicNumber: 45,
    valenceElectrons: 9,
    electronegativity: 2.3,
    color: '#0a7d8c',
    radius: 1.42,
    group: 9,
    period: 5,
    electronConfiguration: [2, 8, 18, 16, 1]
  },
  Pd: {
    symbol: 'Pd',
    name: 'Palladium',
    atomicNumber: 46,
    valenceElectrons: 10,
    electronegativity: 2.2,
    color: '#006985',
    radius: 1.39,
    group: 10,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 0]
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
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 1]
  },
  Cd: {
    symbol: 'Cd',
    name: 'Cadmium',
    atomicNumber: 48,
    valenceElectrons: 2,
    electronegativity: 1.7,
    color: '#ffd98f',
    radius: 1.58,
    group: 12,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 2]
  },
  In: {
    symbol: 'In',
    name: 'Indium',
    atomicNumber: 49,
    valenceElectrons: 3,
    electronegativity: 1.8,
    color: '#a67573',
    radius: 1.93,
    group: 13,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 3]
  },
  Sn: {
    symbol: 'Sn',
    name: 'Tin',
    atomicNumber: 50,
    valenceElectrons: 4,
    electronegativity: 2.0,
    color: '#668080',
    radius: 1.69,
    group: 14,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 4]
  },
  Sb: {
    symbol: 'Sb',
    name: 'Antimony',
    atomicNumber: 51,
    valenceElectrons: 5,
    electronegativity: 2.1,
    color: '#9e63b5',
    radius: 1.59,
    group: 15,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 5]
  },
  Te: {
    symbol: 'Te',
    name: 'Tellurium',
    atomicNumber: 52,
    valenceElectrons: 6,
    electronegativity: 2.1,
    color: '#d47a00',
    radius: 1.70,
    group: 16,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 6]
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
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 7]
  },
  Xe: {
    symbol: 'Xe',
    name: 'Xenon',
    atomicNumber: 54,
    valenceElectrons: 8,
    electronegativity: 2.6,
    color: '#429eb0',
    radius: 1.40,
    group: 18,
    period: 5,
    electronConfiguration: [2, 8, 18, 18, 8]
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
    period: 6,
    electronConfiguration: [2, 8, 18, 18, 8, 1]
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
    period: 6,
    electronConfiguration: [2, 8, 18, 18, 8, 2]
  },
  La: {
    symbol: 'La',
    name: 'Lanthanum',
    atomicNumber: 57,
    valenceElectrons: 3,
    electronegativity: 1.1,
    color: '#70d4ff',
    radius: 2.07,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 18, 9, 2]
  },
  Ce: {
    symbol: 'Ce',
    name: 'Cerium',
    atomicNumber: 58,
    valenceElectrons: 4,
    electronegativity: 1.1,
    color: '#ffffc7',
    radius: 2.04,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 19, 9, 2]
  },
  Pr: {
    symbol: 'Pr',
    name: 'Praseodymium',
    atomicNumber: 59,
    valenceElectrons: 5,
    electronegativity: 1.1,
    color: '#d9ffc7',
    radius: 2.03,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 21, 8, 2]
  },
  Nd: {
    symbol: 'Nd',
    name: 'Neodymium',
    atomicNumber: 60,
    valenceElectrons: 6,
    electronegativity: 1.1,
    color: '#c7ffc7',
    radius: 2.01,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 22, 8, 2]
  },
  Pm: {
    symbol: 'Pm',
    name: 'Promethium',
    atomicNumber: 61,
    valenceElectrons: 7,
    electronegativity: 1.1,
    color: '#a3ffc7',
    radius: 1.99,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 23, 8, 2]
  },
  Sm: {
    symbol: 'Sm',
    name: 'Samarium',
    atomicNumber: 62,
    valenceElectrons: 8,
    electronegativity: 1.2,
    color: '#8fffc7',
    radius: 1.98,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 24, 8, 2]
  },
  Eu: {
    symbol: 'Eu',
    name: 'Europium',
    atomicNumber: 63,
    valenceElectrons: 9,
    electronegativity: 1.2,
    color: '#61ffc7',
    radius: 1.98,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 25, 8, 2]
  },
  Gd: {
    symbol: 'Gd',
    name: 'Gadolinium',
    atomicNumber: 64,
    valenceElectrons: 10,
    electronegativity: 1.2,
    color: '#45ffc7',
    radius: 1.96,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 25, 9, 2]
  },
  Tb: {
    symbol: 'Tb',
    name: 'Terbium',
    atomicNumber: 65,
    valenceElectrons: 11,
    electronegativity: 1.2,
    color: '#30ffc7',
    radius: 1.94,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 27, 8, 2]
  },
  Dy: {
    symbol: 'Dy',
    name: 'Dysprosium',
    atomicNumber: 66,
    valenceElectrons: 12,
    electronegativity: 1.2,
    color: '#1fffc7',
    radius: 1.92,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 28, 8, 2]
  },
  Ho: {
    symbol: 'Ho',
    name: 'Holmium',
    atomicNumber: 67,
    valenceElectrons: 13,
    electronegativity: 1.2,
    color: '#00ff9c',
    radius: 1.92,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 29, 8, 2]
  },
  Er: {
    symbol: 'Er',
    name: 'Erbium',
    atomicNumber: 68,
    valenceElectrons: 14,
    electronegativity: 1.2,
    color: '#00e675',
    radius: 1.89,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 30, 8, 2]
  },
  Tm: {
    symbol: 'Tm',
    name: 'Thulium',
    atomicNumber: 69,
    valenceElectrons: 15,
    electronegativity: 1.2,
    color: '#00d452',
    radius: 1.90,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 31, 8, 2]
  },
  Yb: {
    symbol: 'Yb',
    name: 'Ytterbium',
    atomicNumber: 70,
    valenceElectrons: 16,
    electronegativity: 1.1,
    color: '#00bf38',
    radius: 1.87,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 8, 2]
  },
  Lu: {
    symbol: 'Lu',
    name: 'Lutetium',
    atomicNumber: 71,
    valenceElectrons: 17,
    electronegativity: 1.3,
    color: '#00ab24',
    radius: 1.87,
    group: 3,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 9, 2]
  },
  Hf: {
    symbol: 'Hf',
    name: 'Hafnium',
    atomicNumber: 72,
    valenceElectrons: 4,
    electronegativity: 1.3,
    color: '#4dc2ff',
    radius: 1.75,
    group: 4,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 10, 2]
  },
  Ta: {
    symbol: 'Ta',
    name: 'Tantalum',
    atomicNumber: 73,
    valenceElectrons: 5,
    electronegativity: 1.5,
    color: '#4da6ff',
    radius: 1.70,
    group: 5,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 11, 2]
  },
  W: {
    symbol: 'W',
    name: 'Tungsten',
    atomicNumber: 74,
    valenceElectrons: 6,
    electronegativity: 2.4,
    color: '#2194d6',
    radius: 1.62,
    group: 6,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 12, 2]
  },
  Re: {
    symbol: 'Re',
    name: 'Rhenium',
    atomicNumber: 75,
    valenceElectrons: 7,
    electronegativity: 1.9,
    color: '#267dab',
    radius: 1.51,
    group: 7,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 13, 2]
  },
  Os: {
    symbol: 'Os',
    name: 'Osmium',
    atomicNumber: 76,
    valenceElectrons: 8,
    electronegativity: 2.2,
    color: '#266696',
    radius: 1.44,
    group: 8,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 14, 2]
  },
  Ir: {
    symbol: 'Ir',
    name: 'Iridium',
    atomicNumber: 77,
    valenceElectrons: 9,
    electronegativity: 2.2,
    color: '#175487',
    radius: 1.41,
    group: 9,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 15, 2]
  },
  Pt: {
    symbol: 'Pt',
    name: 'Platinum',
    atomicNumber: 78,
    valenceElectrons: 10,
    electronegativity: 2.3,
    color: '#d0d0e0',
    radius: 1.36,
    group: 10,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 17, 1]
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
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 1]
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
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 2]
  },
  Tl: {
    symbol: 'Tl',
    name: 'Thallium',
    atomicNumber: 81,
    valenceElectrons: 3,
    electronegativity: 1.6,
    color: '#a6544d',
    radius: 1.96,
    group: 13,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 3]
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
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 4]
  },
  Bi: {
    symbol: 'Bi',
    name: 'Bismuth',
    atomicNumber: 83,
    valenceElectrons: 5,
    electronegativity: 2.0,
    color: '#9e4fb5',
    radius: 1.54,
    group: 15,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 5]
  },
  Po: {
    symbol: 'Po',
    name: 'Polonium',
    atomicNumber: 84,
    valenceElectrons: 6,
    electronegativity: 2.0,
    color: '#ab5c00',
    radius: 1.68,
    group: 16,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 6]
  },
  At: {
    symbol: 'At',
    name: 'Astatine',
    atomicNumber: 85,
    valenceElectrons: 7,
    electronegativity: 2.2,
    color: '#754f45',
    radius: 1.50,
    group: 17,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 7]
  },
  Rn: {
    symbol: 'Rn',
    name: 'Radon',
    atomicNumber: 86,
    valenceElectrons: 8,
    electronegativity: 2.2,
    color: '#428296',
    radius: 1.50,
    group: 18,
    period: 6,
    electronConfiguration: [2, 8, 18, 32, 18, 8]
  },
  
  // Period 7 (Common elements)
  Fr: {
    symbol: 'Fr',
    name: 'Francium',
    atomicNumber: 87,
    valenceElectrons: 1,
    electronegativity: 0.7,
    color: '#420066',
    radius: 2.60,
    group: 1,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 18, 8, 1]
  },
  Ra: {
    symbol: 'Ra',
    name: 'Radium',
    atomicNumber: 88,
    valenceElectrons: 2,
    electronegativity: 0.9,
    color: '#007d00',
    radius: 2.21,
    group: 2,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 18, 8, 2]
  },
  Ac: {
    symbol: 'Ac',
    name: 'Actinium',
    atomicNumber: 89,
    valenceElectrons: 3,
    electronegativity: 1.1,
    color: '#70abfa',
    radius: 2.15,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 18, 9, 2]
  },
  Th: {
    symbol: 'Th',
    name: 'Thorium',
    atomicNumber: 90,
    valenceElectrons: 4,
    electronegativity: 1.3,
    color: '#00baff',
    radius: 2.06,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 18, 10, 2]
  },
  Pa: {
    symbol: 'Pa',
    name: 'Protactinium',
    atomicNumber: 91,
    valenceElectrons: 5,
    electronegativity: 1.5,
    color: '#00a1ff',
    radius: 2.00,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 20, 9, 2]
  },
  U: {
    symbol: 'U',
    name: 'Uranium',
    atomicNumber: 92,
    valenceElectrons: 6,
    electronegativity: 1.4,
    color: '#008fff',
    radius: 1.96,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 21, 9, 2]
  },
  Np: {
    symbol: 'Np',
    name: 'Neptunium',
    atomicNumber: 93,
    valenceElectrons: 7,
    electronegativity: 1.4,
    color: '#0080ff',
    radius: 1.90,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 22, 9, 2]
  },
  Pu: {
    symbol: 'Pu',
    name: 'Plutonium',
    atomicNumber: 94,
    valenceElectrons: 8,
    electronegativity: 1.3,
    color: '#006bff',
    radius: 1.87,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 24, 8, 2]
  },
  Am: {
    symbol: 'Am',
    name: 'Americium',
    atomicNumber: 95,
    valenceElectrons: 9,
    electronegativity: 1.3,
    color: '#545cf2',
    radius: 1.80,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 25, 8, 2]
  },
  Cm: {
    symbol: 'Cm',
    name: 'Curium',
    atomicNumber: 96,
    valenceElectrons: 10,
    electronegativity: 1.3,
    color: '#785ce3',
    radius: 1.69,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 25, 9, 2]
  },
  Bk: {
    symbol: 'Bk',
    name: 'Berkelium',
    atomicNumber: 97,
    valenceElectrons: 11,
    electronegativity: 1.3,
    color: '#8a4fe3',
    radius: 1.68,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 27, 8, 2]
  },
  Cf: {
    symbol: 'Cf',
    name: 'Californium',
    atomicNumber: 98,
    valenceElectrons: 12,
    electronegativity: 1.3,
    color: '#a136d4',
    radius: 1.68,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 28, 8, 2]
  },
  Es: {
    symbol: 'Es',
    name: 'Einsteinium',
    atomicNumber: 99,
    valenceElectrons: 13,
    electronegativity: 1.3,
    color: '#b31fd4',
    radius: 1.65,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 29, 8, 2]
  },
  Fm: {
    symbol: 'Fm',
    name: 'Fermium',
    atomicNumber: 100,
    valenceElectrons: 14,
    electronegativity: 1.3,
    color: '#b31fba',
    radius: 1.67,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 30, 8, 2]
  },
  Md: {
    symbol: 'Md',
    name: 'Mendelevium',
    atomicNumber: 101,
    valenceElectrons: 15,
    electronegativity: 1.3,
    color: '#b30da6',
    radius: 1.73,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 31, 8, 2]
  },
  No: {
    symbol: 'No',
    name: 'Nobelium',
    atomicNumber: 102,
    valenceElectrons: 16,
    electronegativity: 1.3,
    color: '#bd0d87',
    radius: 1.76,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 8, 2]
  },
  Lr: {
    symbol: 'Lr',
    name: 'Lawrencium',
    atomicNumber: 103,
    valenceElectrons: 17,
    electronegativity: 1.3,
    color: '#c70066',
    radius: 1.61,
    group: 3,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 8, 3]
  },
  Rf: {
    symbol: 'Rf',
    name: 'Rutherfordium',
    atomicNumber: 104,
    valenceElectrons: 4,
    electronegativity: 1.3,
    color: '#cc0059',
    radius: 1.57,
    group: 4,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 10, 2]
  },
  Db: {
    symbol: 'Db',
    name: 'Dubnium',
    atomicNumber: 105,
    valenceElectrons: 5,
    electronegativity: 1.5,
    color: '#d1004f',
    radius: 1.49,
    group: 5,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 11, 2]
  },
  Sg: {
    symbol: 'Sg',
    name: 'Seaborgium',
    atomicNumber: 106,
    valenceElectrons: 6,
    electronegativity: 1.9,
    color: '#d90045',
    radius: 1.43,
    group: 6,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 12, 2]
  },
  Bh: {
    symbol: 'Bh',
    name: 'Bohrium',
    atomicNumber: 107,
    valenceElectrons: 7,
    electronegativity: 2.2,
    color: '#e00038',
    radius: 1.41,
    group: 7,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 13, 2]
  },
  Hs: {
    symbol: 'Hs',
    name: 'Hassium',
    atomicNumber: 108,
    valenceElectrons: 8,
    electronegativity: 2.3,
    color: '#e6002e',
    radius: 1.34,
    group: 8,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 14, 2]
  },
  Mt: {
    symbol: 'Mt',
    name: 'Meitnerium',
    atomicNumber: 109,
    valenceElectrons: 9,
    electronegativity: 2.4,
    color: '#eb0026',
    radius: 1.29,
    group: 9,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 15, 2]
  },
  Ds: {
    symbol: 'Ds',
    name: 'Darmstadtium',
    atomicNumber: 110,
    valenceElectrons: 10,
    electronegativity: 2.8,
    color: '#f00021',
    radius: 1.28,
    group: 10,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 17, 1]
  },
  Rg: {
    symbol: 'Rg',
    name: 'Roentgenium',
    atomicNumber: 111,
    valenceElectrons: 1,
    electronegativity: 2.9,
    color: '#f5001a',
    radius: 1.21,
    group: 11,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 1]
  },
  Cn: {
    symbol: 'Cn',
    name: 'Copernicium',
    atomicNumber: 112,
    valenceElectrons: 2,
    electronegativity: 3.0,
    color: '#f70014',
    radius: 1.22,
    group: 12,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 2]
  },
  Nh: {
    symbol: 'Nh',
    name: 'Nihonium',
    atomicNumber: 113,
    valenceElectrons: 3,
    electronegativity: 3.1,
    color: '#fc000a',
    radius: 1.36,
    group: 13,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 3]
  },
  Fl: {
    symbol: 'Fl',
    name: 'Flerovium',
    atomicNumber: 114,
    valenceElectrons: 4,
    electronegativity: 3.0,
    color: '#ff0000',
    radius: 1.43,
    group: 14,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 4]
  },
  Mc: {
    symbol: 'Mc',
    name: 'Moscovium',
    atomicNumber: 115,
    valenceElectrons: 5,
    electronegativity: 2.8,
    color: '#ff0d00',
    radius: 1.62,
    group: 15,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 5]
  },
  Lv: {
    symbol: 'Lv',
    name: 'Livermorium',
    atomicNumber: 116,
    valenceElectrons: 6,
    electronegativity: 2.7,
    color: '#ff1a00',
    radius: 1.75,
    group: 16,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 6]
  },
  Ts: {
    symbol: 'Ts',
    name: 'Tennessine',
    atomicNumber: 117,
    valenceElectrons: 7,
    electronegativity: 2.6,
    color: '#ff2600',
    radius: 1.65,
    group: 17,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 7]
  },
  Og: {
    symbol: 'Og',
    name: 'Oganesson',
    atomicNumber: 118,
    valenceElectrons: 8,
    electronegativity: 2.5,
    color: '#ff3300',
    radius: 1.57,
    group: 18,
    period: 7,
    electronConfiguration: [2, 8, 18, 32, 32, 18, 8]
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
  const nobleGases = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'];
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
  const metals = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra', 'Al', 'Ga', 'In', 'Sn', 'Pb', 'Bi', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl'];
  const nonmetals = ['F', 'Cl', 'Br', 'I', 'At', 'O', 'S', 'Se', 'Te', 'Po', 'N', 'P', 'As', 'Sb', 'Bi'];
  
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
    ['Si', 'O'], ['Si', 'F'], ['Si', 'Cl'],
    ['Se', 'O'], ['Te', 'O'], ['As', 'O']
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
    'K': 1, 'Ca': 2, 'Sc': 3, 'Ti': 4, 'V': 5, 'Cr': 6, 'Mn': 7, 'Fe': 6, 'Co': 3, 'Ni': 2, 'Cu': 2, 'Zn': 2, 'Ga': 3, 'Ge': 4, 'As': 5, 'Se': 6, 'Br': 1, 'Kr': 0,
    'Rb': 1, 'Sr': 2, 'Y': 3, 'Zr': 4, 'Nb': 5, 'Mo': 6, 'Tc': 7, 'Ru': 8, 'Rh': 3, 'Pd': 2, 'Ag': 1, 'Cd': 2, 'In': 3, 'Sn': 4, 'Sb': 5, 'Te': 6, 'I': 1, 'Xe': 0,
    'Cs': 1, 'Ba': 2, 'La': 3, 'Hf': 4, 'Ta': 5, 'W': 6, 'Re': 7, 'Os': 8, 'Ir': 3, 'Pt': 4, 'Au': 3, 'Hg': 2, 'Tl': 3, 'Pb': 4, 'Bi': 5, 'Po': 6, 'At': 1, 'Rn': 0,
    'Fr': 1, 'Ra': 2, 'Ac': 3, 'Rf': 4, 'Db': 5, 'Sg': 6, 'Bh': 7, 'Hs': 8, 'Mt': 3, 'Ds': 2, 'Rg': 1, 'Cn': 2, 'Nh': 3, 'Fl': 4, 'Mc': 5, 'Lv': 6, 'Ts': 1, 'Og': 0
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
    ['Al', 'O'], ['Al', 'F'], ['Al', 'Cl'], ['Si', 'O'], ['P', 'O'], ['S', 'O'],
    ['Fe', 'O'], ['Cu', 'O'], ['Zn', 'O'], ['Ag', 'Cl'], ['Au', 'Cl'], ['Pb', 'O']
  ];
  
  return bondPairs.some(([a, b]) => 
    (a === atom1Symbol && b === atom2Symbol) || 
    (a === atom2Symbol && b === atom1Symbol)
  );
}

// Get shell names for display
export function getShellNames(): string[] {
  return ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
}

// Get maximum electrons per shell
export function getMaxElectronsPerShell(): number[] {
  return [2, 8, 18, 32, 32, 18, 2];
}

// Get shell radius for visualization
export function getShellRadius(shellIndex: number, atomRadius: number): number {
  const baseRadius = atomRadius + 0.4;
  return baseRadius + (shellIndex * 0.35);
}

// Get electron color based on shell
export function getElectronColor(shellIndex: number): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
  return colors[shellIndex] || '#00ffff';
}