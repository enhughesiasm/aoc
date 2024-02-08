import { readData } from '../../../lib/shared.ts';

const KEYPAD = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
] as const;

type Direction = 'U' | 'D' | 'L' | 'R';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions: Direction[][] = data.map(
    (l) => l.split('') as Direction[]
  );

  const start: [number, number] = [1, 1];

  const numbers = findNumbers(instructions, start);

  return numbers.join('');
}

function findNumbers(instructions: Direction[][], start: [number, number]) {
  const numbers: number[] = [];

  let currentPos: [number, number] = start;

  for (const row of instructions) {
    currentPos = getNextButton(currentPos, row);
    numbers.push(KEYPAD[currentPos[0]][currentPos[1]]);
  }

  return numbers;
}

function getNextButton(
  currentPos: [number, number],
  instructions: Direction[]
): [number, number] {
  for (const inst of instructions) {
    currentPos = move(currentPos, inst);
    // console.log(
    //   `${inst} -> ${currentPos} (${KEYPAD[currentPos[0]][currentPos[1]]})`
    // );
  }

  return currentPos;
}

function move(
  currentPos: [number, number],
  instruction: Direction
): [number, number] {
  switch (instruction) {
    case 'D':
      return clamp([currentPos[0] + 1, currentPos[1]]);
    case 'L':
      return clamp([currentPos[0], currentPos[1] - 1]);
    case 'R':
      return clamp([currentPos[0], currentPos[1] + 1]);
    case 'U':
      return clamp([currentPos[0] - 1, currentPos[1]]);
  }
}

function clamp(pos: [number, number]): [number, number] {
  return [
    Math.min(Math.max(0, pos[0]), KEYPAD.length - 1),
    Math.min(Math.max(0, pos[1]), KEYPAD[0].length - 1),
  ];
}
