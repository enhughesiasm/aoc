import { numericOnly, parseNumberList, readData } from '../../shared.ts';
import chalk from 'chalk';

type Race = {
  previousRecord: number;
  distance: number;
};

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  const race = parseRace(data);

  const winCount = countWaysToWin(race);

  return winCount;
}

function parseRace(lines: string[]): Race {
  const time = parseInt(numericOnly(lines[0].replace('Time: ', '')));
  const distance = parseInt(numericOnly(lines[1].replace('Distance: ', '')));

  return { previousRecord: time, distance: distance };
}

function countWaysToWin(race: Race) {
  // the part 1 solution works here...

  // but we don't need to know EVERY win, just the first win and the last win

  // (every solution is an upside-down parabola, so finding the two roots gives us first and last)

  // distance = time * x - x & 2
  // x^2 - tx - d = 0
  const discriminant = Math.sqrt(
    race.previousRecord * race.previousRecord - 4 * race.distance
  );

  // we can only hold the button for integer amounts of time so floor/ceil the top/bottom respectively
  const maxRoot = Math.floor((race.previousRecord + discriminant) / 2);
  const minRoot = Math.ceil((race.previousRecord - discriminant) / 2);

  const count = maxRoot - minRoot + 1;

  return count;
}

const answer = await day6b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
