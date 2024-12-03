import { extractNumbers, readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const validInstructions = extractValidInstructions(data.join(''));

  const results = validInstructions
    .map((v) => extractNumbers(v))
    .map((x) => x[0] * x[1]);

  return sum(results);
}

function extractValidInstructions(input: string): string[] {
  const results: string[] = [];
  let enabled = true;
  let buffer = '';

  for (let i = 0; i < input.length; i++) {
    buffer += input[i];

    if (buffer.endsWith('do')) {
      if (
        i < input.length - 3 &&
        input[i + 1] === 'n' &&
        input[i + 2] === "'" &&
        input[i + 3] === 't'
      ) {
        // console.log(`❌ "${buffer}n't" - disabling`);
        i += 3;
        enabled = false;
        buffer = '';
      } else {
        // console.log(`✅ "${buffer}" - enabling`);
        enabled = true;
        buffer = '';
      }
    }

    const mulInstruction = buffer.match(/mul\(\d+,\d+\)/g);
    if (mulInstruction) {
      if (enabled) {
        // console.log(`👉 "${buffer}" : ${mulMatch[0]}`);
        results.push(mulInstruction[0]);
      }
      buffer = '';
    }
  }

  return results;
}
