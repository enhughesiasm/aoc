import { env } from 'process';
import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  return data.reduce((accumulator, line) => {
    const digits = line.match(/\d/gm);
    return accumulator + Number(digits[0] + digits.at(-1));
  }, 0);
}
