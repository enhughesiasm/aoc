import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const transformed = data.map((l) => transformLine(l));

  return transformed.reduce((accumulator, line) => {
    const digits = line.match(/\d/gm);
    return accumulator + Number(digits[0] + digits.at(-1));
  }, 0);
}

function transformLine(l: string): string {
  return l
    .replaceAll('one', 'one1one')
    .replaceAll('two', 'two2two')
    .replaceAll('three', 'three3three')
    .replaceAll('four', 'four4four')
    .replaceAll('five', 'five5five')
    .replaceAll('six', 'six6six')
    .replaceAll('seven', 'seven7seven')
    .replaceAll('eight', 'eight8eight')
    .replaceAll('nine', 'nine9nine');
}
