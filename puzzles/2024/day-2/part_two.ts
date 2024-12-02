import { numericOnly, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const levels = data.map((l) => l.split(' ').map((x) => parseInt(x)));

  const areReportsSafe = levels.map((d) => tryProblemDampener(d));
  return areReportsSafe.filter((d) => d === true).length;
}

function calculateDifferences(levels: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < levels.length - 1; i++) {
    differences.push(levels[i + 1] - levels[i]);
  }
  return differences;
}

function tryProblemDampener(levels: number[]): boolean {
  if (isSafe(calculateDifferences(levels))) return true;

  for (let i = 0; i < levels.length; i++) {
    const filteredLevels = levels.filter((_, j) => j !== i);
    if (isSafe(calculateDifferences(filteredLevels))) return true;
  }

  return false;
}

function isSafe(differences: number[]): boolean {
  if (differences.every((x) => x > 0) || differences.every((x) => x < 0)) {
    if (differences.every((x) => x >= -3 && x <= 3)) {
      return true;
    }
  }
  return false;
}
