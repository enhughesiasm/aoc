import { readFileSync } from 'node:fs';

/*
Assume the stone we shoot starts at a, b, c @ d, e, f Coordinate systems are relative so let's look at the world from the point of view of the stone. Then we are not moving and all of the hailstones will be aiming to hit us right at the origin, where we sit. Transform each hailstone x, y, z @ dx, dy, dz to x-a, y-b, z-c @ dx-d, dy-e, dz-f If it is going to hit the origin, then the vector from the origin to the starting position has to be a multiple of its velocity. We only need two dimensions to solve this for a, b, d and e:

(x-a) : (y-b) = (dx-d) : (dy-e)
(x-a) * (dy-e) = (y-b) * (dx-d)
Fill in for two different hailstones x1, y1 @ dx1 dy1 and x2, y2 @ dx1 dy2 and subtract to get a linear equation for a, b, d and e:

(dy2 - dy1) * a + (dx1 - dx2) * b + (y1 - y2) * d + (x2 - x1) * e =
  dx1 * y1 - dx2 * y2 + x2 * dy2 - x1 * dy1
Each combination j of two hailstorms yields a different equation of the type

cj1 * a + cj2 * b + cj3 * d + cj4 * e = cj5
Take four such equations to form a matrix

((c11, c12, c13, c14),   (a,  (c51,
 (c21, c22, c23, c24),    b,   c52,
 (c31, c32, c33, c34),    d,   c53,
 (c41, c42, c43, c44)) *  e) = c54)
Or, A * x = b. We can find x by inverting A and computing x = A^-1 * b

Initially, I used wolfram alpha for that, which was also painful cause the numbers were so big that the input got rounded off. Then I found JAMA which runs in the JVM so I could call it from Scala.
*/

// This solution requires node 20+

function add(A, B, hails, n) {
  const [px0, py0, pz0, vx0, vy0, vz0] = hails[0];
  const [pxN, pyN, pzN, vxN, vyN, vzN] = hails[n];
  A.push([vy0 - vyN, vxN - vx0, 0n, pyN - py0, px0 - pxN, 0n]);
  B.push(px0 * vy0 - py0 * vx0 - pxN * vyN + pyN * vxN);
  A.push([vz0 - vzN, 0n, vxN - vx0, pzN - pz0, 0n, px0 - pxN]);
  B.push(px0 * vz0 - pz0 * vx0 - pxN * vzN + pzN * vxN);
}

function det(m) {
  if (m.length === 0) return 1n;
  let [l, ...r] = m;
  r = l.map((n, i) => n * det(r.map((row) => row.toSpliced(i, 1))));
  return r.reduce((a, b, i) => (i % 2 ? a - b : a + b), 0n);
}

function cramer(A, B) {
  const detA = det(A);
  return A.map((_, i) => det(A.map((r, j) => r.toSpliced(i, 1, B[j]))) / detA);
}

function part2(input) {
  const hails = input
    .split('\n')
    .map((line) => line.match(/-?\d+/g).map(BigInt));
  const A = [];
  const B = [];
  for (let i = 1; i <= 3; i++) add(A, B, hails, i);
  const [pxr, pyr, pzr] = cramer(A, B);
  return pxr + pyr + pzr;
}

console.log(part2(readFileSync('./day24.txt').toString().trim()));
