import { min, parseNumberList, readData, sum } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const dimensions = data.map((d) => parseNumberList(d, 'x'));
  const wrappingPaper = dimensions.map((d) =>
    findWrappingPaper(d as [number, number, number])
  );
  return sum(wrappingPaper);
}

function findWrappingPaper(dimensions: [number, number, number]): number {
  const l = dimensions[0];
  const w = dimensions[1];
  const h = dimensions[2];

  const slack = min([l * w, w * h, h * l]);

  return 2 * l * w + 2 * w * h + 2 * h * l + slack;
}
