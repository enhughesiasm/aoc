import { extractNumbers, readData } from '../../../lib/shared.ts';

type Instruction =
  | {
      kind: 'VALUE';
      value: number;
      bot: number;
    }
  | {
      kind: 'GIVE';
      botIndex: number;
      lowType: 'OUTPUT' | 'BOT';
      lowIndex: number;
      highType: 'OUTPUT' | 'BOT';
      highIndex: number;
    };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const inst = data.map(parseInstruction);

  return 0;
}

function parseInstruction(s: string): Instruction {
  const nums = extractNumbers(s);

  if (s.startsWith('value')) {
    return {
      kind: 'VALUE',
      value: nums[0],
      bot: nums[1],
    };
  } else {
    const givePart = s.split('gives')[1];
    const giveNums = extractNumbers(givePart);
    const giveSplit = givePart.split(' and ');

    return {
      kind: 'GIVE',
      botIndex: nums[0],
      lowType: giveSplit[0].includes('output') ? 'OUTPUT' : 'BOT',
      lowIndex: giveNums[0],
      highType: giveSplit[1].includes('output') ? 'OUTPUT' : 'BOT',
      highIndex: giveNums[1],
    };
  }
}
