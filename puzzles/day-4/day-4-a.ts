import { intersection, readData } from '../../shared.ts';
import chalk from 'chalk';

type Card = {
  id: number;
  numbersIHave: number[];
  winningNumbers: number[];
};

export async function day4a(dataPath?: string) {
  const data = await readData(dataPath);

  let points = 0;

  const cards = data.map((d) => parseLine(d));

  for (const card of cards) {
    console.log(JSON.stringify(card));

    const cardWinningNumbers = intersection(
      card.numbersIHave,
      card.winningNumbers
    );

    if (cardWinningNumbers.length > 0) {
      points += Math.pow(2, cardWinningNumbers.length - 1);
    }
  }

  return points;
}

function parseLine(line: string): Card {
  const parts = line.split(':');

  const id = Number.parseInt(parts[0].replace('Card ', ''));

  const numberLists = parts[1].split('|');

  const numbersIHave = numberLists[0]
    .trim()
    .replaceAll('  ', ' ')
    .split(' ')
    .map((n) => parseInt(n))
    .filter((n) => n !== null);
  const winningNumbers = numberLists[1]
    .trim()
    .replaceAll('  ', ' ')
    .split(' ')
    .map((n) => parseInt(n))
    .filter((n) => n !== null);

  return { id, numbersIHave, winningNumbers };
}

const answer = await day4a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
