import { max, readData } from '../../../lib/shared.ts';

type SeatPairing = {
  person: string;
  neighbour: string;
  happinessGain: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const pairings = data.map((l) => parseLine(l));

  const people = new Set<string>();

  for (const pair of pairings) {
    people.add(pair.person);
  }

  people.add('MYSELF');

  const permutations = getPermutations(Array.from(people));

  let maxHappiness = 0;

  for (const permutation of permutations) {
    const happiness = findNetHappiness(permutation, pairings);

    if (happiness > maxHappiness) maxHappiness = happiness;
  }

  return maxHappiness;
}

function findNetHappiness(
  nameOrder: string[],
  pairings: SeatPairing[]
): number {
  let happiness = 0;
  for (let i = 1; i < nameOrder.length; i++) {
    happiness += getTwoWayHappiness(nameOrder[i - 1], nameOrder[i], pairings);
  }

  happiness += getTwoWayHappiness(
    nameOrder[nameOrder.length - 1],
    nameOrder[0],
    pairings
  );

  return happiness;
}

function getTwoWayHappiness(
  person: string,
  neighbour: string,
  pairings: SeatPairing[]
): number {
  if (person === 'MYSELF' || neighbour === 'MYSELF') return 0;

  return (
    pairings.find((p) => p.person === person && p.neighbour === neighbour)
      .happinessGain +
    pairings.find((p) => p.person === neighbour && p.neighbour === person)
      .happinessGain
  );
}

// TODO: this is very optimisable - currently a lot of the permutations we generate will duplicate
// one another
function getPermutations(people: string[]) {
  const result = [];

  function permute<T>(current: T[], remaining: T[]) {
    if (remaining.length === 0) {
      result.push([...current]);
      return;
    }

    for (let i = 0; i < remaining.length; i++) {
      const rest = remaining.slice(0, i).concat(remaining.slice(i + 1));
      permute(current.concat(remaining[i]), rest);
    }
  }

  permute([], people);
  return result;
}

function parseLine(line: string): SeatPairing {
  line = line
    .replace(' happiness units by sitting next to ', ',')
    .replace('.', '')
    .replace(' would ', '')
    .replace('gain ', ',+')
    .replace('lose ', ',-');

  const parts = line.split(',');

  return {
    person: parts[0],
    neighbour: parts[2],
    happinessGain: Number.parseInt(parts[1]),
  };
}
