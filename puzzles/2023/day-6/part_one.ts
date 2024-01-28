import { parseNumberList, readData } from '../../../lib/shared.ts';

type Race = {
  previousRecord: number;
  distance: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const races = parseRaces(data);

  const winCounts = races.map((r) => countWaysToWin(r));

  const answer = winCounts.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1
  );

  return answer;
}

function parseRaces(lines: string[]): Race[] {
  const times = parseNumberList(lines[0].replace('Time: ', ''), ' ');
  const distances = parseNumberList(lines[1].replace('Distance: ', ''), ' ');

  const races: Race[] = [];

  for (let i = 0; i < times.length; i++) {
    races.push({ previousRecord: times[i], distance: distances[i] });
  }

  return races;
}

function countWaysToWin(race: Race) {
  let winCount = 0;

  for (let i = 1; i < race.previousRecord; i++) {
    if (doesRaceWin(i, race)) winCount++;
  }

  return winCount;
}

function doesRaceWin(buttonTime: number, race: Race): boolean {
  // buttonTime = velocity
  const timeRemaining = race.previousRecord - buttonTime;

  const totalDistanceTravelled = buttonTime * timeRemaining;

  return totalDistanceTravelled > race.distance;
}
