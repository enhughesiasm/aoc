import { readData } from '../../../lib/shared.ts';
import { matchesToArray } from '../../../lib/dotless.ts';

type Galaxy = {
  row: number;
  rowExpanded: number;
  col: number;
  colExpanded: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const galaxies = data.map((line, i) => parseLine(line, i)).flat();
  const maxRow = galaxies.reduce((a, g) => Math.max(a, g.row), 0);
  const maxCol = galaxies.reduce((a, g) => Math.max(a, g.col), 0);
  const rowsWithNoGalaxies = [];
  const colsWithNoGalaxies = [];

  for (let i = 0; i < maxRow; i++) {
    if (!galaxies.some((g) => g.row === i)) {
      rowsWithNoGalaxies.push(i);
    }
  }
  for (let i = 0; i < maxCol; i++) {
    if (!galaxies.some((g) => g.col === i)) {
      colsWithNoGalaxies.push(i);
    }
  }

  const expansion = 1_000_000;

  for (const galaxy of galaxies) {
    const emptyRows = rowsWithNoGalaxies.filter((ri) => ri < galaxy.row).length;
    const emptyCols = colsWithNoGalaxies.filter((ci) => ci < galaxy.col).length;
    galaxy.rowExpanded = galaxy.rowExpanded + (expansion - 1) * emptyRows;
    galaxy.colExpanded = galaxy.colExpanded + (expansion - 1) * emptyCols;
  }
  let sum = 0;

  for (let i = 0; i < galaxies.length; i++) {
    const a = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const b = galaxies[j];
      sum +=
        Math.abs(a.rowExpanded - b.rowExpanded) +
        Math.abs(a.colExpanded - b.colExpanded);
    }
  }
  return sum;
}

const matchToGalaxy =
  (row: number) =>
  (m: RegExpExecArray): Galaxy => {
    const col = m.index;
    return {
      row,
      rowExpanded: row,
      col,
      colExpanded: col,
    };
  };

const parseLine = (l: string, li: number): Galaxy[] =>
  matchesToArray(l, /#/g, matchToGalaxy(li));
