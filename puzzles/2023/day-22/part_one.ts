import { extractNumbers, readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const bricks = data.map(parseBrick);

  settleBricks(bricks);

  computeBrickSupports(bricks);

  let canDisintegrate = 0;
  for (const [i, brick] of bricks.entries()) {
    if (
      brick.supports.length === 0 ||
      bricks[i].supports.every((fb) => bricks[fb].supportedBy.length > 1)
    )
      canDisintegrate++;
  }

  return canDisintegrate;
}

function sortBricksBottomUp(bricks: Brick[]) {
  // pos[2] is the lowest Z for each brick, i.e. where it is resting
  // (which may or may not be the same as pos[5] depending on orientation)
  bricks.sort((a, b) => a.pos[2] - b.pos[2]);
}

function computeBrickSupports(bricks: Brick[]) {
  for (const [i, higher] of bricks.entries()) {
    for (let j = 0; j < i; j++) {
      const lower = bricks[j];

      // bricks support one another if they're separated by 1 on the z axis
      // and they overlap on XY plane
      const higherBottomZ = higher.pos[2];
      const lowerTopZ = lower.pos[5];
      if (higherBottomZ - lowerTopZ === 1 && doBricksOverlapXY(lower, higher)) {
        higher.supportedBy.push(j);
        lower.supports.push(i);
      }
    }
  }
}

function settleBricks(bricks: Brick[]) {
  sortBricksBottomUp(bricks);

  // iterate from the bottom up
  for (const [i, higherBrick] of bricks.entries()) {
    let finalZ = 1;

    // iterate over bricks beneath, if any
    for (let j = 0; j < i; j++) {
      const lowerBrick = bricks[j];

      if (doBricksOverlapXY(lowerBrick, higherBrick)) {
        // overlap, so the highest we can land at is the lower brick's Z plus 1
        // (the lowest bricks max Z is guaranteed to be at index 5 thanks to the input
        // listing lower co-ordinates first - if not, we could sort co-ordinates during parsing)
        finalZ = Math.max(finalZ, lowerBrick.pos[5] + 1);
      }
    }
    // brick may be vertically oriented
    const brickHeight = higherBrick.pos[5] - higherBrick.pos[2];
    higherBrick.pos[5] = finalZ + brickHeight;
    higherBrick.pos[2] = finalZ;
  }

  // bricks may have fallen past each other, so ensure we're still sorted from the ground up
  sortBricksBottomUp(bricks);
}

function doBricksOverlapXY(a: Brick, b: Brick): boolean {
  const maxStartX = Math.max(a.pos[0], b.pos[0]);
  const minEndX = Math.min(a.pos[3], b.pos[3]);

  if (minEndX < maxStartX) {
    return false;
  }

  const maxStartY = Math.max(a.pos[1], b.pos[1]);
  const minEndY = Math.min(a.pos[4], b.pos[4]);

  if (minEndY < maxStartY) return false;

  // both axes have overlapping ranges
  return true;
}

type Brick = { pos: number[]; supports: number[]; supportedBy: number[] };

function parseBrick(input: string): Brick {
  return {
    pos: extractNumbers(input),
    supports: [],
    supportedBy: [],
  };
}
