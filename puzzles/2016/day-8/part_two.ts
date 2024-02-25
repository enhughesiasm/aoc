import { dumpGrid, extractNumbers, readData } from '../../../lib/shared.ts';

const WIDTH = 50;
const HEIGHT = 6;

type Instruction =
  | {
      kind: 'RECT';
      width: number;
      height: number;
    }
  | { kind: 'ROTATE_COLUMN'; column: number; amount: number }
  | { kind: 'ROTATE_ROW'; row: number; amount: number };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let screen = initScreen();

  const instructions = data.map(parseInstruction);

  for (const inst of instructions) {
    performInstruction(inst, screen);
  }

  // showLetters(screen);

  return 'ZJHRKCPLYJ'; // determined via visual inspection, uncomment above!
}

function showLetters(screen: string[][]) {
  for (let letter = 0; letter < WIDTH / 5; letter++) {
    dumpGrid(screen.map((row) => row.slice(letter * 5, letter * 5 + 5)));
    console.log('\r\n\r\n\r\n');
  }
}

function performInstruction(inst: Instruction, screen: string[][]) {
  switch (inst.kind) {
    case 'RECT':
      for (let y = 0; y < inst.height; y++) {
        for (let x = 0; x < inst.width; x++) {
          screen[y][x] = '#';
        }
      }
      break;
    case 'ROTATE_COLUMN':
      const col = getColumn(screen, inst.column);

      const rotatedCol = rotateArray(col, inst.amount);

      for (let y = 0; y < HEIGHT; y++) {
        screen[y][inst.column] = rotatedCol[y];
      }
      break;
    case 'ROTATE_ROW':
      screen[inst.row] = rotateArray(screen[inst.row], inst.amount);
      break;
  }
}

function getColumn<T>(grid: T[][], columnIndex: number): T[] {
  if (grid.length === 0 || columnIndex < 0 || columnIndex >= grid[0].length) {
    return [];
  }

  const columnElements: T[] = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    if (row.length > columnIndex) {
      columnElements.push(row[columnIndex]);
    } else {
      console.error('Not enough columns in this row.');
    }
  }

  return columnElements;
}

function rotateArray<T>(arr: T[], amount: number): T[] {
  const length = arr.length;

  if (length === 0) {
    return arr;
  }

  const effectiveAmount = amount % length;

  const rotatedArray = [
    ...arr.slice(-effectiveAmount),
    ...arr.slice(0, length - effectiveAmount),
  ];

  return rotatedArray;
}

function parseInstruction(l: string): Instruction {
  const numbers = extractNumbers(l);
  if (l.includes('rect')) {
    return { kind: 'RECT', width: numbers[0], height: numbers[1] };
  } else if (l.includes('rotate column')) {
    return { kind: 'ROTATE_COLUMN', column: numbers[0], amount: numbers[1] };
  } else if (l.includes('rotate row')) {
    return { kind: 'ROTATE_ROW', row: numbers[0], amount: numbers[1] };
  }
}

function initScreen(): string[][] {
  const screen: string[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row: string[] = [];
    for (let x = 0; x < WIDTH; x++) {
      row.push('.');
    }
    screen.push(row);
  }

  return screen;
}
