import { numericOnly, parseNumberList, readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day6b(dataPath?: string) {
  const data = await readData(dataPath);

  const race = parseRace(data);

  const winCount = countWaysToWin(race);

  return winCount;
}

type Race = {
  previousRecord: number;
  distance: number;
};

function parseRace(lines: string[]): Race {
  const time = parseInt(numericOnly(lines[0].replace('Time: ', '')));
  const distance = parseInt(numericOnly(lines[1].replace('Distance: ', '')));

  return { previousRecord: time, distance: distance };
}

function countWaysToWin(race: Race) {
  let winCount = 0;

  for (let i = 1; i < race.previousRecord; i++) {
    if (doesRaceWin(i, race)) {
      winCount++;
    }
  }

  return winCount;
}

function doesRaceWin(buttonTime: number, race: Race): boolean {
  // buttonTime = velocity
  const timeRemaining = race.previousRecord - buttonTime;

  const totalDistanceTravelled = buttonTime * timeRemaining;

  return totalDistanceTravelled > race.distance;
}

const answer = await day6b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
