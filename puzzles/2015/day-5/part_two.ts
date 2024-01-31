import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const niceStrings = data.filter((d) => isNiceString(d));

  return niceStrings.length;
}

function isNiceString(s: string): boolean {
  // must have two repeating letters twice
  const regex = /(\w\w).*\1/;
  const matches = s.match(regex);
  if (matches === null) return false;

  // must have at least one letter which repeats with exactly one letter between them
  const repeatWithBetween = /(\w).\1/;
  const repeatWithBetweenMatches = s.match(repeatWithBetween);
  if (repeatWithBetweenMatches === null) return false;

  return true;
}
