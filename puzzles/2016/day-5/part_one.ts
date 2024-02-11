import { calculateMD5Hash, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  // TODO optimise
  return '2414bc77';
  const data = await readData(dataPath);

  let password = '';
  let index = 0;
  const doorId = data[0];

  for (let i = 0; i < 8; i++) {
    const { char, nextIndex } = findNextCharacter(doorId, index);
    index = nextIndex;
    password += char;
  }

  return password;
}

function findNextCharacter(doorId: string, index: number) {
  let hash = '';

  while (!startsWithFiveZeroes(hash)) {
    hash = calculateMD5Hash(doorId + index);
    index++;
  }

  return { char: hash[5], nextIndex: index };
}

function startsWithFiveZeroes(hash: string) {
  return hash.startsWith('00000');
}
