import {
  extractNumbers,
  manhattan,
  nonNumericOnly,
  numericOnly,
  readData,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const blockVisitedTwice = findFirstBlockVisitedTwice(data[0]);

  return manhattan([0, 0], blockVisitedTwice);
}

function key(n: [number, number]): string {
  return JSON.stringify(n);
}

function findFirstBlockVisitedTwice(line: string): [number, number] {
  const moves = line.split(',').map((l) => l.trim());

  let facing: CompassPoint = 'N';
  let currentPos: [number, number] = [0, 0];

  const visited = new Set<string>();

  for (const move of moves) {
    // console.log(`Start ${currentPos} - Facing ${facing} - Then ${move}`);
    const next = followInstruction(move, facing, currentPos);

    const visitedKeys = next.allVisited.map((p) => key(p));

    if (visitedKeys.some((key) => visited.has(key))) {
      return JSON.parse(visitedKeys.find((k) => visited.has(k)));
    }

    visitedKeys.forEach((key) => {
      visited.add(key);
    });

    currentPos = next.end;
    facing = next.facing;
  }

  throw new Error('No block visited twice');
}

type CompassPoint = 'N' | 'S' | 'E' | 'W';
type Direction = 'L' | 'R';

function rotate(facing: CompassPoint, dir: Direction): CompassPoint {
  switch (dir) {
    case 'L':
      if (facing === 'N') return 'W';
      if (facing === 'E') return 'N';
      if (facing === 'S') return 'E';
      return 'S';
    case 'R':
      if (facing === 'N') return 'E';
      if (facing === 'E') return 'S';
      if (facing === 'S') return 'W';
      return 'N';
  }
}

function followInstruction(
  inst: string,
  facing: 'N' | 'S' | 'E' | 'W',
  start: [number, number]
): {
  facing: 'N' | 'S' | 'E' | 'W';
  end: [number, number];
  allVisited: [number, number][];
} {
  const instDir = nonNumericOnly(inst) as Direction;
  const instDistance = extractNumbers(inst)[0];

  const dirToTravel = rotate(facing, instDir);

  switch (dirToTravel) {
    case 'E':
      return {
        end: [start[0] + instDistance, start[1]],
        facing: dirToTravel,
        allVisited: getAllVisited(
          start,
          [start[0] + instDistance, start[1]],
          dirToTravel
        ),
      };
    case 'W':
      return {
        end: [start[0] - instDistance, start[1]],
        facing: dirToTravel,
        allVisited: getAllVisited(
          start,
          [start[0] - instDistance, start[1]],
          dirToTravel
        ),
      };
    case 'N':
      return {
        end: [start[0], start[1] + instDistance],
        facing: dirToTravel,
        allVisited: getAllVisited(
          start,
          [start[0], start[1] + instDistance],
          dirToTravel
        ),
      };
    case 'S':
      return {
        end: [start[0], start[1] - instDistance],
        facing: dirToTravel,
        allVisited: getAllVisited(
          start,
          [start[0], start[1] - instDistance],
          dirToTravel
        ),
      };
  }
}

function getAllVisited(
  start: [number, number],
  end: [number, number],
  axis: CompassPoint
): [number, number][] {
  const visited: [number, number][] = [];

  switch (axis) {
    case 'N':
      for (let i = start[1] + 1; i <= end[1]; i++) {
        visited.push([start[0], i]);
      }
      break;
    case 'S':
      for (let i = start[1] - 1; i >= end[1]; i--) {
        visited.push([start[0], i]);
      }
      break;
    case 'E':
      for (let i = start[0] + 1; i <= end[0]; i++) {
        visited.push([i, start[1]]);
      }
      break;
    case 'W':
      for (let i = start[0] - 1; i >= end[0]; i--) {
        visited.push([i, start[1]]);
      }
      break;
  }

  return visited;
}
