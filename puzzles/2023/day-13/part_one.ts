import { readData, sum } from '../../../lib/shared.ts';
import chalk from 'chalk';

type Pattern = string[];

export async function solve(dataPath?: string) {
  const data = await readData(dataPath, true);

  const patterns = parsePatterns(data);

  const reflectionScores = patterns.map((p) => findReflection(p));

  return sum(reflectionScores);
}

function findReflection(pattern: Pattern) {
  // try rows first
  const horizontalReflection = getStartIndexOfReflection(pattern);

  if (horizontalReflection !== null) return horizontalReflection * 100;

  // try columns
  return getStartIndexOfReflection(transposeArray(pattern));
}

function transposeArray(input: string[]): string[] {
  const numRows = input.length;
  const numCols = input[0].length;

  const transposedArray: string[] = [];

  for (let j = 0; j < numCols; j++) {
    let columnString = '';
    for (let i = 0; i < numRows; i++) {
      columnString += input[i][j];
    }
    transposedArray.push(columnString);
  }

  return transposedArray;
}

function getStartIndexOfReflection(input: string[]): number | null {
  for (let x = 1; x < input.length; x++) {
    // get both sides
    const first = input.slice(0, x).reverse();
    const last = input.slice(x);

    const shortest = first.length < last.length ? first : last;
    const longest = first.length > last.length ? first : last;

    let success = true;
    for (let i = 0; i < shortest.length; i++) {
      if (shortest[i] !== longest[i]) {
        success = false;
        break;
      }
    }
    if (success) return x;
  }

  return null;
}

function parsePatterns(input: string[]): Pattern[] {
  const patterns: Pattern[] = [];
  let current: Pattern = [];

  for (const str of input) {
    if (str === '') {
      if (current.length > 0) {
        patterns.push(current);
        current = [];
      }
    } else {
      current.push(str);
    }
  }

  if (current.length > 0) {
    patterns.push(current);
  }

  return patterns;
}
