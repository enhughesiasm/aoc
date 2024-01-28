import {
  countFrequency,
  getAllIndicesForCharacter,
  readData,
  replaceAt,
  sum,
} from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const grid = await readData(dataPath);

  while (tiltNorth(grid)) {}

  const loads = grid.map((r, i) => calculateLoad(r, grid.length - i));

  return sum(loads);
}

function calculateLoad(row: string, distanceToSouth: number) {
  return countFrequency(row, 'O') * distanceToSouth;
}

function tiltNorth(grid: string[]) {
  let didMove = false;
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

  return didMove;
}
