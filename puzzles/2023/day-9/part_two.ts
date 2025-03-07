import { parseNumberList, readData, sum } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const lines = await readData(dataPath);

  const sequences = lines.map((l) => parseNumberList(l, ' '));

  const prevValues = sequences.map((s) => predictPreviousValue(s));

  return sum(prevValues);
}

function predictNextValue(seq: number[]): number {
  if (seq.every((n) => n === 0)) {
    return 0;
  } else {
    return seq[seq.length - 1] + predictNextValue(findDifferences(seq));
  }
}

function predictPreviousValue(seq: number[]): number {
  if (seq.every((n) => n === 0)) {
    return 0;
  } else {
    return seq[0] - predictPreviousValue(findDifferences(seq));
  }
}

function findDifferences(sequence: number[]): number[] {
  const differences: number[] = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    differences.push(sequence[i + 1] - sequence[i]);
  }

  return differences;
}
