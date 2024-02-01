import { readData } from '../../../lib/shared.ts';

const FORBIDDEN_CHAR_CODES = ['i', 'o', 'l'].map((x) => x.charCodeAt(0));

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let password = data[0];

  do {
    password = incrementPassword(password, password.length - 1);
  } while (
    !includesValidStraight(password) ||
    !containsTwoDifferentPairs(password)
  );

  return password;
}

function includesValidStraight(pw: string): boolean {
  for (let i = 0; i < pw.length - 2; i++) {
    const char1 = pw.charCodeAt(i);
    const char2 = pw.charCodeAt(i + 1);
    const char3 = pw.charCodeAt(i + 2);

    if (char2 === char1 + 1 && char3 === char2 + 1) {
      return true;
    }
  }
  return false;
}

function containsTwoDifferentPairs(pw: string): boolean {
  const regex = /(.)\1.*?(.)\2/g;
  return regex.test(pw);
}

function incrementPassword(pw: string, index: number): string {
  let newCharCode = pw.charCodeAt(index) + 1;

  while (FORBIDDEN_CHAR_CODES.includes(newCharCode)) {
    newCharCode++;
  }

  if (newCharCode > 122) {
    const newPw = pw.split('');
    newPw[index] = 'a';
    return incrementPassword(newPw.join(''), index - 1);
  } else {
    const incremented = pw.split('');
    incremented[index] = String.fromCharCode(newCharCode);
    return incremented.join('');
  }
}
