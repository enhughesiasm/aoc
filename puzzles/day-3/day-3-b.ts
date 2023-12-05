import { isNumeric, readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day3b(dataPath?: string) {
  const data = await readData(dataPath);

  let total = 0;

  for (let i = 0; i < data.length; i++) {
    //console.log('Line ' + (i + 1));
    const prevLine = i > 0 ? data[i - 1] : undefined;
    const nextLine = i < data.length - 1 ? data[i + 1] : undefined;
    total += calculateGearTotalForLine(data[i], prevLine, nextLine);
  }

  return total;
}

function calculateGearTotalForLine(
  line: string,
  prevLine?: string,
  nextLine?: string
): number {
  const gearIndices = extractIndexesOfGearSymbols(line);

  const thisLineNumbers = extractNumbersWithPosition(line);
  const prevLineNumbers = prevLine ? extractNumbersWithPosition(prevLine) : [];
  const nextLineNumbers = nextLine ? extractNumbersWithPosition(nextLine) : [];

  let gearTotal = 0;

  for (const gearIndex of gearIndices) {
    const gearAdjacentNumbers = getGearAdjacentNumbers(
      gearIndex,
      prevLineNumbers,
      thisLineNumbers,
      nextLineNumbers
    );

    // if it has exactly two part numbers, otherwise add nothing
    if (gearAdjacentNumbers.length === 2) {
      gearTotal += gearAdjacentNumbers[0] * gearAdjacentNumbers[1];
    }
  }

  return gearTotal;
}

function getGearAdjacentNumbers(
  gearIndex: number,
  prevLineNumbers: { value: number; index: number; numberLength: number }[],
  thisLineNumbers: { value: number; index: number; numberLength: number }[],
  nextLineNumbers: { value: number; index: number; numberLength: number }[]
): number[] {
  const adjacentNumbers: number[] = [];

  const startX = gearIndex - 1;
  const endX = gearIndex + 1;

  for (const thisLineNumber of thisLineNumbers) {
    if (thisLineNumber.index + thisLineNumber.numberLength - 1 === startX) {
      adjacentNumbers.push(thisLineNumber.value);
    } else if (thisLineNumber.index === endX) {
      adjacentNumbers.push(thisLineNumber.value);
    }
  }

  for (const prevNumber of prevLineNumbers) {
    if (
      rangesOverlap(
        { minX: startX, maxX: endX },
        {
          minX: prevNumber.index,
          maxX: prevNumber.index + prevNumber.numberLength - 1,
        }
      )
    ) {
      adjacentNumbers.push(prevNumber.value);
    }
  }

  for (const nextNumber of nextLineNumbers) {
    if (
      rangesOverlap(
        { minX: startX, maxX: endX },
        {
          minX: nextNumber.index,
          maxX: nextNumber.index + nextNumber.numberLength - 1,
        }
      )
    ) {
      adjacentNumbers.push(nextNumber.value);
    }
  }

  return adjacentNumbers;
}

function rangesOverlap(
  range1: { minX: number; maxX: number },
  range2: { minX: number; maxX: number }
): boolean {
  return range1.maxX >= range2.minX && range2.maxX >= range1.minX;
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

function extractIndexesOfGearSymbols(line: string): number[] {
  const gearRegex = /\*/g;

  const indices: number[] = [];
  let match;
  while ((match = gearRegex.exec(line)) !== null) {
    indices.push(match.index);
  }

  return indices;
}

const answer = await day3b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
