import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = Array.from(data[0]);
  let santaLoc: [number, number] = [0, 0];
  let roboLoc: [number, number] = [0, 0];
  const visitedLocations: [number, number][] = [santaLoc];

  for (let i = 0; i < instructions.length; i++) {
    if (i % 2 === 0) {
      santaLoc = getNextLocation(santaLoc, instructions[i]);
      updateVisitedLocations(visitedLocations, santaLoc);
    } else {
      roboLoc = getNextLocation(roboLoc, instructions[i]);
      updateVisitedLocations(visitedLocations, roboLoc);
    }
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
