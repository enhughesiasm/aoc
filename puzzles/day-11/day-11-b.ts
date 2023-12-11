import { max } from 'mathjs';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

let highestColIndex = -1;

const EXPANSION_FACTOR = 1000000;

export async function day11b(dataPath?: string) {
  const data = await readData(dataPath);

  const universe = data.map((l) => getGalaxyPositionsForRow(l));

  const emptyRows = getEmptyRowIndexes(universe);

  const emptyCols = getEmptyColIndexes(universe);

  const allGalaxyPositions = getExpandedGalaxyPositions(
    universe,
    emptyRows,
    emptyCols
  );

  return sumDistanceBetweenGalaxies(allGalaxyPositions);
}

function sumDistanceBetweenGalaxies(galaxies: [number, number][]) {
  let dist = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < i; j++) {
      dist += manhattanDistance(galaxies[i], galaxies[j]);
    }
  }
  return dist;
}

function getExpandedGalaxyPositions(
  universe: number[][],
  emptyRows: number[],
  emptyCols: number[]
): [number, number][] {
  const galaxies: [number, number][] = [];

  universe.forEach((r, y) => {
    r.forEach((x) => {
      galaxies.push([
        getExpandedIndex(y, emptyRows),
        getExpandedIndex(x, emptyCols),
      ]);
    });
  });

  return galaxies;
}

function getExpandedIndex(
  originalIndex: number,
  emptyIndices: number[]
): number {
  const emptyBeforeThis = emptyIndices.filter((c) => c < originalIndex);
  return originalIndex + emptyBeforeThis.length * (EXPANSION_FACTOR - 1);
}

function manhattanDistance(
  start: [number, number],
  end: [number, number]
): number {
  return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
}

function getEmptyColIndexes(universe: number[][]): number[] {
  const emptyCols: number[] = [];

  for (let i = 0; i < highestColIndex; i++) {
    if (universe.some((r) => r.includes(i))) continue;
    emptyCols.push(i);
  }

  return emptyCols;
}

function getEmptyRowIndexes(universe: number[][]): number[] {
  const emptyRows: number[] = [];

  universe.forEach((r, i) => {
    if (r.length === 0) {
      emptyRows.push(i);
    }
  });

  return emptyRows;
}

function getGalaxyPositionsForRow(l: string): number[] {
  const positions: number[] = [];

  Array.from(l).forEach((char, index) => {
    if (char === '#') {
      positions.push(index);
    }
  });

  highestColIndex = max(highestColIndex, ...positions);

  return positions;
}

const answer = await day11b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
