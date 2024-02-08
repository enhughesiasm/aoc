import { readData } from '../../../lib/shared.ts';

const KEYPAD = [
  ['X', 'X', 1, 'X', 'X'],
  ['X', 2, 3, 4, 'X'],
  [5, 6, 7, 8, 9],
  ['X', 'A', 'B', 'C', 'X'],
  ['X', 'X', 'D', 'X', 'X'],
] as const;

type Direction = 'U' | 'D' | 'L' | 'R';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions: Direction[][] = data.map(
    (l) => l.split('') as Direction[]
  );

  const start: [number, number] = [2, 0];

  const numbers = findCodes(instructions, start);

  return numbers.join('');
}

function findCodes(instructions: Direction[][], start: [number, number]) {
  const codes: (string | number)[] = [];

  let currentPos: [number, number] = start;

  for (const row of instructions) {
    currentPos = getNextButton(currentPos, row);
    codes.push(KEYPAD[currentPos[0]][currentPos[1]]);
  }

  return codes;
}

function getNextButton(
  currentPos: [number, number],
  instructions: Direction[]
): [number, number] {
  for (const inst of instructions) {
    currentPos = tryMove(currentPos, inst);
    // console.log(
    //   `${inst} -> ${currentPos} (${KEYPAD[currentPos[0]][currentPos[1]]})`
    // );
  }

  return currentPos;
}

function tryMove(
  currentPos: [number, number],
  instruction: Direction
): [number, number] {
  let possiblePos: [number, number];

  switch (instruction) {
    case 'D':
      possiblePos = clamp([currentPos[0] + 1, currentPos[1]]);
      break;
    case 'L':
      possiblePos = clamp([currentPos[0], currentPos[1] - 1]);
      break;
    case 'R':
      possiblePos = clamp([currentPos[0], currentPos[1] + 1]);
      break;
    case 'U':
      possiblePos = clamp([currentPos[0] - 1, currentPos[1]]);
      break;
  }

  if (KEYPAD[possiblePos[0]][possiblePos[1]] !== 'X') return possiblePos;

  return currentPos;
}

function clamp(pos: [number, number]): [number, number] {
  return [
    Math.min(Math.max(0, pos[0]), KEYPAD.length - 1),
    Math.min(Math.max(0, pos[1]), KEYPAD[0].length - 1),
  ];
}
