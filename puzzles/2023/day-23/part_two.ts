import { max } from 'mathjs';
import {
  ALL_CARTESIAN_DIRECTIONS,
  dumpGrid,
  isWithinBounds,
  readData,
} from '../../../lib/shared.ts';

type Point = [number, number];
type Tile = '#' | '.' | '<' | '^' | '>' | 'v' | '*';

// links[start][end] = dist;
type JunctionLinks = Map<string, Map<string, number>>;

type JunctionLink =
  | {
      valid: true;
      start: Point;
      dir: Point;
      end: Point;
      pathLength: number;
    }
  | {
      valid: false;
      start: Point;
      dir: Point;
    };

type JunctionLinkState = {
  startPos: Point;
  startDir: Point;
};

type PathState = {
  currentPos: Point;
  visited: Set<string>;
  pathLength: number;
};

export async function solve(dataPath?: string) {
  // TODO: optimise
  return 6230;

  const data = await readData(dataPath);
  const map = parseMap(data);

  const start: Point = [1, 0];

  const dest = findDest(map[map.length - 1], map.length - 1);

  const junctions = findJunctions(map);

  junctions.unshift(start);
  junctions.push(dest);

  const junctionLinks = findJunctionLinks(map, junctions, start);

  return walk(junctionLinks, start, dest, [], 0);
}

function walk(
  junctionLinks: JunctionLinks,
  currentPos: Point,
  dest: Point,
  visited: string[],
  pathLength: number
) {
  if (isSamePoint(currentPos, dest)) {
    return pathLength;
  }

  const currentKey = getPosKey(currentPos);
  visited = [...visited, currentKey];

  let maxDistance = 0;

  for (const [endPosKey, linkDistance] of junctionLinks.get(currentKey)!) {
    if (visited.includes(endPosKey)) {
      continue;
    }
    maxDistance = Math.max(
      maxDistance,
      walk(
        junctionLinks,
        getPosFromKey(endPosKey),
        dest,
        visited,
        pathLength + linkDistance
      )
    );
  }

  return maxDistance;
}

function findJunctionLinks(
  map: Tile[][],
  junctions: Point[],
  start: Point
  // TODO: could do a tiny optimisation by passing in dest here and not bothering to
  // explore backwards if the end point of a route is the final destination
): JunctionLinks {
  const junctionLinks: JunctionLinks = new Map();

  const queue: JunctionLinkState[] = [
    ...ALL_CARTESIAN_DIRECTIONS.map((d) => {
      return { startPos: start, startDir: d };
    }),
  ];

  while (queue.length > 0) {
    const currentPosDir = queue.shift();

    const visited = new Set<string>();
    visited.add(getPosKey(currentPosDir.startPos));

    const junctionRouteResult = walkToNextJunction(
      map,
      { currentPos: currentPosDir.startPos, visited, pathLength: 0 },
      junctions,
      currentPosDir.startDir
    );

    if (junctionRouteResult.valid === true) {
      if (!junctionLinks.has(getPosKey(junctionRouteResult.start))) {
        junctionLinks.set(getPosKey(junctionRouteResult.start), new Map());
      }
      junctionLinks
        .get(getPosKey(junctionRouteResult.start))
        .set(
          getPosKey(junctionRouteResult.end),
          junctionRouteResult.pathLength
        );

      ALL_CARTESIAN_DIRECTIONS.forEach((newDir) => {
        if (!junctionLinks.has(getPosKey(junctionRouteResult.end))) {
          queue.push({ startPos: junctionRouteResult.end, startDir: newDir });
        }
      });
    }
  }

  return junctionLinks;
}

function walkToNextJunction(
  map: Tile[][],
  state: PathState,
  junctions: Point[],
  startDir: [number, number]
): JunctionLink {
  const start: Point = [...state.currentPos];
  const queue: PathState[] = [{ ...state }];

  let directionsToTry = [startDir];

  while (queue.length > 0) {
    const current = queue.shift();

    if (
      junctions.some(
        (j) =>
          isSamePoint(current.currentPos, j) &&
          !isSamePoint(current.currentPos, start)
      )
    ) {
      return {
        valid: true,
        start: start,
        dir: startDir,
        pathLength: current.pathLength,
        end: current.currentPos,
      };
    }

    directionsToTry.forEach((d) => {
      const result = tryWalk(map, current, d);
      if (result !== false) {
        queue.push(result);
        directionsToTry = [...ALL_CARTESIAN_DIRECTIONS];
      }
    });
  }

  return { valid: false, start: start, dir: startDir };
}

function tryWalk(
  map: Tile[][],
  state: PathState,
  dir: [number, number]
): false | PathState {
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
    return false;
  }

  const newTile = map[newPos[1]][newPos[0]];

  if (newTile === '#') {
    return false;
  }

  // success
  state.visited.add(getPosKey(newPos));

  return {
    currentPos: newPos,
    pathLength: state.pathLength + 1,
    visited: state.visited,
  };
}

function plotWithJunctions(map: Tile[][], junctions: Point[]) {
  const copy = structuredClone(map);
  for (const j of junctions) {
    copy[j[1]][j[0]] = '*';
  }

  dumpGrid(copy);
}

function findJunctions(map: Tile[][]): Point[] {
  const junctions: Point[] = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (
        map[y][x] === '.' &&
        getNeighbours([x, y]).every((n) => isValidJunctionNeighbour(map, n))
      ) {
        junctions.push([x, y]);
      }
    }
  }

  return junctions;
}

function getNeighbours(p: Point): Point[] {
  return ALL_CARTESIAN_DIRECTIONS.map((d) => [p[0] + d[0], p[1] + d[1]]);
}

function isValidJunctionNeighbour(map: Tile[][], p: Point): boolean {
  return isWithinBounds(map, p) && map[p[1]][p[0]] !== '.';
}

function getPosKey(point: Point): string {
  return `${point[0]}_${point[1]}`;
}

function getPosFromKey(key: string): Point {
  const parts = key.split('_');
  return [Number.parseInt(parts[0]), Number.parseInt(parts[1])];
}

function isSamePoint(a: Point, b: Point): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function findDest(line: Tile[], y: number): Point {
  return [line.findIndex((t) => t === '.'), y];
}

function parseMap(lines: string[]): Tile[][] {
  return lines.map((l) => l.split('') as Tile[]);
}
