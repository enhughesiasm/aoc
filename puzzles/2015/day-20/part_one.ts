import { readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const requiredPresentCount = Number.parseInt(data[0]);

  const PRESENTS_PER_ELF = 10;

  const houses: Map<number, number> = new Map();

  for (let i = 1; i < requiredPresentCount / PRESENTS_PER_ELF; i++) {
    for (let j = i; j < requiredPresentCount / PRESENTS_PER_ELF; j += i) {
      if (!houses.has(j)) {
        houses.set(j, 0);
      }
      houses.set(j, houses.get(j) + i * PRESENTS_PER_ELF);
    }
  }

  return findSmallestKeyAbove(houses, requiredPresentCount);
}

function findSmallestKeyAbove(
  map: Map<number, number>,
  targetValue: number
): number | undefined {
  let smallestKeyAbove: number | undefined;

  for (const [key, value] of map) {
    if (
      value >= targetValue &&
      (smallestKeyAbove === undefined || key < smallestKeyAbove)
    ) {
      smallestKeyAbove = key;
    }
  }

  return smallestKeyAbove;
}
