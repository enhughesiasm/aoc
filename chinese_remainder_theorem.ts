import { greatestCommonDivisor } from './shared.ts';

function modInverse(a: number, m: number): number | null {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) {
      return x;
    }
  }
  return null;
}

function productOfAllModuli(moduli: number[]): number {
  return moduli.reduce((acc, cur) => acc * cur, 1);
}
function areCoprime(moduli: number[]): boolean {
  for (let i = 0; i < moduli.length; i++) {
    for (let j = i + 1; j < moduli.length; j++) {
      if (greatestCommonDivisor(moduli[i], moduli[j]) !== 1) {
        console.log('❌ Not coprime');
        return false;
      }
    }
  }
  return true;
}

function isConsistent(remainders: number[], moduli: number[]): boolean {
  for (let i = 0; i < remainders.length; i++) {
    if (remainders[i] >= moduli[i]) {
      console.log('❌ Is not consistent');
      return false;
    }
  }
  return true;
}

function hasModularInverse(moduli: number[]): boolean {
  for (const modulus of moduli) {
    if (modInverse(1, modulus) === null) {
      console.log('❌ No modular inverse');
      return false;
    }
  }
  return true;
}

export function chineseRemainderTheorem(
  remainders: number[],
  moduli: number[]
): number | null {
  if (
    areCoprime(moduli) &&
    isConsistent(remainders, moduli) &&
    hasModularInverse(moduli)
  ) {
    const M = productOfAllModuli(moduli);

    let result = 0;
    for (let i = 0; i < remainders.length; i++) {
      const mi = M / moduli[i];
      const ai = remainders[i] * modInverse(mi, moduli[i]);

      if (ai === null) {
        return null; // No modular inverse found
      }

      result += ai * mi;
    }

    if (result !== null) {
      return result % M;
    } else {
      console.log('No solution found.');
    }
  } else {
    console.log('Chinese Remainder Theorem is not applicable.');
  }
}
