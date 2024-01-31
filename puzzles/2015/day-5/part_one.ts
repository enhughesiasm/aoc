import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const niceStrings = data.filter((d) => isNiceString(d));

  return niceStrings.length;
}

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const FORBIDDEN = ['ab', 'cd', 'pq', 'xy'];

function isNiceString(s: string): boolean {
  // must have three vowels
  const vowelCount = Array.from(s).filter((c) => VOWELS.includes(c)).length;
  if (vowelCount < 3) return false;

  // must have at least one repeating character
  const regex = /(.)\1/g;
  const matches = s.match(regex);
  if (matches === null) return false;

  // cannot contain ab, cd, pq or xy
  return FORBIDDEN.every((f) => !s.includes(f));
}
