import { ones } from 'mathjs';
import { countOccurrencesInArray, readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  console.log();

  const lists = parseLists(data);

  return calculateSimilarityScore(lists);
}

function calculateSimilarityScore(lists: {
  one: number[];
  two: number[];
}): number {
  let total = 0;

  for (let i = 0; i < lists.one.length; i++) {
    const val = lists.one[i];
    const amountInOtherList = countOccurrencesInArray(lists.two, val);

    total += val * amountInOtherList;
  }
  return total;
}

function parseLists(data: string[]): { one: number[]; two: number[] } {
  const one: number[] = [];
  const two: number[] = [];

  data.forEach((element) => {
    one.push(Number.parseInt(element.split('   ')[0].toString().trim()));
    two.push(Number.parseInt(element.split('   ')[1].toString().trim()));
  });

  one.sort((a, b) => a - b);
  two.sort((a, b) => a - b);

  return { one, two };
}
