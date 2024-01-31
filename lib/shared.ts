import { readFile } from 'fs/promises';
import { matchesToArray } from './dotless.ts';
import crypto from 'node:crypto';

export async function readData(
  path?: string,
  preserveEmptyLines: boolean = false
) {
  const data = (await readFile(path)).toString().split('\n');

  return preserveEmptyLines ? data : data.filter((d) => d.length > 0);
}

/**
 * Returns all numeric characters concatenated into a single string
 * @param input
 * @returns
 */
export function numericOnly(input: string): string {
  return input.replace(/\D/g, '');
}

export function extractNumbers(input: string): number[] {
  return matchesToArray(input, /-?\d+/g, (n) => Number.parseInt(n[0]));
}

export function transposeArray(input: string[]): string[] {
  const numRows = input.length;
  const numCols = input[0].length;

  const transposedArray: string[] = [];

  for (let j = 0; j < numCols; j++) {
    let columnString = '';
    for (let i = 0; i < numRows; i++) {
      columnString += input[i][j];
    }
    transposedArray.push(columnString);
  }

  return transposedArray;
}

export function replaceAt(
  input: string,
  index: number,
  replacementChar: string
): string {
  if (index < 0 || index >= input.length) {
    throw new Error('Index out of bounds');
  }

  const updatedString =
    input.substring(0, index) + replacementChar + input.substring(index + 1);
  return updatedString;
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

export function max(arr: number[]): number {
  return Math.max(...arr);
}

export function isArrayEqual(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function calculateMD5Hash(input: string): string {
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(input);
  return md5Hash.digest('hex');
}

export function getLengthsForContiguousSequences(
  input: string,
  targetChar: string
): number[] {
  const regex = new RegExp(`${targetChar}+`, 'g');
  return [...input.matchAll(regex)].map((sequence) => sequence[0].length);
}

export function getAllIndicesForCharacter(
  input: string,
  targetChar: string
): number[] {
  const escapedTargetChar = targetChar.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedTargetChar}`, 'g');

  return [...input.matchAll(regex)].map((m) => m.index);
}

export function repeatArray<T>(arr: T[], times: number): T[] {
  return Array.from({ length: times }, () => [...arr]).flat();
}

export function surroundWithBorder(char: string, lines: string[]): string[] {
  const length = lines[0].length + 2;

  const newLine = char.repeat(length);
  return [newLine, ...lines.map((l) => `${char}${l}${char}`), newLine];
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

export function greatestCommonDivisor(a: number, b: number): number {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function findLCM(a: number, b: number): number {
  return (a * b) / greatestCommonDivisor(a, b);
}

export function lowestCommonMultiple(numbers: number[]): number {
  if (numbers.length < 2) {
    throw new Error('At least two numbers are required to find LCM.');
  }

  let lcm = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    lcm = findLCM(lcm, numbers[i]);
  }

  return lcm;
}

export function isWithinBounds<T>(grid: T[][], pos: [number, number]): boolean {
  const { maxX, maxY } = getGridMax(grid);
  return 0 <= pos[1] && pos[1] <= maxY && 0 <= pos[0] && pos[0] <= maxX;
}

export function getGridMax<T>(grid: T[][]) {
  const [maxY, maxX] = [grid.length - 1, grid[0].length - 1];

  return { maxX, maxY };
}

export function dumpGrid(
  grid: string[][],
  displayFunc: (gridEntry: string) => string = (s) => s
) {
  grid.map((row) => console.log(`\n${row.map(displayFunc).join('')}`));
}

export const ALL_CARTESIAN_DIRECTIONS: [number, number][] = [
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 0],
];

export function countFrequency(input: string, targetChar: string) {
  let count = 0;

  for (let i = 0; i < input.length; i++) {
    if (input[i] === targetChar) {
      count++;
    }
  }

  return count;
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

export function floodFill<TTarget>(
  map: string[][],
  start: [number, number],
  targetChar: TTarget,
  replacementChar: string
): string[][] {
  const floodFilledMap: string[][] = map.map((subarray) => [...subarray]);

  const cellQueue = [start];
  while (cellQueue.length > 0) {
    const [y, x] = cellQueue.pop();

    if (floodFilledMap[y][x] !== targetChar) continue;

    floodFilledMap[y][x] = replacementChar;

    if (y > 0 && floodFilledMap[y - 1][x] === targetChar)
      cellQueue.push([y - 1, x]);
    if (x > 0 && floodFilledMap[y][x - 1] === targetChar)
      cellQueue.push([y, x - 1]);
    if (
      y < floodFilledMap.length - 1 &&
      floodFilledMap[y + 1][x] === targetChar
    )
      cellQueue.push([y + 1, x]);
    if (
      x < floodFilledMap[0].length - 1 &&
      floodFilledMap[y][x + 1] === targetChar
    )
      cellQueue.push([y, x + 1]);
  }

  return floodFilledMap;
}

export function removeAllSubstrings(input: string, remove: string[]): string {
  for (const r of remove) {
    input = input.replaceAll(r, '');
  }
  return input;
}
