import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let s = data[0];

  for (let i = 0; i < 40; i++) {
    s = lookAndSay(s);
  }

  return s.length;
}

function lookAndSay(s: string): string {
  const grouped = groupConsecutiveDigits(s);

  let result = '';

  for (const group of grouped) {
    result += group.length;
    result += group[0];
  }

  return result;
}

function groupConsecutiveDigits(inputString) {
  if (typeof inputString !== 'string') {
    throw new Error('Input must be a string');
  }

  if (inputString.length === 0) {
    return [];
  }

  const result = [];
  let currentGroup = inputString[0];

  for (let i = 1; i < inputString.length; i++) {
    if (inputString[i] === inputString[i - 1]) {
      currentGroup += inputString[i];
    } else {
      result.push(currentGroup);
      currentGroup = inputString[i];
    }
  }

  // Push the last group
  result.push(currentGroup);

  return result;
}
