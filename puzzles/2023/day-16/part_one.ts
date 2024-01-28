import {
  countFrequency,
  dumpGrid,
  getGridMax,
  isWithinBounds,
  readData,
  sum,
} from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const grid = (await readData(dataPath)).map((s) => s.split(''));

  const energizedCells = traceRay(grid);

  //dumpGrid(energizedCells);

  return sum(energizedCells.map((row) => countFrequency(row.join(''), '#')));
}

type Beam = {
  pos: [number, number];
  dir: [number, number];
};

const visited = new Set<string>();

function emptyEnergisedCells({ maxX, maxY }: { maxX: number; maxY: number }) {
  const energizedCells: string[][] = [];

  for (let i = 0; i <= maxX; i++) {
    const row = [];
    for (let j = 0; j <= maxY; j++) {
      row.push('.');
    }
    energizedCells.push(row);
  }
  return energizedCells;
}

function traceRay(grid: string[][]): string[][] {
  const energizedCells = emptyEnergisedCells(getGridMax(grid));

  const initialBeam: Beam = { pos: [-1, 0], dir: [1, 0] };

  let beams: Beam[] = [initialBeam];

  while (beams.length > 0) {
    beams = beams.map((b) => moveBeam(b, grid, energizedCells)).flat();
  }

  return energizedCells;
}

function moveBeam(
  beam: Beam,
  grid: string[][],
  energizedCells: string[][]
): Beam[] {
  const newPos: [number, number] = [
    beam.pos[0] + beam.dir[0],
    beam.pos[1] + beam.dir[1],
  ];

  if (!isWithinBounds(grid, newPos)) {
    return [];
  }

  if (visited.has(JSON.stringify({ ...beam, pos: newPos }))) {
    return [];
  }

  energizedCells[newPos[1]][newPos[0]] = '#';
  visited.add(JSON.stringify({ ...beam, pos: newPos }));

  const encounteredChar = grid[newPos[1]][newPos[0]];

  switch (encounteredChar) {
    case '|':
      if (beam.dir[1] === 0) {
        // travelling horizontally so split beam vertically
        return [
          { pos: newPos, dir: [0, 1] },
          { pos: newPos, dir: [0, -1] },
        ];
      }
      return [{ ...beam, pos: newPos }];
    case '-':
      if (beam.dir[0] === 0) {
        // travelling vertically so split beam horizontally
        return [
          { pos: newPos, dir: [1, 0] },
          { pos: newPos, dir: [-1, 0] },
        ];
      }
      return [{ ...beam, pos: newPos }];
    case '\\':
      // this mirror transposes the vector
      return [{ pos: newPos, dir: [beam.dir[1], beam.dir[0]] }];
    case '/':
      // this mirror transposes + reflects the vector
      return [{ pos: newPos, dir: [beam.dir[1] * -1, beam.dir[0] * -1] }];
    case '.':
      return [{ ...beam, pos: newPos }];
  }
}

function visualise(grid: string[][], beams: Beam[]) {
  console.log('\r\n---');
  const vis = [...grid.map((r) => [...r])];

  for (const b of beams) {
    vis[b.pos[1]][b.pos[0]] = getBeamVis(b.dir);
  }

  dumpGrid(vis);
}

function getBeamVis(dir: [number, number]) {
  if (dir[0] === 0 && dir[1] === 1) {
    return 'v';
  } else if (dir[0] === 0 && dir[1] === -1) {
    return '^';
  } else if (dir[0] === 1 && dir[1] === 0) {
    return '>';
  } else if (dir[0] === -1 && dir[1] === 0) return '<';

  return '?';
}
