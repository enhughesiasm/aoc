import {
  getAllIndicesForCharacter,
  getLengthsForContiguousSequences,
  isArrayEqual,
  parseNumberList,
  readData,
  sum,
} from '../../shared.ts';
import chalk from 'chalk';

// Hello future me, I hope you had a nice trip 👋
// I think this would work, but it doesn't finish in a reasonable time even on the SAMPLE data!
// TODO:
// 1) test it on a tiny sample and verify the result
// 2) memoize the earlier parts - we're recalculating everything on every "?" so long strings
//    do a LOT of repeat work - memoize the permutation generation somehow and this should
//    speed up a LOT
// 3) something else..?!

type Record = {
  unfoldedString: string;
  validPermutations: string[];
  quintupledExpectedCounts: number[];
};

export async function day12b(dataPath?: string) {
  const data = await readData(dataPath);
  const records = data.map((l) => parseLine(l));

  for (const r of records) {
    const queryIndices = getAllIndicesForCharacter(r.unfoldedString, '?');

    // we need to iterate 2^(queryCharCount) to find all permutations 😔
    // (this will be very slow if part 2 is cruel
    //  but I can't think of a smart way to avoid that... 😅)
    for (let seed = 0; seed < Math.pow(2, queryIndices.length); seed++) {
      const permutation = generatePermutation(r.unfoldedString, seed);
      const hashSequences = getLengthsForContiguousSequences(permutation, '#');
      if (isArrayEqual(hashSequences, r.quintupledExpectedCounts)) {
        r.validPermutations.push(permutation);
      }
    }
  }

  return sum(records.map((r) => r.validPermutations.length));
}

function generatePermutation(input: string, seed: number): string {
  let innerCount = 0;

  // create a permutation based on which '?' we're on
  const permutation = input.replace(/\?/g, (original) => {
    // every other innerCount alternate between characters, using the seed to see which ? to replace with what
    // (sorry future me trying to understand what I did here, I promise it makes sense 😅)
    const replacement = (seed >> innerCount) % 2 ? '#' : '.';
    innerCount++;
    return replacement;
  });

  return permutation;
}

function parseLine(line: string): Record {
  const [original, countsList] = line.split(' ');
  const expectedCounts = parseNumberList(countsList, ',');

  const unfolded = unfold5Times(original, '?');

  return {
    quintupledExpectedCounts: repeatArray(expectedCounts, 5),
    unfoldedString: unfolded,
    validPermutations: [],
  };
}

function unfold5Times(inputString: string, separator: string): string {
  // lol
  return `${inputString}${separator}${inputString}${separator}${inputString}${separator}${inputString}${separator}${inputString}`;
}

function repeatArray(arr: number[], times: number): number[] {
  return Array.from({ length: times }, () => [...arr]).flat();
}

const answer = await day12b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
