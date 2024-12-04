import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const grid = data.map((l) => l.split(''));
  return countEcksShape(grid);
}

function countEcksShape(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function isValidEcks(y: number, x: number): boolean {
    if (y > 0 && y < rows - 1 && x > 0 && x < cols - 1) {
      return (
        grid[y][x] === 'A' &&
        ((grid[y - 1][x - 1] === 'M' && grid[y + 1][x + 1] === 'S') ||
          (grid[y - 1][x - 1] === 'S' && grid[y + 1][x + 1] === 'M')) &&
        ((grid[y - 1][x + 1] === 'M' && grid[y + 1][x - 1] === 'S') ||
          (grid[y - 1][x + 1] === 'S' && grid[y + 1][x - 1] === 'M'))
      );
    }
    return false;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (isValidEcks(y, x)) {
        count++;
      }
    }
  }

  return count;
}
