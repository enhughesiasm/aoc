import {
  divideArrayIntoChunks,
  extractNumbers,
  readData,
  transpose2DArray,
  transposeArray,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const rawNumbers = data.map((l) => extractNumbers(l));

  const transposed = transpose2DArray(rawNumbers);

  const trianglesTransposed = transposed
    .map((row) => divideArrayIntoChunks(row, 3))
    .flat();

  const validTriangles = trianglesTransposed
    .map((n) => isValidTriangle(n))
    .filter(Boolean);

  return validTriangles.length;
}


function isValidTriangle(sides: number[]) {
  sides.sort((a, b) => (a < b ? 1 : -1));

  // console.log(sides);

  return sides[1] + sides[2] > sides[0];
}
