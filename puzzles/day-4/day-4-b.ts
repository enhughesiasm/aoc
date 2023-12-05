import { intersection, parseNumberList, readData, sum } from '../../shared.ts';
import chalk from 'chalk';

type Card = {
  id: number;
  numbersIHave: number[];
  winningNumbers: number[];
  amount: number;
};

export async function day4b(dataPath?: string) {
  const data = await readData(dataPath);

  const cards = data.map((line) => parseCard(line));

  for (let currentCardId = 1; currentCardId <= cards.length; currentCardId++) {
    cloneCardWithId(cards, currentCardId);
  }

  return sum(cards.map((c) => c.amount));
}

function cloneCardWithId(cards: Card[], currentCardId: number) {
  const currentCard = cards.find((c) => c.id === currentCardId);

  const cloneCount = intersection(
    currentCard.numbersIHave,
    currentCard.winningNumbers
  ).length;

  for (let i = 0; i < cloneCount; i++) {
    cards[currentCardId + i].amount += currentCard.amount;
  }
}

function parseCard(line: string): Card {
  const [cardId, bothNumberLists] = line.split(': ');

  const id = Number.parseInt(cardId.replace('Card ', ''));

  const [numbers, winning] = bothNumberLists.split(' | ');

  const numbersIHave = parseNumberList(numbers, ' ');
  const winningNumbers = parseNumberList(winning, ' ');

  return { id, numbersIHave, winningNumbers, amount: 1 };
}

const answer = await day4b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
