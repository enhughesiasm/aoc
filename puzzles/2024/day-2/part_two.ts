import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const reports = data.map((l) => l.split(' ').map((x) => parseInt(x)));

  const isEachReportSafe = reports.map((d) => tryProblemDampener(d));
  return isEachReportSafe.filter(Boolean).length;
}

function tryProblemDampener(levels: number[]): boolean {
  return (
    isSafe(levels) ||
    // try each combination for safety, leaving out one element at a time
    levels.some((_, i) => isSafe(levels.filter((_, j) => j !== i)))
  );
}

function calculateDifferences(levels: number[]): number[] {
  return levels.slice(1).map((level, i) => level - levels[i]);
}

function isSafe(levels: number[]): boolean {
  const differences = calculateDifferences(levels);

  return (
    (differences.every((x) => x > 0) || differences.every((x) => x < 0)) &&
    differences.every((x) => x >= -3 && x <= 3)
  );
}
