import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = Array.from(data[0]);
  let loc: [number, number] = [0, 0];

  const visitedLocations: [number, number][] = [loc];

  for (const inst of instructions) {
    loc = getNextLocation(loc, inst);
    updateVisitedLocations(visitedLocations, loc);
  }

  return visitedLocations.length;
}

function updateVisitedLocations(
  visitedLocations: [number, number][],
  loc: [number, number]
): void {
  if (
    visitedLocations.filter((l) => l[0] === loc[0] && l[1] === loc[1])
      .length === 0
  ) {
    visitedLocations.push(loc);
  }
}

function getNextLocation(
  loc: [number, number],
  inst: string
): [number, number] {
  switch (inst) {
    case '^':
      return [loc[0], loc[1] + 1];
    case 'v':
      return [loc[0], loc[1] - 1];
    case '<':
      return [loc[0] - 1, loc[1]];
    case '>':
      return [loc[0] + 1, loc[1]];
    default:
      throw new Error('Unknown: ' + inst);
  }
}
