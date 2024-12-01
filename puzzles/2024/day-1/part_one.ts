import { ones } from 'mathjs';
import { readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  console.log();

  const lists = parseLists(data);

  const distances = calculateDistances(lists);

  return sum(distances);
}

function calculateDistances(lists: { one: number[]; two: number[] }): number[] {
  const distances: number[] = [];

  for (let i = 0; i < lists.one.length; i++) {
    distances.push(Math.abs(lists.one[i] - lists.two[i]));
  }
  return distances;
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
