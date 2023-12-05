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
    .replaceAll('  ', ' ')
    .split(separator)
    .map((n) => parseInt(n))
    .filter((n) => n !== null);
}
