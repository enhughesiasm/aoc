import { readData } from '../../../lib/shared.ts';

type Replacements = Map<string, string[]>;

type Input = {
  replacements: Replacements;
  destinationMolecule: string;
  reversed: Map<string, string>;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const input = parseInput(data);

  let target = input.destinationMolecule;
  let stepsRequired = 0;

  // we reverse the map and start from the destination string and shrink it down to 'e'

  // sort our possible replacements so we can be greedy and choose longest replacements first
  const sortedReplacements = Array.from(input.reversed.keys()).sort((a, b) =>
    a.length > b.length ? -1 : 1
  );

  // this isn't guaranteed to work as a general solution
  // we could make it more likely to finish by shuffling the replacements, but keeping them sorted by length
  // but this seems to work?!
  while (target !== 'e') {
    for (const possibleReplacement of sortedReplacements) {
      if (target.includes(possibleReplacement)) {
        target = target.replace(
          possibleReplacement,
          input.reversed.get(possibleReplacement)
        );
        stepsRequired++;
      }
    }
  }

  return stepsRequired;
}

function parseInput(lines: string[]): Input {
  const destinationMolecule = lines.pop();

  const replacements = lines.map(parseReplacement);

  const replacementsMap = new Map<string, string[]>();

  replacements.forEach((r) => {
    if (replacementsMap.has(r[0])) {
      replacementsMap.get(r[0]).push(r[1]);
    } else {
      replacementsMap.set(r[0], [r[1]]);
    }
  });

  const reversedMap = new Map<string, string>();

  for (const [str, options] of replacementsMap) {
    options.forEach((o) => {
      reversedMap.set(o, str);
    });
  }

  return {
    destinationMolecule,
    replacements: replacementsMap,
    reversed: reversedMap,
  };
}

function parseReplacement(line: string): [string, string] {
  return line.split(' => ') as [string, string];
}
