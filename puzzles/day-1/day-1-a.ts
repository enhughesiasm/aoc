import { readData } from '../../lib/shared.ts';
import chalk from 'chalk';

export async function day1a(dataPath?: string) {
  const data = await readData(dataPath);
  return data.reduce((accumulator, line) => {
    const digits = line.match(/\d/gm);
    return accumulator + Number(digits[0] + digits.at(-1));
  }, 0);
}

const answer = await day1a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
