import { readFile } from 'fs/promises';

export async function readData(
  path?: string,
  preserveEmptyLines: boolean = false
) {
  const fileName = path || process.argv[2];
  const data = (await readFile(fileName)).toString().split('\n');

  return preserveEmptyLines ? data : data.filter((d) => d.length > 0);
}

export function numericOnly(input: string): string {
  return input.replace(/\D/g, '');
}

export function isNumeric(input: string): boolean {
  const numericRegex = /^[0-9]$/;
  return numericRegex.test(input);
}

export function intersection(list1: number[], list2: number[]): number[] {
  const set1 = new Set(list1);
  const overlappingNumbers: number[] = [];

  for (const num of list2) {
    if (set1.has(num)) {
      overlappingNumbers.push(num);
    }
  }

  return overlappingNumbers;
}

export function min(list: number[]): number {
  return Math.min(...list);
}

type Range = { start: number; length: number };

export function areRangesOverlapping(range1: Range, range2: Range): boolean {
  return (
    range1.start < range2.start + range2.length &&
    range1.start + range1.length > range2.start
  );
}

export function findOverlappingRanges(ranges: Range[]): Range[] {
  const overlappingRanges: Range[] = [];

  for (let i = 0; i < ranges.length; i++) {
    for (let j = i + 1; j < ranges.length; j++) {
      if (areRangesOverlapping(ranges[i], ranges[j])) {
        overlappingRanges.push(ranges[i], ranges[j]);
      }
    }
  }

  return overlappingRanges;
}

export function sum(arr: number[]): number {
  return arr.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
}

export function groupByEmptyLines(inputArray: string[]): string[][] {
  return inputArray.reduce((acc, currentValue) => {
    if (currentValue.trim() === '') {
      if (acc.length === 0 || acc[acc.length - 1].length > 0) {
        acc.push([]);
      }
    } else {
      acc[acc.length - 1].push(currentValue);
    }
    return acc;
  }, []);
}

export function parseNumberList(input: string, separator: string) {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .split(separator)
    .map((n) => parseInt(n))
    .filter((n) => n !== null);
}

export function calculateCharacterFrequencies(
  inputString: string,
  includeSpaces = false
): {
  sortedFrequencies: { [char: string]: number };
  groupedByFrequency: { [frequency: number]: string[] };
} {
  if (!includeSpaces) inputString = inputString.replaceAll(' ', '');

  const charFrequencies: { [char: string]: number } = {};

  for (const char of inputString) {
    if (charFrequencies[char]) {
      charFrequencies[char]++;
    } else {
      charFrequencies[char] = 1;
    }
  }

  const sortedCharFrequencies = Object.entries(charFrequencies)
    .sort(([charA, frequencyA], [charB, frequencyB]) => {
      // Sort by frequency first, and then alphabetically if frequencies are equal
      return frequencyB - frequencyA || charA.localeCompare(charB);
    })
    .reduce((sortedObj, [char, frequency]) => {
      sortedObj[char] = frequency;
      return sortedObj;
    }, {} as { [char: string]: number });

  const groupedByFrequency = Object.entries(charFrequencies).reduce(
    (groupedObj, [char, frequency]) => {
      if (groupedObj[frequency]) {
        groupedObj[frequency].push(char);
      } else {
        groupedObj[frequency] = [char];
      }
      return groupedObj;
    },
    {} as { [frequency: number]: string[] }
  );

  return {
    sortedFrequencies: sortedCharFrequencies,
    groupedByFrequency: groupedByFrequency,
  };
}
