import { readData } from '../../../lib/shared.ts';

/**
 *
 * This was a fun attempt, but BFS takes too long.
 *
 * At first, it took AGES even on the sample data, but I was able to prune the search and
 * keep track of states that had been previously visited so it finishes near instantly on the sample data.
 *
 * However, this just completely blows up on the real data, so it looks like I'll need to be smarter
 * and start again...
 *
 */

type Replacements = Map<string, string[]>;

type Input = {
  replacements: Replacements;
  destinationMolecule: string;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const input = parseInput(data);

  const result = findFewestSteps(
    'e',
    0,
    input.destinationMolecule,
    0,
    input.replacements,
    Array.from(input.replacements.keys())
  );

  return result;
}

let minSteps = Number.POSITIVE_INFINITY;

function findFewestSteps(
  current: string,
  currentIndex: number,
  destination: string,
  numberOfSteps: number,
  replacements: Replacements,
  replacementSources: string[]
): number {
  function findDestination(
    current: string,
    currentIndex: number,
    destination: string,
    numberOfSteps: number,
    replacements: Replacements,
    visited: Set<string>,
    replacementSources: string[]
  ): number {
    if (visited.has(`${current}-${numberOfSteps}-${currentIndex}`))
      return Number.POSITIVE_INFINITY;

    visited.add(`${current}-${numberOfSteps}-${currentIndex}`);

    if (numberOfSteps > minSteps) return Number.POSITIVE_INFINITY;

    if (current === destination) {
      minSteps = Math.min(minSteps, numberOfSteps);
      return numberOfSteps;
    }

    if (currentIndex >= current.length) return Number.POSITIVE_INFINITY;

    if (current.length > destination.length) return Number.POSITIVE_INFINITY;

    const match = findFirstSubstring(current, replacementSources, currentIndex);

    if (match !== null) {
      let fromBeginning = Number.POSITIVE_INFINITY;
      let fromAfter = Number.POSITIVE_INFINITY;
      let withoutReplacement = Number.POSITIVE_INFINITY;

      for (const replacement of replacements.get(match.substring)) {
        const newString = replaceSubstringAtIndex(
          current,
          match.index,
          match.substring,
          replacement
        );

        if (
          newString.slice(0, currentIndex) !==
            destination.slice(0, currentIndex) &&
          !containsSubstringFromArray(replacement, replacementSources)
        )
          continue;

        fromBeginning = Math.min(
          fromBeginning,
          findDestination(
            newString,
            0,
            destination,
            numberOfSteps + 1,
            replacements,
            visited,
            replacementSources
          )
        );

        if (
          newString.slice(0, currentIndex) ===
          destination.slice(0, currentIndex)
        ) {
          fromAfter = Math.min(
            fromAfter,
            findDestination(
              newString,
              match.index + match.substring.length,
              destination,
              numberOfSteps + 1,
              replacements,
              visited,
              replacementSources
            )
          );
        }
      }

      if (
        current.slice(0, currentIndex) === destination.slice(0, currentIndex)
      ) {
        withoutReplacement = Math.min(
          withoutReplacement,
          findDestination(
            current,
            currentIndex + 1,
            destination,
            numberOfSteps,
            replacements,
            visited,
            replacementSources
          )
        );
      }

      return Math.min(fromBeginning, fromAfter, withoutReplacement);
    } else {
      return Number.POSITIVE_INFINITY;
    }
  }

  return Math.min(
    minSteps,
    findDestination(
      current,
      currentIndex,
      destination,
      numberOfSteps,
      replacements,
      new Set(),
      replacementSources
    )
  );
}

function containsSubstringFromArray(inputString: string, substrings: string[]) {
  for (const substring of substrings) {
    if (inputString.includes(substring)) {
      return true;
    }
  }
  return false;
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
  const destinationMolecule = lines.pop();

  const replacements: Replacements = new Map();

  lines.forEach((l) => {
    const r = parseReplacement(l);
    if (replacements.has(r[0])) {
      replacements.get(r[0]).push(r[1]);
    } else {
      replacements.set(r[0], [r[1]]);
    }
  });

  return { destinationMolecule, replacements };
}

function parseReplacement(line: string): [string, string] {
  return line.split(' => ') as [string, string];
}
