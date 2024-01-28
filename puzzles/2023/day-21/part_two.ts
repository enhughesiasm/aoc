import { readData, replaceAt, sum } from '../../../lib/shared.ts';
import chalk from 'chalk';

// TODO:
// fully understand this, cleanup,
// convert Point to use [x,y] instead of [y,x] 😱

type Plot = '.' | '#';

export type Grid = Plot[][];
type Point = [number, number];

// check out this guy's /lib folder - really nice stuff!
// https://github.com/joeleisner/advent-of-code-2023/blob/main/days/21/mod.ts
export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const start = findStart(data);

  const grid = data.map((d) => d.split('') as Plot[]);

  return countReachablePlots(start, grid, 26_501_365);
}

function findStart(rows: string[]): [number, number] {
  for (let row = 0; row < rows.length; row++) {
    if (rows[row].includes('S')) {
      for (let col = 0; col < rows[0].length; col++) {
        if (rows[row][col] === 'S') {
          rows[row] = replaceAt(rows[row], col, '.');
          return [row, col];
        }
      }
    }
  }
}

function neighbors([r, c]: Point, grid: Grid) {
  return [
    [r - 1, c], // North
    [r + 1, c], // South
    [r, c - 1], // West
    [r, c + 1], // East
  ].filter(
    ([r, c]) =>
      r >= 0 &&
      c >= 0 &&
      r < grid.length &&
      c < grid[0].length &&
      grid[r][c] === '.'
  ) as Point[];
}

class TupleSet<TTuple extends any[]> {
  #set: Set<string>;

  constructor(iterable?: TTuple[] | TupleSet<TTuple> | Set<TTuple>) {
    if (!iterable) {
      this.#set = new Set<string>();
      return;
    }

    const strings = [...iterable].map((point) => JSON.stringify(point));
    this.#set = new Set<string>(strings);
  }

  get size() {
    return this.#set.size;
  }

  *[Symbol.iterator]() {
    for (const value of this.#set[Symbol.iterator]()) {
      yield JSON.parse(value) as TTuple;
    }
  }

  add(point: TTuple) {
    this.#set.add(JSON.stringify(point));
    return this;
  }

  clear() {
    this.#set.clear();
  }

  delete(point: TTuple) {
    return this.#set.delete(JSON.stringify(point));
  }

  *entries(): IterableIterator<[TTuple, TTuple]> {
    for (const [value1, value2] of this.#set.entries()) {
      yield [JSON.parse(value1), JSON.parse(value2)] as [
        point: TTuple,
        point: TTuple
      ];
    }
  }

  forEach(
    callbackfn: (
      point: TTuple,
      point2: TTuple,
      points: TupleSet<TTuple>
    ) => void,
    thisArg?: any
  ) {
    this.#set.forEach((value) => {
      const point = JSON.parse(value) as TTuple;
      callbackfn.call(thisArg, point, point, this);
    });
  }

  has(point: TTuple) {
    return this.#set.has(JSON.stringify(point));
  }

  *keys(): IterableIterator<TTuple> {
    for (const key of this.#set.keys()) {
      yield JSON.parse(key) as TTuple;
    }
  }

  *values(): IterableIterator<TTuple> {
    for (const value of this.#set.values()) {
      yield JSON.parse(value) as TTuple;
    }
  }
}

class Points extends TupleSet<Point> {}

type QueuedPoint = [point: Point, steps: number];

function fillGrid(start: Point, grid: Grid, steps: number) {
  // these three are the exact same concept I used in part one
  // a set for reachable plots
  // a set of all seen positions
  // and a queue of state which includes [ pos, remainingSteps ]
  const answers = new Points();
  const seen = new Points();
  const queue: QueuedPoint[] = [[start, steps]];

  while (queue.length) {
    const [point, steps] = queue.shift()!;

    if (steps % 2 === 0) answers.add(point);

    if (!steps) continue;

    for (const [r, c] of neighbors(point, grid)) {
      if (seen.has([r, c])) continue;

      seen.add([r, c]);
      queue.push([[r, c], steps - 1]);
    }
  }

  return answers.size;
}

export function countReachablePlots(
  [sr, sc]: Point,
  grid: Grid,
  steps: number
) {
  const gridSize = grid.length;

  const gridWidth = Math.floor(steps / gridSize) - 1;

  // for full squares which are completely traversable, the parity flips
  // on entry to every other cloned map, i.e. one map will have valid EVEN tiles
  // and the next map will have valid ODD tiles
  const noOfOddMaps = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
  const odds = fillGrid([sr, sc], grid, gridSize * 2 + 1) * noOfOddMaps;

  const noOfEvenMaps = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;
  const evens = fillGrid([sr, sc], grid, gridSize * 2) * noOfEvenMaps;

  const corners = sum([
    fillGrid([gridSize - 1, sc], grid, gridSize - 1), // Top
    fillGrid([sr, 0], grid, gridSize - 1), // Right
    fillGrid([0, sc], grid, gridSize - 1), // Bottom
    fillGrid([sr, gridSize - 1], grid, gridSize - 1), // Left
  ]);

  const smalls =
    sum([
      fillGrid([gridSize - 1, 0], grid, Math.floor(gridSize / 2) - 1), // Top-right
      fillGrid(
        [gridSize - 1, gridSize - 1],
        grid,
        Math.floor(gridSize / 2) - 1
      ), // Top-left
      fillGrid([0, 0], grid, Math.floor(gridSize / 2) - 1), // Bottom-right
      fillGrid([0, gridSize - 1], grid, Math.floor(gridSize / 2) - 1), // Bottom-left
    ]) *
    (gridWidth + 1);

  const larges =
    sum([
      fillGrid([gridSize - 1, 0], grid, Math.floor((gridSize * 3) / 2) - 1), // Top-right
      fillGrid(
        [gridSize - 1, gridSize - 1],
        grid,
        Math.floor((gridSize * 3) / 2) - 1
      ), // Top-left
      fillGrid([0, 0], grid, Math.floor((gridSize * 3) / 2) - 1), // Bottom-right
      fillGrid([0, gridSize - 1], grid, Math.floor((gridSize * 3) / 2) - 1), // Bottom-left
    ]) * gridWidth;

  return odds + evens + corners + smalls + larges;
}
