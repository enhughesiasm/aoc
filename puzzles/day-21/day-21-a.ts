import { ALL_CARTESIAN_DIRECTIONS, readData, replaceAt } from '../../shared.ts';
import chalk from 'chalk';

export async function day21a(dataPath?: string) {
  const data = await readData(dataPath);

  const start = findStart(data);

  const plotsReached = walk(data, start, 64);

  return plotsReached.size;
}

function walk(rows: string[], start: [number, number], totalSteps: number) {
  const allVisited = new Set<string>();
  const destinationsReached = new Set<string>();

  const queue: Array<[number, number, number]> = [[...start, totalSteps]];

  while (queue.length > 0) {
    const current = queue.shift();
    exploreFromPosition(rows, current, destinationsReached, allVisited, queue);
  }

  return destinationsReached;
}

function getKey(pos: [number, number]): string {
  return `${pos[0]}_${pos[1]}`;
}

function getKey3(state: [number, number, number]): string {
  return `${state[0]}_${state[1]}_${state[2]}`;
}

function exploreFromPosition(
  rows: string[],
  current: [number, number, number], // x, y, stepsRemaining
  plotsReached: Set<string>,
  allVisited: Set<string>,
  queue: Array<[number, number, number]> // x, y, stepsRemaining
) {
  for (let i = 1; i <= current[2]; i++) {
    ALL_CARTESIAN_DIRECTIONS.forEach((dir) => {
      const result = tryWalk(rows, [current[0], current[1]], dir);
      if (result !== false) {
        // console.log(`✅ Moved to ${JSON.stringify(result)}`);

        const newState: [number, number, number] = [...result, current[2] - 1];
        if (!allVisited.has(getKey3(newState))) {
          queue.push(newState);
          allVisited.add(getKey3(newState));
        }

        // if final step, store where we arrived
        if (current[2] === 1) {
          plotsReached.add(getKey(result));
        }
      }
    });
  }
}

function tryWalk(
  rows: string[],
  pos: [number, number],
  dir: [number, number]
): false | [number, number] {
  //console.log(`🧍‍♂️ Try walk ${JSON.stringify(dir)} from ${JSON.stringify(pos)}`);

  const newPos: [number, number] = [pos[0] + dir[0], pos[1] + dir[1]];
  if (
    newPos[1] >= rows.length ||
    newPos[1] < 0 ||
    newPos[0] >= rows[0].length ||
    newPos[0] < 0
  ) {
    //console.log(`🚧 OOB at ${JSON.stringify(newPos)}`);
    return false;
  }

  if (rows[newPos[1]][newPos[0]] === '#') {
    // console.log(`🧱 Wall at ${JSON.stringify(newPos)}`);
    return false;
  }

  // console.log(`🚶 Moved to ${JSON.stringify(newPos)}`);
  return newPos;
}

function findStart(rows: string[]): [number, number] {
  for (let row = 0; row < rows.length; row++) {
    if (rows[row].includes('S')) {
      for (let col = 0; col < rows[0].length; col++) {
        if (rows[row][col] === 'S') {
          rows[row] = replaceAt(rows[row], col, '.');
          return [col, row];
        }
      }
    }
  }
}

const answer = await day21a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
