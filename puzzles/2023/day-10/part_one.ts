import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

/*

  This solution was pretty hacky and messy, it ended up evolving a great deal for Part B
  So ignore this one and skip to part B unless the pipe-length counting is particularly important

*/

type TileConnection = 'None' | 'North' | 'South' | 'East' | 'West' | 'Any';

type Tile = {
  row: number;
  col: number;
  hasAnimal: boolean;
  connections: TileConnection[];
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const lines = wrapDataWith('.', data);

  const tileRows = lines.map((d, rowIndex) => parsePipeLine(d, rowIndex));

  const start = getStartPositionAndUpdateConnections(tileRows);

  const loopPositions = generateLoopFrom(start, tileRows);

  return loopPositions.oneDirPositions.length;
}

function wrapDataWith(char: string, lines: string[]): string[] {
  const length = lines[0].length + 2;

  const newLine = char.repeat(length);
  return [newLine, ...lines.map((l) => `${char}${l}${char}`), newLine];
}

type Direction = 'North' | 'South' | 'East' | 'West';

function generateLoopFrom(start: [number, number], grid: Tile[][]) {
  const oneDirPositions: [number, number][] = [];
  const otherDirPositions: [number, number][] = [];

  let onePos = start;
  let otherPos = start;

  let oneDir = grid[start[0]][start[1]].connections[0];
  let otherDir = grid[start[0]][start[1]].connections[1];
  let steps = 0;

  while (isPosSame(onePos, start) || !isPosSame(onePos, otherPos)) {
    // console.log(onePos);
    // console.log(otherPos);

    oneDirPositions.push(onePos);
    otherDirPositions.push(otherPos);

    // console.log(`Moving one from ${onePos} ${oneDir}`);
    onePos = getNextPos(onePos, oneDir as Direction);
    // console.log(`Moving other from ${otherPos} ${otherDir}`);
    otherPos = getNextPos(otherPos, otherDir as Direction);

    // console.log(`Getting next dir at ${onePos} while facing ${oneDir}`);
    oneDir = getNextDir(
      oneDir as Direction,
      grid[onePos[0]][onePos[1]].connections
    );
    otherDir = getNextDir(
      otherDir as Direction,
      grid[otherPos[0]][otherPos[1]].connections
    );
    steps++;
  }

  //console.log(steps);

  return { oneDirPositions, otherDirPositions };
}

function getNextDir(
  cameFromDir: Direction,
  connections: TileConnection[]
): Direction {
  if (connections.length > 2) {
    //console.log(cameFromDir);
    //console.log(connections);
    throw new Error('Wrong assumption');
  }

  let filter: Direction = 'North';

  switch (cameFromDir) {
    case 'East':
      filter = 'West';
      break;
    case 'North':
      filter = 'South';
      break;
    case 'West':
      filter = 'East';
      break;
    case 'South':
      filter = 'North';
      break;
  }

  let ret: Direction = 'North';
  if (connections[0] === filter) ret = connections[1] as Direction;
  else ret = connections[0] as Direction;

  // console.log(`Filtering ${filter} from ${connections} and going ${ret}`);

  return ret;
}

function isPosSame(a: [number, number], b: [number, number]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

function getNextPos(start: [number, number], dir: Direction): [number, number] {
  switch (dir) {
    case 'East':
      return [start[0], start[1] + 1];
    case 'North':
      return [start[0] - 1, start[1]];
    case 'South':
      return [start[0] + 1, start[1]];
    case 'West':
      return [start[0], start[1] - 1];
  }
}

function getStartPositionAndUpdateConnections(
  tileRows: Tile[][]
): [number, number] {
  const row = tileRows.findIndex((r) => r.findIndex((c) => c.hasAnimal) !== -1);

  const startPos: [number, number] = [
    row,
    tileRows[row].findIndex((c) => c.hasAnimal),
  ];

  // need to find our first neighbours, there should be exactly two
  const validFirstNeighbours = ['North', 'South', 'East', 'West'];

  const actualPipeNeighbours = validFirstNeighbours.filter((dir) => {
    const next = getNextPos(startPos, dir as Direction);
    return tileRows[next[0]][next[1]].connections.length > 0;
  });

  tileRows[startPos[0]][startPos[1]].connections = ['South', 'East'];
  // actualPipeNeighbours as TileConnection[];

  //console.log(actualPipeNeighbours);

  return startPos;
}

function parsePipeLine(line: string, rowIndex: number): Tile[] {
  return Array.from(line).map((c, colIndex) =>
    parseTile(c, rowIndex, colIndex)
  );
}

function parseTile(char: string, rowIndex: number, colIndex: number): Tile {
  let connections: TileConnection[] = [];

  switch (char) {
    case '|':
      connections = ['North', 'South'];
      break;
    case '-':
      connections = ['East', 'West'];
      break;
    case 'L':
      connections = ['North', 'East'];
      break;
    case 'J':
      connections = ['North', 'West'];
      break;
    case '7':
      connections = ['South', 'West'];
      break;
    case 'F':
      connections = ['South', 'East'];
      break;
    case '.':
      connections = [];
      break;
    case 'S':
      connections = ['Any'];
      break;
    default:
      throw new Error('Unknown tile ' + char);
  }

  return { connections, row: rowIndex, col: colIndex, hasAnimal: char === 'S' };
}
