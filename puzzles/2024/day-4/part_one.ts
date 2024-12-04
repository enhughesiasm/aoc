import {
  ALL_CARTESIAN_DIRECTIONS_WITH_DIAGONAL,
  readData,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const grid = data.map((l) => l.split(''));

  return countXmas(grid);
}

function countXmas(grid: string[][]): number {
  const word = 'xmas';

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  function makesWord(y: number, x: number, dy: number, dx: number): boolean {
    for (let i = 0; i < word.length; i++) {
      const newY = y + dy * i;
      const newX = x + dx * i;
      if (
        newY < 0 ||
        newY >= rows ||
        newX < 0 ||
        newX >= cols ||
        grid[newY][newX].toLowerCase() !== word[i].toLowerCase()
      ) {
        return false;
      }
    }
    return true;
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      for (const [dy, dx] of ALL_CARTESIAN_DIRECTIONS_WITH_DIAGONAL) {
        if (makesWord(y, x, dy, dx)) {
          count++;
        }
      }
    }
  }

  return count;
}
