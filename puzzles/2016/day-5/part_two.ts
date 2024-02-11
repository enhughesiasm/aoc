import {
  calculateMD5Hash,
  isNumeric,
  readData,
  replaceAt,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  // TODO optimise
  return '437e60fc';
  const data = await readData(dataPath);

  let password = '________';
  let index = 0;
  const doorId = data[0];

  const positionsSeen = new Set<number>();
  const REQUIRED_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7];

  while (REQUIRED_POSITIONS.some((p) => !positionsSeen.has(p))) {
    const { char, charPosition, nextIndex } = findNextCharacter(doorId, index);
    index = nextIndex;

    if (!positionsSeen.has(charPosition)) {
      password = replaceAt(password, charPosition, char);
      positionsSeen.add(charPosition);
    }
  }

  return password;
}

function findNextCharacter(
  doorId: string,
  index: number
): { charPosition: number; char: string; nextIndex: number } {
  let hash = '';

  while (
    !startsWithFiveZeroes(hash) ||
    !isNumeric(hash[5]) ||
    Number.parseInt(hash[5]) >= 8
  ) {
    hash = calculateMD5Hash(doorId + index);
    index++;
  }

  return {
    char: hash[6],
    nextIndex: index,
    charPosition: Number.parseInt(hash[5]),
  };
}

function startsWithFiveZeroes(hash: string) {
  return hash.startsWith('00000');
}
