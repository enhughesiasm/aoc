type Direction = 'U' | 'R' | 'D' | 'L';
type Compass = 'N' | 'E' | 'S' | 'W';

export class Grid<T> {
  grid: T[][];

  height: number;
  width: number;

  constructor(input: T[][]) {
    this.grid = input;
    this.height = this.grid.length;
    this.width = this.grid[0].length;
  }
}

export const ALL_CARTESIAN_DIRECTIONS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

export function surroundWithBorder(char: string, lines: string[]): string[] {
  const length = lines[0].length + 2;

  const newLine = char.repeat(length);
  return [newLine, ...lines.map((l) => `${char}${l}${char}`), newLine];
}

export function isWithinBounds<T>(grid: T[][], pos: [number, number]): boolean {
  const { maxX, maxY } = getGridMax(grid);
  return 0 <= pos[1] && pos[1] <= maxY && 0 <= pos[0] && pos[0] <= maxX;
}

export function getGridMax<T>(grid: T[][]) {
  const [maxY, maxX] = [grid.length - 1, grid[0].length - 1];

  return { maxX, maxY };
}

export function dumpGrid(
  grid: string[][],
  displayFunc: (gridEntry: string) => string = (s) => s
) {
  grid.map((row) => console.log(`\n${row.map(displayFunc).join('')}`));
}

export function floodFill<TTarget>(
  map: string[][],
  start: [number, number],
  targetChar: TTarget,
  replacementChar: string
): string[][] {
  const floodFilledMap: string[][] = map.map((subarray) => [...subarray]);

  const cellQueue = [start];
  while (cellQueue.length > 0) {
    const [y, x] = cellQueue.pop();

    if (floodFilledMap[y][x] !== targetChar) continue;

    floodFilledMap[y][x] = replacementChar;

    if (y > 0 && floodFilledMap[y - 1][x] === targetChar)
      cellQueue.push([y - 1, x]);
    if (x > 0 && floodFilledMap[y][x - 1] === targetChar)
      cellQueue.push([y, x - 1]);
    if (
      y < floodFilledMap.length - 1 &&
      floodFilledMap[y + 1][x] === targetChar
    )
      cellQueue.push([y + 1, x]);
    if (
      x < floodFilledMap[0].length - 1 &&
      floodFilledMap[y][x + 1] === targetChar
    )
      cellQueue.push([y, x + 1]);
  }

  return floodFilledMap;
}

export function manhattan(a: [number, number], b: [number, number]): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function getColumn<T>(grid: T[][], columnIndex: number): T[] {
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

/**
 * Rotates an array around, wrapping the end back to the beginning
 * e.g. rotate [1,2,3,4,5] by 2 -> [4,5,1,2,3]
 */
export function rotateArray<T>(arr: T[], amount: number): T[] {
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
