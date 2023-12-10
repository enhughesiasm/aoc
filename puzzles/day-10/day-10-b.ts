import { readData, surroundWithBorder } from '../../shared.ts';
import chalk from 'chalk';

const DIRECTIONS = ['N', 'S', 'E', 'W'] as const;
type Direction = (typeof DIRECTIONS)[number];

type Tile = {
  row: number;
  col: number;
  originalChar: string;
  isStart: boolean;
  connections: Direction[];
};

const PIPE = '%';
const NOT_PIPE = '.';

export async function day10b(dataPath?: string) {
  const data = await readData(dataPath);

  const lines = surroundWithBorder('*', data);

  const grid = lines.map((d, rowIndex) => parseLine(d, rowIndex));

  const start = setupStartPosition(grid);

  const doubleResolutionMap = generateDoubleResolutionMap(
    start,
    grid,
    NOT_PIPE
  );

  // flood fill from the top corner, replacing non-pipe character with spaces
  // (no matter the input, we know the top corner is empty because we surrounded it)
  const floodFilledMap = floodFill(doubleResolutionMap, [0, 0], NOT_PIPE, ' ');

  // dumpMap(floodFilledMap);

  return countEnclosedTiles(floodFilledMap, NOT_PIPE, 2);
}

function dumpMap(map: string[][]) {
  console.log(map.map((x) => x.join('')).join('\n'));
}

function countEnclosedTiles(
  map: string[][],
  matchingValue: string,
  mapResolution: number
): number {
  let count = 0;
  for (let y = 0; y < map.length; y += mapResolution) {
    for (let x = 0; x < map[0].length; x += mapResolution) {
      if (map[y][x] === matchingValue) {
        count++;
      }
    }
  }

  return count;
}

function floodFill(
  map: string[][],
  start: [number, number],
  targetChar: string,
  replacementChar: string
): string[][] {
  const floodFilledMap: string[][] = map.map((subarray) => [...subarray]);

  const cellQueue = [start];
  while (cellQueue.length > 0) {
    const [y, x] = cellQueue.pop();
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

function generateDoubleResolutionMap(
  start: [number, number],
  grid: Tile[][],
  BASE_CHARACTER: string
) {
  if (BASE_CHARACTER.length !== 1)
    throw new Error('Invalid base character: ' + BASE_CHARACTER);

  const doubleResolutionMap: string[][] = [];

  for (const row of grid) {
    doubleResolutionMap.push(Array.from(BASE_CHARACTER.repeat(row.length * 2)));
    doubleResolutionMap.push(Array.from(BASE_CHARACTER.repeat(row.length * 2)));
  }

  let currentPosition = start;
  let currentDirection = grid[start[0]][start[1]].connections[0];

  do {
    // set current position (at double resolution) to PIPE
    doubleResolutionMap[currentPosition[0] * 2][currentPosition[1] * 2] = PIPE;

    currentPosition = move(currentPosition, currentDirection);

    // need to double the length of the pipe in the direction we travelled
    setDoubleResolutionGapToPipe(
      currentDirection,
      currentPosition,
      doubleResolutionMap
    );

    currentDirection = chooseNextDirection(
      currentDirection,
      grid[currentPosition[0]][currentPosition[1]].connections
    );
  } while (!isPositionSame(currentPosition, start));

  return doubleResolutionMap;
}

function setDoubleResolutionGapToPipe(
  travelledFrom: Direction,
  toPosition: [number, number],
  map: string[][]
) {
  switch (travelledFrom) {
    case 'E':
      map[toPosition[0] * 2][toPosition[1] * 2 - 1] = PIPE;
      break;
    case 'W':
      map[toPosition[0] * 2][toPosition[1] * 2 + 1] = PIPE;
      break;
    case 'N':
      map[toPosition[0] * 2 + 1][toPosition[1] * 2] = PIPE;
      break;
    case 'S':
      map[toPosition[0] * 2 - 1][toPosition[1] * 2] = PIPE;
      break;
  }
}

function chooseNextDirection(
  cameFromDir: Direction,
  connections: Direction[]
): Direction {
  if (connections.length > 2) {
    throw new Error('Wrong assumption');
  }
  // if we came from East we don't want to now go West
  // so filter the opposite direction from the possible options
  const opposite = oppositeDir(cameFromDir);
  return connections[0] === opposite ? connections[1] : connections[0];
}

function oppositeDir(dir: Direction): Direction {
  switch (dir) {
    case 'E':
      return 'W';
    case 'N':
      return 'S';
    case 'W':
      return 'E';
    case 'S':
      return 'N';
  }
}

function isPositionSame(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function move(from: [number, number], towards: Direction): [number, number] {
  switch (towards) {
    case 'E':
      return [from[0], from[1] + 1];
    case 'N':
      return [from[0] - 1, from[1]];
    case 'S':
      return [from[0] + 1, from[1]];
    case 'W':
      return [from[0], from[1] - 1];
  }
}

function setupStartPosition(tileRows: Tile[][]): [number, number] {
  const row = tileRows.findIndex((r) => r.findIndex((c) => c.isStart) !== -1);

  const startPos: [number, number] = [
    row,
    tileRows[row].findIndex((c) => c.isStart),
  ];

  // we need to check which pipes actually connect to start - there could be dummy pipes as neighbours
  const connectingStartNeighbours = DIRECTIONS.filter((dir) =>
    doPipesConnect(startPos, dir, tileRows)
  );

  tileRows[startPos[0]][startPos[1]].connections = connectingStartNeighbours;

  return startPos;
}

function doPipesConnect(
  start: [number, number],
  dir: Direction,
  grid: Tile[][]
): boolean {
  const neighbour = move(start, dir as Direction);
  const possibleConnections = grid[neighbour[0]][neighbour[1]].connections;
  return isConnected(dir, possibleConnections as Direction[]);
}

function isConnected(
  moveDirection: Direction,
  destinationConnections: Direction[]
): boolean {
  if (moveDirection === 'E') return destinationConnections.includes('W');
  if (moveDirection === 'S') return destinationConnections.includes('N');
  if (moveDirection === 'W') return destinationConnections.includes('E');
  if (moveDirection === 'N') return destinationConnections.includes('S');
}

function parseLine(line: string, rowIndex: number): Tile[] {
  return Array.from(line).map((c, colIndex) =>
    parseTile(c, rowIndex, colIndex)
  );
}

function parseTile(char: string, rowIndex: number, colIndex: number): Tile {
  let connections: Direction[] = [];

  switch (char) {
    case '|':
      connections = ['N', 'S'];
      break;
    case '-':
      connections = ['E', 'W'];
      break;
    case 'L':
      connections = ['N', 'E'];
      break;
    case 'J':
      connections = ['N', 'W'];
      break;
    case '7':
      connections = ['S', 'W'];
      break;
    case 'F':
      connections = ['S', 'E'];
      break;
    case '.':
    case '*':
      connections = [];
      break;
    case 'S':
      connections = []; // we'll set this correctly later, after constructing the entire grid
      break;
    default:
      throw new Error('Unknown tile ' + char);
  }

  return {
    connections,
    row: rowIndex,
    col: colIndex,
    isStart: char === 'S',
    originalChar: char,
  };
}

const answer = await day10b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
