import { countFrequency, dumpGrid, readData } from '../../../lib/shared.ts';

type Rules = { stayAliveIf: number[]; becomeAliveIf: number[] };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let grid = data.map((d) => d.split(''));

  const WIDTH = grid[0].length;
  const HEIGHT = grid.length;

  activateCorners(grid, WIDTH, HEIGHT);

  const RULES: Rules = { stayAliveIf: [2, 3], becomeAliveIf: [3] };

  const STEPS = 100;

  for (let i = 0; i < STEPS; i++) {
    computeNextState(grid, RULES, WIDTH, HEIGHT);
  }

  const gridContents = grid.flat().join('');

  return countFrequency(gridContents, '#');
}

// this is essentially game of life
function computeNextState(
  grid: string[][],
  RULES: Rules,
  WIDTH: number,
  HEIGHT: number
) {
  const initialGrid = structuredClone(grid);

  activateCorners(grid, WIDTH, HEIGHT);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const count = countNeighbours(x, y, initialGrid);
      const current = initialGrid[y][x];
      // console.log(`x:${x}, y:${y} was ${current} and has count ${count}`);
      if (current === '#' && !RULES.stayAliveIf.includes(count)) {
        grid[y][x] = '.';
      } else if (current === '.' && RULES.becomeAliveIf.includes(count)) {
        grid[y][x] = '#';
      }
    }
  }

  activateCorners(grid, WIDTH, HEIGHT);
}

function activateCorners(grid: string[][], WIDTH: number, HEIGHT: number) {
  grid[0][0] = '#';
  grid[HEIGHT - 1][0] = '#';
  grid[0][WIDTH - 1] = '#';
  grid[HEIGHT - 1][WIDTH - 1] = '#';
}

// TODO: there's definitely a smarter way to do this
function countNeighbours(x: number, y: number, grid: string[][]): number {
  let count = 0;

  for (
    let cy = Math.max(y - 1, 0);
    cy <= Math.min(y + 1, grid.length - 1);
    cy++
  ) {
    for (
      let cx = Math.max(x - 1, 0);
      cx <= Math.min(x + 1, grid[0].length - 1);
      cx++
    ) {
      if (!(cy === y && cx === x) && grid[cy][cx] === '#') {
        count++;
      } else {
      }
    }
  }
  return count;
}
