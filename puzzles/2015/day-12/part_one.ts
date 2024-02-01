import { sum } from 'mathjs';
import { extractNumbers, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const numbers = data.map((n) => extractNumbers(n));

  return sum(numbers.flat());
}
