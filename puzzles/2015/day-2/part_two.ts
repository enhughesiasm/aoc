import { parseNumberList, readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const dimensions = data.map((d) => parseNumberList(d, 'x'));
  const ribbonLength = dimensions.map((d) =>
    findRibbonLength(d as [number, number, number])
  );
  return sum(ribbonLength);
}

function findRibbonLength(dimensions: [number, number, number]): number {
  const l = dimensions[0];
  const w = dimensions[1];
  const h = dimensions[2];

  const smallestTwoSides = dimensions
    .sort((a, b) => (a > b ? 1 : -1))
    .slice(0, 2);

  const wrapRibbon = sum(smallestTwoSides.map((s) => 2 * s));

  const bowRibbon = l * w * h;

  // console.log(`${wrapRibbon} ${bowRibbon} ${bowRibbon + wrapRibbon}`);

  return wrapRibbon + bowRibbon;
}
