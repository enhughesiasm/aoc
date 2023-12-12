import {
  getAllIndicesForCharacter,
  getLengthsForContiguousSequences,
  isArrayEqual,
  parseNumberList,
  readData,
  sum,
} from '../../shared.ts';
import chalk from 'chalk';

type Record = {
  original: string;
  expectedCounts: number[];
  validPermutations: string[];
};

export async function day12a(dataPath?: string) {
  const data = await readData(dataPath);
  const records = data.map((l) => parseLine(l));

  for (const r of records) {
    const queryIndices = getAllIndicesForCharacter(r.original, '?');

    // we need to iterate 2^(queryCharCount) to find all permutations 😔
    // (this will be very slow if part 2 is cruel
    //  but I can't think of a smart way to avoid that... 😅)
    for (let seed = 0; seed < Math.pow(2, queryIndices.length); seed++) {
      const permutation = generatePermutation(r.original, seed);
      const hashSequences = getLengthsForContiguousSequences(permutation, '#');
      if (isArrayEqual(hashSequences, r.expectedCounts)) {
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
  return { original, expectedCounts, validPermutations: [] };
}

const answer = await day12a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
