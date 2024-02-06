import { extractNumbers, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  // they provide 1-indexed values
  const [row, column] = extractNumbers(data[0]);

  const requiredCellIndex = getCellIndexDiagonally(row, column);

  const startingCode = 20151125;

  return getCodeForCell(startingCode, requiredCellIndex);
}

function getCodeForCell(startCode: number, cellIndex: number): number {
  let code = startCode;

  for (let i = 1; i < cellIndex; i++) {
    code = generateNextCode(code);
  }

  return code;
}

function generateNextCode(previousValue: number) {
  return (previousValue * 252533) % 33554393;
}

// iterating through all diagonals, what number cell is this
// using ONE-INDEXED row/col
function getCellIndexDiagonally(row: number, col: number): number {
  const diagonalNumber = getDiagonalNumber(row, col);
  const startingValue = calculateTriangleNumber(diagonalNumber) + 1;
  return startingValue + col - 1;
}

// using ONE-INDEXED row/col, which diagonal corresponds to a given row/col
function getDiagonalNumber(row: number, col: number): number {
  return row + col - 2;
}

// generates the contents of the nth diagonal line up-and-right through an infinite 2d matrix
function generateDiagonalContents(diagonalNumber: number) {
  const startingValue = calculateTriangleNumber(diagonalNumber) + 1;

  const diag = [];

  for (
    let i = startingValue;
    i < getDiagonalLength(diagonalNumber) + startingValue;
    i++
  ) {
    diag.push(i);
  }

  return diag;
}

function getDiagonalLength(diagonalNumber: number) {
  return diagonalNumber + 1;
}

function calculateTriangleNumber(n: number) {
  return (n * (n + 1)) / 2;
}
