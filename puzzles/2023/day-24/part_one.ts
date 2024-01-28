import { extractNumbers, readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

const MIN = 200000000000000;
const MAX = 400000000000000;

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const stones = data.map(parseStone);

  const intersections = iteratePairwise(stones, (a, b) =>
    findIntersection(a.p, a.p2, a.v, b.p, b.p2, b.v)
  ).filter(
    (i) =>
      i.hit === true &&
      MIN <= i.px &&
      i.px <= MAX &&
      MIN <= i.py &&
      i.py <= MAX &&
      i.aHit === 'FUTURE' &&
      i.bHit === 'FUTURE'
  );

  return intersections.length;
}

type Vec3 = [number, number, number];
type Stone = { p: Vec3; v: Vec3; p2: Vec3 };

type IntersectionResult =
  | {
      hit: false;
      kind:
        | 'TRUE_PARALLEL'
        | 'COINCIDENT_PARTLY_OVERLAP'
        | 'COINCIDENT_TOTAL_OVERLAP'
        | 'COINCIDENT_NO_OVERLAP';
    }
  | {
      a0: Vec3;
      b0: Vec3;
      hit: true;
      kind:
        | 'INTERSECTION_OUTSIDE_SEGMENT'
        | 'INTERSECTION_IN_ONE_SEGMENT'
        | 'INTERSECTION_INSIDE_SEGMENT';
      px: number;
      py: number;
      aHit: 'FUTURE' | 'PAST';
      bHit: 'FUTURE' | 'PAST';
    };

function iteratePairwise<T, TRet>(array: T[], fn: (a: T, b: T) => TRet) {
  const results: TRet[] = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      results.push(fn(array[i], array[j]));
    }
  }

  return results;
}

function parseStone(line: string): Stone {
  const parts = line.split(' @ ');

  const stone = {
    p: extractNumbers(parts[0]) as Vec3,
    v: extractNumbers(parts[1]) as Vec3,
  };

  return {
    ...stone,
    p2: [
      stone.p[0] + stone.v[0],
      stone.p[1] + stone.v[1],
      stone.p[2] + stone.v[2],
    ],
  };
}

function subtractVec3(b: Vec3, a: Vec3): Vec3 {
  return [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
}

// adapted from
// http://www.sunshine2k.de/coding/javascript/lineintersection2d/LineIntersect2D.html
function findIntersection(
  a0: Vec3,
  a1: Vec3,
  av: Vec3,
  b0: Vec3,
  b1: Vec3,
  bv: Vec3
): IntersectionResult {
  let a: Vec3 = subtractVec3(a1, a0);
  let b: Vec3 = subtractVec3(b1, b0);

  if (dotProduct2D(a, b) === 0) {
    let u: Vec3 = subtractVec3(b0, a0);
    if (dotProduct2D(a, u) === 0) {
      /* check whether line segments overlap or not */

      /* put B0 into line equation of a */
      let sB0: number;
      if (a[0] != 0) {
        sB0 = u[0] / a[0];
      } else {
        sB0 = u[1] / a[1];
      }

      /* put B1 into line equation of a */
      let u2: Vec3 = subtractVec3(b1, a0);
      let sB1: number;
      if (a[0] != 0) {
        sB1 = u2[0] / a[0];
      } else {
        sB1 = u2[1] / a[1];
      }

      /* B0 or B1 or both is on and inside line segment a */
      if ((sB0 >= 0 && sB0 <= 1) || (sB1 >= 0 && sB1 <= 1)) {
        if (sB0 >= 0 && sB0 <= 1 && sB1 >= 0 && sB1 <= 1) {
          return { hit: false, kind: 'COINCIDENT_TOTAL_OVERLAP' };
        } else {
          return { hit: false, kind: 'COINCIDENT_PARTLY_OVERLAP' };
        }
      } else {
        return { hit: false, kind: 'COINCIDENT_NO_OVERLAP' };
      }
    } else {
      return { hit: false, kind: 'TRUE_PARALLEL' };
    }
  } else {
    /* not parallel */
    /* use first line for intersection point calculation */
    let u: Vec3 = subtractVec3(b0, a0);

    let s: number = dotProduct2D(b, u) / dotProduct2D(b, a);
    let px: number = a0[0] + s * a[0];
    let py: number = a0[1] + s * a[1];

    /* use second line to calculate t */
    let u2: Vec3 = subtractVec3(a0, b0);
    let t: number = dotProduct2D(a, u2) / dotProduct2D(a, b);

    // is the hit in the positive direction of each of their velocities?
    const aHit = isInFuture(a0, av, px, py) ? 'FUTURE' : 'PAST';
    const bHit = isInFuture(b0, bv, px, py) ? 'FUTURE' : 'PAST';

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        a0,
        b0,
        hit: true,
        kind: 'INTERSECTION_INSIDE_SEGMENT',
        px,
        py,
        aHit,
        bHit,
      };
    } else if ((s >= 0 && s <= 1) || (t >= 0 && t <= 1)) {
      return {
        a0,
        b0,
        hit: true,
        kind: 'INTERSECTION_IN_ONE_SEGMENT',
        px,
        py,
        aHit,
        bHit,
      };
    } else {
      return {
        a0,
        b0,
        hit: true,
        kind: 'INTERSECTION_OUTSIDE_SEGMENT',
        px,
        py,
        aHit,
        bHit,
      };
    }
  }
}

function isInFuture(start: Vec3, vel: Vec3, px: number, py: number): boolean {
  const willHitX =
    start[0] === px ||
    (start[0] < px && vel[0] > 0) ||
    (start[0] > px && vel[0] < 0);

  const willHitY =
    start[1] === py ||
    (start[1] < py && vel[1] > 0) ||
    (start[1] > py && vel[1] < 0);

  const willHitZ = true;

  return willHitX && willHitY && willHitZ;
}

function dotProduct2D(p0: Vec3, p1: Vec3): number {
  return p0[0] * p1[1] - p0[1] * p1[0];
}
