import { extractNumbers, readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const allValidInstructions = data.map((line) => parseValidInstructions(line));

  const results = allValidInstructions
    .flat()
    .map((v) => extractNumbers(v))
    .map((x) => x[0] * x[1]);

  return sum(results);
}

function parseValidInstructions(input: string): string[] {
  return input.match(/mul\(\d+,\d+\)/g);
}
