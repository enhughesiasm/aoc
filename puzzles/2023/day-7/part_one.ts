import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

// This code is very bad. I will not be improving it.

const CARD_KINDS = [
  'A',
  'K',
  'Q',
  'J',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
];
type Card = (typeof CARD_KINDS)[number];

const HAND_KINDS = [
  '5',
  '4',
  'FULL_HOUSE',
  '3',
  'TWO_PAIR',
  'ONE_PAIR',
  'HIGH_CARD',
];

type HandKind = (typeof HAND_KINDS)[number];

type HandKindWithCards = { handKind: HandKind; cards: Card[] };

type Hand = {
  cards: Card[];
  sortedCards: Card[];
  kind: HandKindWithCards;
  bid: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const hands: Hand[] = [];

  for (const line of data) {
    const hand = parseLine(line);
    hands.push(hand);
  }

  const orderedHands = orderHandsByStrength(hands);

  let totalWinnings = 0;

  for (let i = 0; i < orderedHands.length; i++) {
    const rank = orderedHands.length - i;

    const handWinnings = orderedHands[i].bid * rank;
    //console.log(`rank ${rank} * ${orderedHands[i].bid} = ${handWinnings}`);
    totalWinnings += handWinnings;
  }

  return totalWinnings;
}

function orderHandsByStrength(hands: Hand[]): Hand[] {
  return [...hands].sort((a, b) => compareHands(a, b));
}

function compareHands(a: Hand, b: Hand): 1 | 0 | -1 {
  const aStrength = HAND_KINDS.indexOf(a.kind.handKind);
  const bStrength = HAND_KINDS.indexOf(b.kind.handKind);

  if (aStrength !== bStrength) {
    return aStrength < bStrength ? -1 : 1;
  }

  // equal strength so highest card in original draw order wins
  for (let i = 0; i < 5; i++) {
    const cardAStrength = CARD_KINDS.indexOf(a.cards[i]);
    const cardBStrength = CARD_KINDS.indexOf(b.cards[i]);

    if (cardAStrength !== cardBStrength) {
      return cardAStrength < cardBStrength ? -1 : 1;
    }
  }

  return 0;
}

function parseLine(line: string): Hand {
  const parts = line.split(' ');

  const bid = parseInt(parts[1]);

  const cards: Card[] = [];
  for (const c of parts[0]) {
    cards.push(c as Card);
  }

  const sortedCards = [...cards].sort((a, b) =>
    CARD_KINDS.indexOf(a) > CARD_KINDS.indexOf(b) ? 1 : -1
  );

  const handKind = calculateHandKind(sortedCards);

  return {
    cards: cards,
    sortedCards: sortedCards,
    kind: handKind,
    bid,
  };
}

function calculateHandKind(cards: Card[]): HandKindWithCards {
  const charCountMap = new Map<Card, number>();

  for (const char of cards) {
    if (charCountMap.has(char)) {
      charCountMap.set(char, charCountMap.get(char)! + 1);
    } else {
      charCountMap.set(char, 1);
    }
  }

  const charCountArray: [string, number][] = Array.from(charCountMap.entries());

  charCountArray.sort((a, b) => b[1] - a[1]);

  for (let i = 0; i < charCountArray.length; i++) {
    const char = charCountArray[i][0];
    const count = charCountArray[i][1];
    if (count === 5) {
      return { handKind: '5', cards: [char] };
    } else if (count === 4) {
      return { handKind: '4', cards: [char] };
    } else if (count === 3 && charCountArray[i + 1][1] === 2) {
      return {
        handKind: 'FULL_HOUSE',
        cards: [char, charCountArray[i + 1][0]],
      };
    } else if (count === 3) {
      return { handKind: '3', cards: [char] };
    } else if (count === 2) {
      if (charCountArray[i + 1][1] === 2) {
        return {
          handKind: 'TWO_PAIR',
          cards: [char, charCountArray[i + 1][0]],
        };
      } else {
        return { handKind: 'ONE_PAIR', cards: [char] };
      }
    }

    return { handKind: 'HIGH_CARD', cards: [char] };
  }
}

function isFirstCardStronger(first: Card, second: Card): boolean {
  return CARD_KINDS.indexOf(first) < CARD_KINDS.indexOf(second);
}
