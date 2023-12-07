import { readData } from '../../shared.ts';
import chalk from 'chalk';

const CARD_KINDS = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
] as const;
type Card = (typeof CARD_KINDS)[number];

const HAND_KINDS = [
  '5_KIND',
  '4_KIND',
  'FULL_HOUSE',
  '3_KIND',
  'TWO_PAIR',
  'ONE_PAIR',
  'HIGH_CARD',
] as const;

type HandKind = (typeof HAND_KINDS)[number];

type Hand = {
  cards: Card[];
  kind: HandKind;
  bid: number;
};

export async function day7a(dataPath?: string) {
  const data = await readData(dataPath);

  const hands = data.map((l) => parseHand(l));

  const orderedHands = orderHandsByStrength(hands);

  return scoreAllHands(orderedHands);
}

function scoreAllHands(hands: Hand[]): number {
  let totalWinnings = 0;

  hands.forEach((hand, index) => {
    const rank = hands.length - index;
    totalWinnings += hand.bid * rank;
  });

  return totalWinnings;
}

function orderHandsByStrength(hands: Hand[]): Hand[] {
  return [...hands].sort((a, b) => compareHands(a, b));
}

function compareHands(a: Hand, b: Hand): 1 | 0 | -1 {
  const aStrength = HAND_KINDS.indexOf(a.kind);
  const bStrength = HAND_KINDS.indexOf(b.kind);

  if (aStrength !== bStrength) {
    return aStrength > bStrength ? 1 : -1;
  }

  // hands have equal strength so highest card by original draw order wins
  for (let i = 0; i < 5; i++) {
    const cardAStrength = CARD_KINDS.indexOf(a.cards[i]);
    const cardBStrength = CARD_KINDS.indexOf(b.cards[i]);

    if (cardAStrength !== cardBStrength) {
      return cardAStrength > cardBStrength ? 1 : -1;
    }
  }

  return 0;
}

export function parseHand(line: string): Hand {
  const parts = line.split(' ');

  const bid = parseInt(parts[1]);
  const cards = Array.from(parts[0]) as Card[];

  const handKind = calculateHandKind(cards);

  return {
    cards: cards,
    kind: handKind,
    bid,
  };
}

function calculateHandKind(cards: Card[]): HandKind {
  const jokerCount = cards.filter((c) => c === 'J').length;
  if (jokerCount === 5) return '5_KIND';

  const charCountMap = new Map<Card, number>();

  for (const char of cards.filter((c) => c !== 'J')) {
    if (charCountMap.has(char)) {
      charCountMap.set(char, charCountMap.get(char)! + 1);
    } else {
      charCountMap.set(char, 1);
    }
  }

  const charCountArray: [string, number][] = Array.from(charCountMap.entries());

  charCountArray.sort((a, b) => b[1] - a[1]);

  const count = charCountArray[0][1];
  if (count > 5) {
    throw new Error('Wrong assumption!');
  }
  if (count === 5) {
    return '5_KIND';
  } else if (count === 4) {
    if (jokerCount === 1) return '5_KIND';
    return '4_KIND';
  } else if (
    count === 3 &&
    charCountArray.length > 1 &&
    charCountArray[1][1] === 2
  ) {
    return 'FULL_HOUSE';
  } else if (count === 3) {
    if (jokerCount === 2) return '5_KIND';
    else if (jokerCount === 1) return '4_KIND';
    return '3_KIND';
  } else if (count === 2) {
    if (charCountArray.length > 1 && charCountArray[1][1] === 2) {
      if (jokerCount === 1) {
        return 'FULL_HOUSE';
      } else if (jokerCount !== 0) {
        throw new Error('Weird FULL_HOUSE');
      }
      return 'TWO_PAIR';
    } else {
      if (jokerCount === 3) {
        return '5_KIND';
      } else if (jokerCount === 2) {
        return '4_KIND';
      } else if (jokerCount === 1) {
        return '3_KIND';
      } else if (jokerCount !== 0) {
        throw new Error('Weird pair');
      }
      return 'ONE_PAIR';
    }
  }

  if (jokerCount === 5) {
    return '5_KIND';
  } else if (jokerCount === 4) {
    return '5_KIND';
  } else if (jokerCount === 3) {
    return '4_KIND';
  } else if (jokerCount === 2) {
    return '3_KIND';
  } else if (jokerCount === 1) {
    return 'ONE_PAIR';
  }

  return 'HIGH_CARD';
}

const answer = await day7a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
