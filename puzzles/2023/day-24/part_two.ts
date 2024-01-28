import { readData } from '../../../lib/shared.ts';

/*
This one was nuts. Tried a few approaches, then looked for hints and found this bit of genius:

Part 2 was the real doozy.
It took me a couple hours to even start writing code for it,
I didn't know where to even start.
After a couple hours I decided to try something,
I'd try to figure out the closest that two hailstones get to each other as measured by
Manhattan distance and assume that the rock would have to collide with both close to that
point, but I kept getting error in calculating this when the velocities of one component
were the same.
At first I just skipped them, but then I thought
"Wait, if the X velocities of two hailstones are the same, then the distance between them is constant.
So there's only a few speeds the rock can go to hit them both."
This is because in order to hit two hailstones that satisfy this condition,
the velocity of the rock along that axis must satisfy the equation
(DistanceDifference % (RockVelocity-HailVelocity) = 0.
I set up a quick loop to check every velocity from -1000 to 1000 that satisfies this equation and kept them in a set, and by intersecting that set with a set of previously found velocities I got all three velocities along all three axes. This worked flawlessly.

Once I had the velocity of the rock, you can subtract it from the velocities of a hailstone to get a new "line" representing all of the potential start points for your rock. Doing an algebraic intersection from two lines created from two different hailstones this way trivially gets the final answer. Well, I saw it was trivial but it still took me another half an hour to code it in from that point, but it works, and I didn't have to do any linear algebra or Z3 to get the answer.
*/

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  for (const line of data) {
    const [positions, velocity] = line.split(' @ ');
    const [px, py, pz] = positions.split(', ').map((n) => Number(n));
    const [vx, vy, vz] = velocity.split(', ').map((n) => Number(n));

    if (!velocitiesX[vx]) {
      velocitiesX[vx] = [px];
    } else {
      velocitiesX[vx].push(px);
    }

    if (!velocitiesY[vy]) {
      velocitiesY[vy] = [py];
    } else {
      velocitiesY[vy].push(py);
    }

    if (!velocitiesZ[vz]) {
      velocitiesZ[vz] = [pz];
    } else {
      velocitiesZ[vz].push(pz);
    }

    hailstones.push({ px, py, pz, vx, vy, vz });
  }

  let possibleV: number[] = [];
  for (let x = -1000; x <= 1000; x++) {
    possibleV.push(x);
  }

  const rvx = getRockVelocity(velocitiesX);
  const rvy = getRockVelocity(velocitiesY);
  const rvz = getRockVelocity(velocitiesZ);

  const results: Record<number, number> = {};
  for (let i = 0; i < hailstones.length; i++) {
    for (let j = i + 1; j < hailstones.length; j++) {
      const stoneA = hailstones[i];
      const stoneB = hailstones[j];

      const ma = (stoneA.vy - rvy) / (stoneA.vx - rvx);
      const mb = (stoneB.vy - rvy) / (stoneB.vx - rvx);

      const ca = stoneA.py - ma * stoneA.px;
      const cb = stoneB.py - mb * stoneB.px;

      const rpx = Number.parseInt(((cb - ca) / (ma - mb)).toString(), 10);
      const rpy = Number.parseInt((ma * rpx + ca).toString(), 10);

      const time = Math.round((rpx - stoneA.px) / (stoneA.vx - rvx));
      const rpz = stoneA.pz + (stoneA.vz - rvz) * time;

      const result = rpx + rpy + rpz;
      if (!results[result]) {
        results[result] = 1;
      } else {
        results[result]++;
      }
    }
  }

  const result = Object.keys(results).sort(
    (a, b) => results[Number(b)] - results[Number(a)]
  )[0];

  // console.log(result);

  return Number.parseInt(result);
}

interface Hailstone {
  px: number;
  py: number;
  pz: number;
  vx: number;
  vy: number;
  vz: number;
}

const hailstones: Hailstone[] = [];

const velocitiesX: Record<number, number[]> = {};
const velocitiesY: Record<number, number[]> = {};
const velocitiesZ: Record<number, number[]> = {};

const getRockVelocity = (velocities: Record<number, number[]>): number => {
  let possibleV: number[] = [];
  for (let x = -1000; x <= 1000; x++) {
    possibleV.push(x);
  }

  Object.keys(velocities).forEach((velocity) => {
    const vel = parseInt(velocity, 10);
    if (velocities[vel].length < 2) {
      return;
    }

    let newPossibleV: number[] = [];
    possibleV.forEach((possible) => {
      if ((velocities[vel][0] - velocities[vel][1]) % (possible - vel) === 0) {
        newPossibleV.push(possible);
      }
    });

    possibleV = newPossibleV;
  });

  return possibleV[0];
};
