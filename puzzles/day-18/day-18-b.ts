import { readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day18b(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = data.map((r) => parseSimpleInstruction(r));
  return computeArea(instructions);
}

// /** //! FULL IMPLEMENTATION OF INITIAL APPROACH IS IN part A
//  * This worked great for the sample input but was WAY too slow / memory-intensive for the real data.
//  * Leaving it here because I made a (pointless!) fun coloured visualisation and enjoyed writing it.
//  * Might be some useful stuff to salvage here for future.
//  * @param input
//  * @returns
//  */
// function initialApproach(input: string[]) {
//   const instructions = input.map((l) => parseInstruction(l));

//   const startPos: Pos = [0, 0];

//   const { grid, gridSize } = digTrench(instructions, startPos);

//   drawTrenchGrid(grid, gridSize);

//   const floodFilledGrid = floodFill(grid, [1, 1], undefined, '#');

//   drawTrenchGrid(floodFilledGrid, gridSize);

//   return computeTrenchSize(floodFilledGrid, gridSize);
// }

const DIRECTIONS: Direction[] = ['R', 'D', 'L', 'U'];

const parseSimpleInstruction = (l: string): SimpleInstruction => {
  const parts = l.split(' ');

  const steps = parseInt(parts[2].substring(2, 7), 16);
  const dir = DIRECTIONS[Number.parseInt(parts[2][7])];
  return [dir, steps];
};

/**
 * After getting stuck with finding a smart way to do this, I've found
 * that it requires a combination of shoelace algorithm together with Pick's theorem
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

type Direction = 'U' | 'L' | 'R' | 'D';

type SimpleInstruction = [Direction, number];

const answer = await day18b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
