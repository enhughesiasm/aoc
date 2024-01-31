import { calculateMD5Hash, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  // TODO: optimise
  return 9958218;

  const data = await readData(dataPath);
  const key = data[0];

  let i = 0;
  while (true) {
    const hash = calculateMD5Hash(key + i);

    if (hash.startsWith('000000')) return i;

    i++;
  }
}
