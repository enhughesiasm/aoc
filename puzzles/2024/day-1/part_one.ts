import { readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const lists = parseLists(data);

  const distances = calculateDistances(lists);

  return sum(distances);
}

function parseLists(data: string[]): [number[], number[]] {
  const one: number[] = [];
  const two: number[] = [];

  data.forEach((element) => {
    const [first, second] = element
      .split('   ')
      .map((part) => Number.parseInt(part.trim()));
    one.push(first);
    two.push(second);
  });

  return [one.sort((a, b) => a - b), two.sort((a, b) => a - b)];
}

function calculateDistances([list1, list2]: [number[], number[]]): number[] {
  return list1.map((value, index) => Math.abs(value - list2[index]));
}
