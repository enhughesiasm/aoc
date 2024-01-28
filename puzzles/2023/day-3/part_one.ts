import { isNumeric, readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let allValidNumbers: number[] = [];

  for (let i = 0; i < data.length; i++) {
    //console.log('Line ' + (i + 1));
    const prevLine = i > 0 ? data[i - 1] : undefined;
    const nextLine = i < data.length - 1 ? data[i + 1] : undefined;

    //console.log(JSON.stringify(prevLine));
    //console.log(JSON.stringify(data[i]));
    //console.log(JSON.stringify(nextLine));
    const thisLineNumbers = findValidNumbers(data[i], prevLine, nextLine);

    allValidNumbers = allValidNumbers.concat(thisLineNumbers);
  }

  return allValidNumbers.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

function findValidNumbers(
  line: string,
  prevLine?: string,
  nextLine?: string
): number[] {
  const validNumbers: number[] = [];
  const thisLineNumbers = extractNumbersWithPosition(line);

  // console.log(JSON.stringify(thisLineNumbers));

  const thisLineSymbols = extractIndexesOfSymbols(line);

  const prevLineSymbols = prevLine ? extractIndexesOfSymbols(prevLine) : [];
  const nextLineSymbols = nextLine ? extractIndexesOfSymbols(nextLine) : [];

  //console.log(JSON.stringify(prevLineSymbols));
  //console.log(JSON.stringify(thisLineSymbols));
  //console.log(JSON.stringify(nextLineSymbols));
  //console.log('---');

  for (const thisLineNumber of thisLineNumbers) {
    //console.log(`Checking ${JSON.stringify(thisLineNumber)}...`);

    if (
      hasAdjacentSymbol(
        thisLineNumber.index,
        thisLineNumber.numberLength,
        thisLineSymbols,
        prevLineSymbols,
        nextLineSymbols
      )
    ) {
      validNumbers.push(thisLineNumber.value);
    }
  }

  return validNumbers;
}

function extractNumbersWithPosition(
  line: string
): { value: number; index: number; numberLength: number }[] {
  const integerRegex = /\b\d+\b/g;
  const matches = [...line.matchAll(integerRegex)];

  const numbersWithPosition = matches.map((match) => ({
    value: parseInt(match[0], 10),
    index: match.index || 0,
    numberLength: match[0].toString().length,
  }));

  return numbersWithPosition;
}

function extractIndexesOfSymbols(line: string): number[] {
  const nonNumericRegex = /[^0-9.]/g;

  const indices: number[] = [];
  let match;
  while ((match = nonNumericRegex.exec(line)) !== null) {
    indices.push(match.index);
  }

  return indices;
}

function hasAdjacentSymbol(
  startIndex: number,
  numberLength: number,
  thisLineSymbolIndices: number[],
  prevLineSymbolIndices: number[],
  nextLineSymbolIndices: number[]
): boolean {
  const startX = startIndex - 1;
  const endX = startIndex + numberLength;

  // this line
  if (
    thisLineSymbolIndices.includes(startX) ||
    thisLineSymbolIndices.includes(endX)
  ) {
    //console.log(`Valid: adjacent this line`);
    return true;
  }

  // previous line
  if (prevLineSymbolIndices.length > 0) {
    for (let i = startX; i <= endX; i++) {
      if (prevLineSymbolIndices.includes(i)) {
        // console.log(`Valid: adjacent previous line at index ${i}`);
        return true;
      }
    }
  }

  if (nextLineSymbolIndices.length > 0) {
    for (let i = startX; i <= endX; i++) {
      if (nextLineSymbolIndices.includes(i)) {
        //console.log(`Valid: adjacent next line at index ${i}`);
        return true;
      }
    }
  }

  return false;
}
