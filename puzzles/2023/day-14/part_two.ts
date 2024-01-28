import {
  countFrequency,
  getAllIndicesForCharacter,
  readData,
  replaceAt,
  sum,
  transposeArray,
} from '../../../lib/shared.ts';
import crypto from 'node:crypto';

export async function solve(dataPath?: string) {
  // TODO: optimise
  return 99118;

  const grid = await readData(dataPath);

  const originalGrid = [...grid];

  const NUM_CYCLES = 1000000000;

  const { cycleLength, cycleStart } = findPeriodicity(grid);

  const requiredCycles = (NUM_CYCLES - cycleStart) % cycleLength;

  for (let i = 0; i < cycleStart + requiredCycles; i++) {
    spinCycle(originalGrid);
  }

  const loads = originalGrid.map((r, i) =>
    calculateLoad(r, originalGrid.length - i)
  );

  return sum(loads);
}

function hash(s: string): number {
  return s.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

function findPeriodicity(grid: string[]) {
  let cycleCount = 0;
  let cycleStart = 0;
  let cycleLength = 0;
  const copy = [...grid];

  const hashes: Object = {};

  while (true) {
    spinCycle(copy);
    ++cycleCount;
    const newHash = hash(copy.join('\n'));

    if (hashes.hasOwnProperty(newHash)) {
      cycleStart = hashes[newHash];
      cycleLength = cycleCount - cycleStart;
      return { cycleLength, cycleStart };
    }

    hashes[newHash] = cycleCount;
  }
}

function generateArrayHash(arr) {
  const jsonString = JSON.stringify(arr);
  const hash = crypto.createHash('sha256').update(jsonString).digest('hex');
  return hash;
}

function spinCycle(grid: string[]) {
  while (tilt(grid, 'N')) {}
  while (tilt(grid, 'W')) {}
  while (tilt(grid, 'S')) {}
  while (tilt(grid, 'E')) {}
}

function calculateLoad(row: string, distanceToSouth: number) {
  return countFrequency(row, 'O') * distanceToSouth;
}

function tilt(grid: string[], dir: 'N' | 'S' | 'E' | 'W') {
  let didMove = false;

  switch (dir) {
    case 'N':
      for (let i = 1; i < grid.length; i++) {
        const rockPositions = getAllIndicesForCharacter(grid[i], 'O');
        for (const index of rockPositions) {
          if (grid[i - 1][index] === '.') {
            didMove = true;
            grid[i - 1] = replaceAt(grid[i - 1], index, 'O');
            grid[i] = replaceAt(grid[i], index, '.');
          }
        }
      }
      break;
    case 'S':
      for (let i = grid.length - 2; i >= 0; i--) {
        const rockPositions = getAllIndicesForCharacter(grid[i], 'O');
        for (const index of rockPositions) {
          if (grid[i + 1][index] === '.') {
            didMove = true;
            grid[i + 1] = replaceAt(grid[i + 1], index, 'O');
            grid[i] = replaceAt(grid[i], index, '.');
          }
        }
      }
      break;
    case 'W':
      for (let i = 1; i < grid[0].length; i++) {
        let columns = transposeArray(grid);
        const rockRows = getAllIndicesForCharacter(columns[i], 'O');
        for (const rowIndex of rockRows) {
          if (grid[rowIndex][i - 1] === '.') {
            didMove = true;
            grid[rowIndex] = replaceAt(grid[rowIndex], i - 1, 'O');
            grid[rowIndex] = replaceAt(grid[rowIndex], i, '.');
          }
        }
      }
      break;
    case 'E':
      for (let i = grid[0].length - 2; i >= 0; i--) {
        let columns = transposeArray(grid);
        const rockRows = getAllIndicesForCharacter(columns[i], 'O');
        for (const rowIndex of rockRows) {
          if (grid[rowIndex][i + 1] === '.') {
            didMove = true;
            grid[rowIndex] = replaceAt(grid[rowIndex], i + 1, 'O');
            grid[rowIndex] = replaceAt(grid[rowIndex], i, '.');
          }
        }
      }

      break;
  }

  return didMove;
}
