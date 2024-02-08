import {
  extractNumbers,
  manhattan,
  nonNumericOnly,
  numericOnly,
  readData,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const blocks = data.map((l) => calculateDistanceForInstructions(l));

  return blocks[0];
}

function calculateDistanceForInstructions(line: string): number {
  const moves = line.split(',').map((l) => l.trim());

  let facing: CompassPoint = 'N';
  let currentPos: [number, number] = [0, 0];

  for (const move of moves) {
    const next = followInstruction(move, facing, currentPos);
    currentPos = next.end;
    facing = next.facing;
  }

  return manhattan([0, 0], currentPos);
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
): { facing: 'N' | 'S' | 'E' | 'W'; end: [number, number] } {
  const instDir = nonNumericOnly(inst) as Direction;
  const instDistance = extractNumbers(inst)[0];

  const dirToTravel = rotate(facing, instDir);

  switch (dirToTravel) {
    case 'E':
      return { end: [start[0] + instDistance, start[1]], facing: dirToTravel };
    case 'W':
      return { end: [start[0] - instDistance, start[1]], facing: dirToTravel };
    case 'N':
      return { end: [start[0], start[1] + instDistance], facing: dirToTravel };
    case 'S':
      return { end: [start[0], start[1] - instDistance], facing: dirToTravel };
  }
}
