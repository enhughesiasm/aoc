import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const up = Array.from(data[0]).filter((c) => c === '(').length;
  const down = Array.from(data[0]).filter((c) => c === ')').length;
  return up - down;
}
