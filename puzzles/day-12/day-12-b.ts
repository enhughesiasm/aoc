import { parseNumberList, readData, repeatArray, sum } from '../../shared.ts';

import chalk from 'chalk';

type Record = {
  input: string;
  expectedCounts: number[];
};

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);
  const records = data.map((l) => parseLine(l));
  return sum(records.map((r) => countPermutations(r)));
}

const cache = new Map<string, number>();

function countPermutations(r: Record): number {
  // base case 1:
  // have we run out of expected counts?
  // if so, any remaining gears ('#') mean this is an invalid path so no need to explore further
  if (r.expectedCounts.length === 0) {
    return r.input.includes('#') ? 0 : 1;
  }

  // base case 2:
  // have we reached the end of the string?
  // if so, this is valid only if we have met all of the required counts
  if (r.input === '') {
    return r.expectedCounts.length ? 0 : 1;
  }

  const cacheKey = `${r.input}-${r.expectedCounts}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  let count = 0;

  const currentChar = r.input[0];
  const [currentCount, ...remainingCounts] = r.expectedCounts;
  switch (currentChar) {
    case '.':
      count += countPermutations({
        input: r.input.slice(1),
        expectedCounts: r.expectedCounts,
      });
      break;
    case '#':
      if (isValidGearGroup(r.input, currentCount)) {
        count += countPermutations({
          input: r.input.slice(currentCount + 1),
          expectedCounts: remainingCounts,
        });
      }
      break;
    case '?':
      // add dot case AND gear case for each ?
      count += countPermutations({
        input: r.input.slice(1),
        expectedCounts: r.expectedCounts,
      });
      if (isValidGearGroup(r.input, currentCount)) {
        count += countPermutations({
          input: r.input.slice(currentCount + 1),
          expectedCounts: remainingCounts,
        });
      }
      break;
  }

  cache.set(cacheKey, count);
  return count;
}

function isValidGearGroup(remainingInput: string, desiredCount: number) {
  return (
    // required gears have to fit into the remaining string
    desiredCount <= remainingInput.length &&
    // the next few characters have to all be either # or ? up to the required number
    !remainingInput.slice(0, desiredCount).includes('.') &&
    // the gear group has to end at the right count, which could be either end-of-string, OR a . OR a ?
    (desiredCount === remainingInput.length ||
      remainingInput[desiredCount] !== '#')
  );
}

function parseLine(line: string): Record {
  const [original, countsList] = line.split(' ');
  const expectedCounts = parseNumberList(countsList, ',');

  const unfolded = unfold5Times(original, '?');

  return {
    expectedCounts: repeatArray(expectedCounts, 5),
    input: unfolded,
  };
}

function unfold5Times(inputString: string, separator: string): string {
  // lol
  return `${inputString}${separator}${inputString}${separator}${inputString}${separator}${inputString}${separator}${inputString}`;
}

const answer = await day12b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
