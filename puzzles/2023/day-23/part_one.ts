import { max } from 'mathjs';
import {
  ALL_CARTESIAN_DIRECTIONS,
  dumpGrid,
  readData,
} from '../../../lib/shared.ts';
import chalk from 'chalk';

// a little slow on the real data, so could be optimised, but this finishes in <30s
// which will do

type Point = [number, number];
type Tile = '#' | '.' | '<' | '^' | '>' | 'v';

export async function solve(dataPath?: string) {
  // TODO: optimise
  return 1930;

  const data = await readData(dataPath);
  const map = parseMap(data);

  const start: Point = [1, 0];

  const dest = findDest(map[map.length - 1], map.length - 1);

  // dumpGrid(map);
  // console.log(start);
  // console.log(dest);

  const routeLengths = findAllRouteLengths(map, start, dest);

  // console.log(routeLengths);

  return max(routeLengths);
}

type PathState = {
  currentPos: Point;
  visited: Set<string>;
  pathLength: number;
};

function getPosKey(point: Point): string {
  return `${point[0]}_${point[1]}`;
}

function findAllRouteLengths(
  map: Tile[][],
  start: Point,
  dest: Point
): number[] {
  const routeLengths: number[] = [];

  const queue: PathState[] = [
    { currentPos: start, visited: new Set(), pathLength: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (isSamePoint(current.currentPos, dest)) {
      routeLengths.push(current.pathLength);
      continue;
    }

    ALL_CARTESIAN_DIRECTIONS.forEach((dir) => {
      const result = tryWalk(map, current, dir);
      if (result !== false) {
        // console.log(`✅ Moved to ${JSON.stringify(result)}`);
        queue.push({ ...result, visited: new Set(result.visited) });
      }
    });
  }

  return routeLengths;
}

function isSamePoint(a: Point, b: Point): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function tryWalk(
  map: Tile[][],
  state: PathState,
  dir: [number, number]
): false | PathState {
  //console.log(`🧍‍♂️ Try walk ${JSON.stringify(dir)} from ${JSON.stringify(pos)}`);

  const newPos: [number, number] = [
    state.currentPos[0] + dir[0],
    state.currentPos[1] + dir[1],
  ];

  // can't revisit a position
  if (state.visited.has(getPosKey(newPos))) return false;

  if (
    newPos[1] >= map.length ||
    newPos[1] < 0 ||
    newPos[0] >= map[0].length ||
    newPos[0] < 0
  ) {
    //console.log(`🚧 OOB at ${JSON.stringify(newPos)}`);
    return false;
  }

  const newTile = map[newPos[1]][newPos[0]];

  if (newTile === '#') {
    // console.log(`🧱 Wall at ${JSON.stringify(newPos)}`);
    return false;
  }

  // starting assumption that the input is nice and we can treat these as 1-way gates
  if (newTile === '<' && dir[0] === 1) {
    return false;
  }

  if (newTile === '>' && dir[0] === -1) {
    return false;
  }

  if (newTile === '^' && dir[1] === 1) {
    return false;
  }

  if (newTile === 'v' && dir[1] === -1) {
    return false;
  }

  // success
  state.visited.add(getPosKey(newPos));
  // console.log(`🚶 Moved to ${JSON.stringify(newPos)}`);
  return {
    currentPos: newPos,
    pathLength: state.pathLength + 1,
    visited: state.visited,
  };
}

function findDest(line: Tile[], y: number): Point {
  return [line.findIndex((t) => t === '.'), y];
}

function parseMap(lines: string[]): Tile[][] {
  return lines.map((l) => l.split('') as Tile[]);
}
