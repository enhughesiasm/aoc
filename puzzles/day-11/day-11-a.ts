import { index, max } from 'mathjs';
import { readData, sum } from '../../shared.ts';
import chalk from 'chalk';

let highestColIndex = -1;

export async function day11a(dataPath?: string) {
  const data = await readData(dataPath);

  const universe = data.map((l) => getGalaxyPositionsForRow(l));

  expandUniverse(universe, getEmptyRowIndexes(universe));

  const emptyCols = getEmptyColIndexes(universe);

  const allGalaxyPositions = getAllGalaxyPositions(universe, emptyCols);

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

function getAllGalaxyPositions(
  universe: number[][],
  emptyCols: number[]
): [number, number][] {
  const galaxies: [number, number][] = [];

  universe.forEach((r, y) => {
    r.forEach((x) => {
      galaxies.push([y, getExpandedIndexForCol(x, emptyCols)]);
    });
  });

  return galaxies;
}

function getExpandedIndexForCol(
  originalIndex: number,
  emptyCols: number[]
): number {
  const relevantCols = emptyCols.filter((c) => c < originalIndex);
  return originalIndex + relevantCols.length;
}

function manhattanDistance(
  start: [number, number],
  end: [number, number]
): number {
  return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
}

function getEmptyColIndexes(universe: number[][]): number[] {
  const cols: number[] = [];

  for (let i = 0; i < highestColIndex; i++) {
    if (universe.some((r) => r.includes(i))) continue;
    cols.push(i);
  }

  return cols;
}

function getEmptyRowIndexes(universe: number[][]): number[] {
  const indexes: number[] = [];
  let expansionCount = 0;
  universe.forEach((r, i) => {
    if (r.length === 0) {
      indexes.push(i + expansionCount);
      expansionCount++;
    }
  });

  return indexes;
}

function expandUniverse(universe: number[][], emptyRowIndexes) {
  emptyRowIndexes.forEach((i) => {
    universe.splice(i, 0, []);
  });
}

function getGalaxyPositionsForRow(l: string): number[] {
  const indices: number[] = [];

  Array.from(l).forEach((char, index) => {
    if (char === '#') {
      indices.push(index);
    }
  });

  highestColIndex = max(highestColIndex, ...indices);

  return indices;
}

const answer = await day11a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
