import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const lists = parseLists(data);

  return calculateSimilarityScore(lists);
}

function parseLists(lines: string[]): [number[], number[]] {
  const one: number[] = [];
  const two: number[] = [];

  lines.forEach((line) => {
    const [first, second] = line
      .split('   ')
      .map((part) => Number.parseInt(part.trim()));
    one.push(first);
    two.push(second);
  });

  return [one.sort((a, b) => a - b), two.sort((a, b) => a - b)];
}

function calculateSimilarityScore([list1, list2]: [
  number[],
  number[]
]): number {
  return list1.reduce((total, val) => {
    const amountInOtherList = countOccurrencesInArray(list2, val);
    return total + val * amountInOtherList;
  }, 0);
}

function countOccurrencesInArray<T>(array: T[], target: T): number {
  return array.filter((item) => item === target).length;
}
