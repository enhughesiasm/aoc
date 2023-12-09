import { parseNumberList, readData, sum } from '../../shared.ts';
import chalk from 'chalk';

export async function day9a(dataPath?: string) {
  const lines = await readData(dataPath);

  const sequences = lines.map((l) => parseNumberList(l, ' '));

  const nextValues = sequences.map((s) => predictNextValue(s));

  return sum(nextValues);
}

function predictNextValue(seq: number[]): number {
  if (seq.every((n) => n === 0)) {
    return 0;
  } else {
    return seq[seq.length - 1] + predictNextValue(findDifferences(seq));
  }
}

function findDifferences(sequence: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    differences.push(sequence[i + 1] - sequence[i]);
  }

  return differences;
}

const answer = await day9a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
