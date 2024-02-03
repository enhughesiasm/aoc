import { readData } from '../../../lib/shared.ts';

type Replacements = Map<string, string[]>;

type Input = {
  replacements: Replacements;
  startingMolecule: string;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const input = parseInput(data);

  const results = new Set<string>();

  walkDistinctMolecules(
    input.startingMolecule,
    0,
    input.replacements,
    Array.from(input.replacements.keys()),
    results
  );

  return results.size;
}

function walkDistinctMolecules(
  current: string,
  currentIndex: number,
  replacements: Replacements,
  replacementSources: string[],
  results: Set<string>
) {
  if (currentIndex < current.length) {
    const match = findFirstSubstring(current, replacementSources, currentIndex);

    if (match !== null) {
      for (const replacement of replacements.get(match.substring)) {
        const replaced = replaceSubstringAtIndex(
          current,
          match.index,
          match.substring,
          replacement
        );

        results.add(replaced);
      }

      // then make no replacement but continue along the string
      walkDistinctMolecules(
        current,
        match.index + 1,
        replacements,
        replacementSources,
        results
      );
    }
  }
}

function replaceSubstringAtIndex(
  originalString: string,
  index: number,
  substringToReplace: string,
  replacement: string
) {
  if (index < 0 || index >= originalString.length) {
    throw new Error('Incorrect string length');
  }

  // Use substr to get the prefix and suffix, and concatenate with the replacement
  return (
    originalString.substring(0, index) +
    replacement +
    originalString.substring(index + substringToReplace.length)
  );
}

function findFirstSubstring(
  str: string,
  substrings: string[],
  minIndex: number = 0
) {
  let result: { substring: string; index: number } | null = null;

  for (let substring of substrings) {
    const index = str.indexOf(substring, minIndex);

    if (index !== -1 && (result === null || index < result.index)) {
      result = {
        substring: substring,
        index: index,
      };
    }
  }
  return result;
}

function parseInput(lines: string[]): Input {
  const startingMolecule = lines.pop();

  const replacements: Replacements = new Map();

  lines.forEach((l) => {
    const r = parseReplacement(l);
    if (replacements.has(r[0])) {
      replacements.get(r[0]).push(r[1]);
    } else {
      replacements.set(r[0], [r[1]]);
    }
  });

  return { startingMolecule, replacements };
}

function parseReplacement(line: string): [string, string] {
  return line.split(' => ') as [string, string];
}
