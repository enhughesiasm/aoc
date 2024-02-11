import { extractNumbers, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const numbers = data.map((l) => extractNumbers(l));

  const validTriangles = numbers.map((n) => isValidTriangle(n)).filter(Boolean);

  return validTriangles.length;
}

function isValidTriangle(sides: number[]) {
  sides.sort((a, b) => (a < b ? 1 : -1));

  return sides[1] + sides[2] > sides[0];
}
