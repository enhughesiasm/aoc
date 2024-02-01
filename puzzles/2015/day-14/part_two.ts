import { extractNumbers, max, readData } from '../../../lib/shared.ts';

type Reindeer = {
  speed: number;
  flyTime: number;
  restTime: number;
  distanceTravelled: number;
  state: 'FLYING' | 'RESTING';
  since: number;
  score: number;
};
type Reindeers = Map<string, Reindeer>;

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const parsed = data.map((l) => parseReindeer(l));

  const reindeers: Reindeers = new Map();

  for (const reindeer of parsed) {
    reindeers.set(reindeer[0], {
      speed: reindeer[1],
      flyTime: reindeer[2],
      restTime: reindeer[3],
      distanceTravelled: 0,
      state: 'FLYING',
      since: 0,
      score: 0,
    });
  }

  const TOTAL_SECONDS = 2503;

  for (let time = 1; time <= TOTAL_SECONDS; time++) {
    for (const reindeer of reindeers) {
      tick(reindeer[0], reindeer[1], time);
    }

    addPointToWinningReindeer(reindeers);
  }

  const scores = Array.from(reindeers).map((r) => r[1].score);

  return max(scores);
}

function addPointToWinningReindeer(reindeers: Reindeers) {
  const arr = Array.from(reindeers);

  const maxDistance = max(arr.map((a) => a[1].distanceTravelled));

  for (const r of reindeers) {
    if (r[1].distanceTravelled === maxDistance) {
      r[1].score += 1;
    }
  }
}

function tick(name: string, reindeer: Reindeer, time: number) {
  switch (reindeer.state) {
    case 'FLYING':
      //console.log(`${name} flying ${reindeer.speed}`);
      reindeer.distanceTravelled += reindeer.speed;
      if (time - reindeer.since === reindeer.flyTime) {
        reindeer.since = time;
        reindeer.state = 'RESTING';
      }
      break;

    case 'RESTING':
      if (time - reindeer.since === reindeer.restTime) {
        reindeer.since = time;
        reindeer.state = 'FLYING';
      }
      break;
  }
}

function parseReindeer(line: string): [string, number, number, number] {
  const numbers = extractNumbers(line);

  return [line.split(' ')[0], numbers[0], numbers[1], numbers[2]];
}
