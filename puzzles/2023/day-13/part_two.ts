import { readData, sum, transposeArray } from '../../../lib/shared.ts';
import chalk from 'chalk';

type Pattern = string[];

export async function solve(dataPath?: string) {
  const data = await readData(dataPath, true);

  const patterns = parsePatterns(data);

  const reflectionScores = patterns.map((p) => findSmudgedReflection(p));

  return sum(reflectionScores);
}

// we could do this more smartly with a bit of bitwise thinking
// but the data isn't too unkind so let's just use a naive approach

function findSmudgedReflection(pattern: Pattern) {
  const originalReflection = tryFindReflection(pattern);

  for (let x = 0; x < pattern[0].length; x++) {
    for (let y = 0; y < pattern.length; y++) {
      const smudgedPattern = [...pattern];
      const current = smudgedPattern[y][x];
      const newRow = smudgedPattern[y].split('');
      newRow[x] = current === '#' ? '.' : '#';
      smudgedPattern[y] = newRow.join('');

      const reflection = tryFindReflection(smudgedPattern, originalReflection);

      if (reflection !== null) {
        return reflection;
      }
    }
  }

  console.log(pattern);
  throw new Error('Failed to find smudged reflection');
}

function tryFindReflection(pattern: Pattern, excludeAnswer?: number) {
  // try rows first
  const horizontalReflections = getStartIndicesOfReflection(pattern).filter(
    (i) => i * 100 !== excludeAnswer
  );

  if (horizontalReflections.length > 1) throw new Error('Too many horizontal');

  if (horizontalReflections.length === 1) {
    return horizontalReflections[0] * 100;
  }

  const verticalReflections = getStartIndicesOfReflection(
    transposeArray(pattern)
  ).filter((i) => i !== excludeAnswer);

  if (verticalReflections.length > 1) throw new Error('Too many vertical');

  if (verticalReflections.length === 1) {
    return verticalReflections[0];
  }

  return null;
}

function getStartIndicesOfReflection(input: string[]) {
  const indices: number[] = [];

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
    if (success) indices.push(x);
  }

  return indices;
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
