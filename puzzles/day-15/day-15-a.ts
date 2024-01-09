import { readData, sum } from '../../shared.ts';
import chalk from 'chalk';

export async function day15a(dataPath?: string) {
  const data = await readData(dataPath);
  const steps = parseSteps(data[0]);

  return sum(steps.map((s) => calculateHASH(s)));
}

function parseSteps(input: string) {
  return input.split(',');
}

function calculateHASH(input: string): number {
  let currentValue = 0;

  for (const char of input) {
    currentValue += char.charCodeAt(0);

    currentValue *= 17;

    currentValue = currentValue % 256;
  }

  return currentValue;
}

const answer = await day15a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
