import { extractNumbers, readData } from '../../../lib/shared.ts';

type Sue = {
  children?: number;
  cats?: number;
  samoyeds?: number;
  pomeranians?: number;
  akitas?: number;
  vizslas?: number;
  goldfish?: number;
  trees?: number;
  cars?: number;
  perfumes?: number;
};

const PROPERTIES = [
  'children',
  'cats',
  'samoyeds',
  'pomeranians',
  'akitas',
  'vizslas',
  'goldfish',
  'trees',
  'cars',
  'perfumes',
];

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const sues = data.map(parseSue);

  const trueSue = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
  };

  for (const sue of sues) {
    let candidate = true;
    PROPERTIES.forEach((p) => {
      switch (p) {
        case 'cats':
        case 'trees':
          if (sue[p] !== undefined && sue[p] <= trueSue[p]) {
            candidate = false;
          }
          break;
        case 'pomeranians':
        case 'goldfish':
          if (sue[p] !== undefined && sue[p] >= trueSue[p]) {
            candidate = false;
          }
          break;
        default:
          if (sue[p] !== undefined && sue[p] !== trueSue[p]) {
            candidate = false;
          }
      }
    });
    if (candidate) {
      return sue.id;
    }
  }

  return 'FAILED';
}

function parseSue(l: string): Sue & { id: number } {
  const id = extractNumbers(l)[0];

  const sue: Sue & { id: number } = { id: id };

  const parts = l.split(': ');
  parts.shift();

  const properties = parts.join(': ');

  for (const property of properties.split(',')) {
    const propParts = property.split(':').map((x) => x.trim());

    sue[propParts[0]] = extractNumbers(propParts[1])[0];
  }

  return sue;
}
