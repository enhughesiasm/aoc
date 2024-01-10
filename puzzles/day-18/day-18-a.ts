import { floodFill, isWithinBounds, readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day18a(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = data.map((r) => parseSimpleInstruction(r));
  return computeArea(instructions);
}

/**
 * This approach worked great for the sample input but was WAY too slow / memory-intensive for the real data.
 * Leaving it here because I made a (pointless!) fun coloured visualisation and enjoyed writing it.
 * Might be some useful stuff to salvage here for future.
 * @param input
 * @returns
 */
function initialApproach(input: string[]) {
  const instructions = input.map((l) => parseInstruction(l));

  const startPos: Pos = [0, 0];

  const { grid, gridSize } = digTrench(instructions, startPos);

  drawTrenchGrid(grid, gridSize);

  const floodFilledGrid = floodFill(grid, [1, 1], undefined, '#');

  drawTrenchGrid(floodFilledGrid, gridSize);

  return computeTrenchSize(floodFilledGrid, gridSize);
}

const parseSimpleInstruction = (l: string): SimpleInstruction => {
  const parts = l.split(' ');
  return [parts[0] as Direction, +parts[1]];
};

/**
 * After getting stuck with finding a smart way to do this, I've found
 * that it's fast to combine the shoelace algorithm together with Pick's theorem
 * https://11011110.github.io/blog/2021/04/17/picks-shoelaces.html
 * https://arachnoid.com/area_irregular_polygon/index.html
 * @param instructions
 * @returns
 */
const computeArea = (instructions: SimpleInstruction[]) => {
  let [sum, perimeter, y] = [0, 0, 0];
  for (const inst of instructions) {
    const [dir, trenchLength] = inst;
    perimeter += trenchLength;
    switch (dir) {
      case 'U':
        y = y - trenchLength;
        break;
      case 'D':
        y = y + trenchLength;
        break;
      case 'L':
        sum = sum + y * trenchLength;
        break;
      case 'R':
        sum = sum - y * trenchLength;
        break;
    }
  }

  const shoelaceArea = Math.abs(sum);
  const picksTheorem = perimeter / 2 + 1;
  return shoelaceArea + picksTheorem;
};

function computeTrenchSize(grid: string[][], gridSize: Pos): number {
  let count = 0;
  for (let y = 0; y < gridSize[1]; y++) {
    for (let x = 0; x < gridSize[0]; x++) {
      if (grid[y][x] !== undefined) count++;
    }
  }
  return count;
}

type Pos = [number, number];
type Direction = 'U' | 'L' | 'R' | 'D';

type Instruction = {
  dir: Direction;
  length: number;
  hexCode: string;
};

type SimpleInstruction = [Direction, number];

function digTrench(instructions: Instruction[], startPos: Pos) {
  const grid: string[][] = [[undefined]];
  const gridSize: Pos = [1, 1];

  let currentPos: Pos = [...startPos];
  let instCount = 1;
  for (const inst of instructions) {
    digInstruction(grid, inst, currentPos, gridSize);
    instCount++;
  }

  return { grid, gridSize };
}

function drawTrenchGrid(grid: string[][], gridSize: Pos) {
  console.log(' \n');
  for (let y = 0; y < gridSize[1]; y++) {
    for (let x = 0; x < gridSize[0]; x++) {
      if (grid[y][x] !== undefined) {
        process.stdout.write(chalk.hex(grid[y][x])('#'));
      } else {
        process.stdout.write('.');
      }
    }
    console.log(' \n');
  }
  console.log(' \n');
}

function digInstruction(
  grid: string[][],
  inst: Instruction,
  currentPos: Pos,
  gridSize: Pos
) {
  switch (inst.dir) {
    case 'U':
      digUp(grid, inst, currentPos, gridSize);
      break;
    case 'D':
      digDown(grid, inst, currentPos, gridSize);
      break;
    case 'L':
      digLeft(grid, inst, currentPos, gridSize);
      break;
    case 'R':
      digRight(grid, inst, currentPos, gridSize);
      break;
  }
}

function digUp(
  grid: string[][],
  inst: Instruction,
  currentPos: Pos,
  gridSize: Pos
) {
  const newPos: Pos = [currentPos[0], currentPos[1] - inst.length];

  if (!isWithinBounds(grid, newPos)) {
    // need to add enough rows at the beginning
    const newRowsNeeded = Math.abs(currentPos[1] - inst.length);
    for (let i = 0; i < newRowsNeeded; i++) {
      grid.unshift([]);
    }

    // adding rows BEFORE our current pos so need to transform to be accurate
    transformPos(currentPos, 'D', newRowsNeeded);
    gridSize[1] += newRowsNeeded;
  }

  for (let i = 0; i < inst.length; i++) {
    currentPos[1] -= 1;
    grid[currentPos[1]][currentPos[0]] = inst.hexCode;
  }
}

function digLeft(
  grid: string[][],
  inst: Instruction,
  currentPos: Pos,
  gridSize: Pos
) {
  const newPos: Pos = [currentPos[0] - inst.length, currentPos[1]];

  if (!isWithinBounds(grid, newPos)) {
    // need to add enough rows at the beginning of EVERY column
    const newRowsNeeded = Math.abs(currentPos[0] - inst.length);

    for (let i = 0; i < newRowsNeeded; i++) {
      grid.forEach((row) => row.unshift(undefined));
    }
    // adding rows BEFORE our current pos so need to transform to be accurate
    transformPos(currentPos, 'R', newRowsNeeded);
    gridSize[0] += newRowsNeeded;
  }

  for (let i = 0; i < inst.length; i++) {
    currentPos[0] -= 1;
    grid[currentPos[1]][currentPos[0]] = inst.hexCode;
  }
}

function digRight(
  grid: string[][],
  inst: Instruction,
  currentPos: Pos,
  gridSize: Pos
) {
  const newPos: Pos = [currentPos[0] + inst.length, currentPos[1]];

  if (!isWithinBounds(grid, newPos)) {
    // need to add enough rows at the end of EVERY column
    const newRowsNeeded = Math.abs(newPos[0] - gridSize[0]) + 1;
    for (let i = 0; i < newRowsNeeded; i++) {
      grid.forEach((row) => row.push(undefined));
    }
    // adding rows AFTER our current pos so no transformation needed
    // transformPos(currentPos, 'R', newRowsNeeded);
    gridSize[0] += newRowsNeeded;
  }

  for (let i = 0; i < inst.length; i++) {
    currentPos[0] += 1;
    grid[currentPos[1]][currentPos[0]] = inst.hexCode;
  }
}

function digDown(
  grid: string[][],
  inst: Instruction,
  currentPos: Pos,
  gridSize: Pos
) {
  const newPos: Pos = [currentPos[0], currentPos[1] + inst.length];

  if (!isWithinBounds(grid, newPos)) {
    // need to add enough rows at the end of EVERY row
    const newRowsNeeded = Math.abs(newPos[1] - gridSize[1]) + 1;

    for (let i = 0; i < newRowsNeeded; i++) {
      grid.push([]);
    }

    // adding rows AFTER our current pos so no transformation needed
    // transformPos(currentPos, 'D', newRowsNeeded);
    gridSize[1] += newRowsNeeded;
  }

  for (let i = 0; i < inst.length; i++) {
    currentPos[1] += 1;
    grid[currentPos[1]][currentPos[0]] = inst.hexCode;
  }
}

function transformPos(pos: Pos, dir: Direction, amount: number): void {
  switch (dir) {
    case 'U':
      pos[1] -= amount;
    case 'D':
      pos[1] += amount;
    case 'L':
      pos[0] -= amount;
    case 'R':
      pos[0] += amount;
  }
}

function parseInstruction(l: string): Instruction {
  const parts = l.split(' ');

  return {
    dir: parts[0] as Direction,
    length: Number.parseInt(parts[1]),
    hexCode: parts[2].replace('(', '').replace(')', ''),
  };
}

const answer = await day18a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
