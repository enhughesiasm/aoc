import { sum } from 'mathjs';
import { extractNumbers, readData } from '../../../lib/shared.ts';

type AccountingEntry = Object | Array<AccountingEntry> | number | string;

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const everything: AccountingEntry = JSON.parse(data.join(''));

  return getSum(everything);
}

function getSum(input: AccountingEntry): number {
  if (typeof input === 'string') {
    return sum(extractNumbers(input).flat());
  } else if (typeof input === 'number') {
    return input;
  } else if (Array.isArray(input)) {
    let arraySum = 0;
    for (const obj of input) {
      arraySum += getSum(obj);
    }
    return arraySum;
  } else {
    const values = Object.values(input);

    if (values.includes('red')) return 0;

    let objSum = 0;
    for (const value of values) {
      objSum += getSum(value);
    }
    return objSum;
  }
}
