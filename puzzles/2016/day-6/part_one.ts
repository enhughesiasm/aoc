import {
  calculateCharacterFrequencies,
  readData,
  transpose2DArray,
} from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const transposed = transpose2DArray(data.map((l) => l.split(''))).map((col) =>
    col.join('')
  );

  return errorCorrectMessage(transposed);
}

function errorCorrectMessage(cols: string[]): string {
  let answer = '';
  for (const col of cols) {
    const freq = calculateCharacterFrequencies(col, false);

    const key = Object.keys(freq.sortedFrequencies)[0];

    answer += key;
  }

  return answer;
}
