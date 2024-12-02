import { numericOnly, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const levels = data.map((l) => l.split(' ').map((x) => parseInt(x)));

  const differences = levels.map((l) => calculateDifferences(l));

  const areSafe = differences.map((d) => isSafe(d));
  return areSafe.filter((d) => d === true).length;
}

function calculateDifferences(levels: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < levels.length - 1; i++) {
    differences.push(levels[i + 1] - levels[i]);
  }
  return differences;
}

function isSafe(differences: number[]): boolean {
  if (differences.some((x) => x === 0)) return false;

  if (differences.every((x) => x > 0) || differences.every((x) => x < 0)) {
    if (differences.every((x) => x >= -3 && x <= 3)) {
      return true;
    }
  }
  return false;
}
