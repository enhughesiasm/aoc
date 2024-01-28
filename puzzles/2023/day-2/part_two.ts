import { numericOnly, readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

const MAX_ALLOWED_RED = 12;
const MAX_ALLOWED_GREEN = 13;
const MAX_ALLOWED_BLUE = 14;

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  let totalPower = 0;

  for (const line of data) {
    const game = parseLine(line);
    if (game === null) continue;

    const gamePower = game.maxRedSeen * game.maxBlueSeen * game.maxGreenSeen;
    totalPower += gamePower;
    // console.log(
    //   `Game ${game.id}: MinR: ${game.maxRedSeen}; MinG: ${game.maxGreenSeen}; MinB:${game.maxBlueSeen}; Power: ${gamePower}`
    // );
  }
  return totalPower;
}

function parseLine(line: string): {
  id: number;
  maxRedSeen: number;
  maxGreenSeen: number;
  maxBlueSeen: number;
  allPulls: Pull[];
} | null {
  if (!line || line.length === 0) return null;

  const parts = line.split(':');

  // const smarterSplitLine = line.split(/: |, |; /);

  const id = Number.parseInt(parts[0].replace('Game ', ''));

  const gamesInput = parts[1].split(';');

  let maxRedSeen = 0;
  let maxGreenSeen = 0;
  let maxBlueSeen = 0;

  const allPulls: Pull[] = [];

  for (const gameInput of gamesInput) {
    const pulls = gameInput.split(',');

    for (const pull of pulls) {
      const pullResult = parsePull(pull);
      allPulls.push(pullResult);
      switch (pullResult.colour) {
        case 'BLUE':
          if (pullResult.amount > maxBlueSeen) {
            maxBlueSeen = pullResult.amount;
          }
          break;
        case 'GREEN':
          if (pullResult.amount > maxGreenSeen) {
            maxGreenSeen = pullResult.amount;
          }
          break;
        case 'RED':
          if (pullResult.amount > maxRedSeen) {
            maxRedSeen = pullResult.amount;
          }
          break;
      }
    }
  }

  const parsed = { id: id, maxRedSeen, maxGreenSeen, maxBlueSeen, allPulls };

  return parsed;
}

type Pull = {
  colour: 'RED' | 'GREEN' | 'BLUE';
  amount: number;
};

function parsePull(pull: string): Pull {
  const amount = Number.parseInt(numericOnly(pull));

  const colour = pull.includes('red')
    ? 'RED'
    : pull.includes('blue')
    ? 'BLUE'
    : 'GREEN';

  return { amount, colour };
}
