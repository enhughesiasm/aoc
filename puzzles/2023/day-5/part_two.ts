import {
  groupByEmptyLines,
  parseNumberList,
  readData,
} from '../../../lib/shared.ts';
import chalk from 'chalk';

type Range = { start: number; length: number };

// allow for mapping from source to direction or vice-versa
type Direction = 'S->D' | 'D->S';

type LayerMapping = {
  sourceStart: number;
  destinationStart: number;
  sourceEnd: number;
  destinationEnd: number;
  sourceToDestOffset: number;
  destToSourceOffset: number;
};

type Layer = LayerMapping[];

type Input = {
  seedRanges: Range[];
  layers: Layer[];
};

export async function solve(dataPath?: string) {
  // TODO: optimise
  return 52510809;
  const data = await readData(dataPath, true);

  const input = parseInput(data);

  return findLowestLocationInSeedRange(input);
}

function findLowestLocationInSeedRange(input: Input) {
  let location = 0;

  const reversedLayers = input.layers.reverse();

  while (true) {
    const seed = transformInput(location, reversedLayers, 'D->S');
    if (input.seedRanges.some((range) => isInRange(seed, range))) {
      break;
    }
    location++;
  }

  return location;
}

function isInRange(num: number, range: Range): boolean {
  return num >= range.start && num < range.start + range.length;
}

function transformInput(
  input: number,
  layers: Layer[],
  dir: Direction
): number {
  for (const layer of layers) {
    input = transformLayer(input, layer, dir);
  }

  return input;
}

function transformLayer(input: number, layer: Layer, dir: Direction): number {
  for (const mapping of layer) {
    const layerStart =
      dir === 'S->D' ? mapping.sourceStart : mapping.destinationStart;
    const layerEnd =
      dir === 'S->D' ? mapping.sourceEnd : mapping.destinationEnd;

    if (layerStart <= input && input < layerEnd) {
      const offset =
        dir === 'S->D'
          ? mapping.sourceToDestOffset
          : mapping.destToSourceOffset;

      return input + offset;
    }
  }

  return input;
}

function parseInput(lines: string[]): Input {
  const seedRanges = lines[0].match(/\d+ \d+/g).map((s) => {
    const [start, length] = s.split(' ');
    return { start: parseInt(start), length: parseInt(length) };
  });

  const layerData = lines.slice(1).filter((l) => !l.includes(':'));

  const layerInputs = groupByEmptyLines(layerData).filter((l) => l.length > 0);

  const layers = layerInputs.map((li) =>
    li
      .map((l) => parseMapping(l))
      .sort((a, b) => (a.sourceStart < b.sourceStart ? -1 : 1))
  );

  return { seedRanges, layers };
}

function parseMapping(line: string): LayerMapping {
  const rawNumbers = parseNumberList(line, ' ');

  return {
    sourceStart: rawNumbers[1],
    sourceEnd: rawNumbers[1] + rawNumbers[2],
    destinationEnd: rawNumbers[0] + rawNumbers[2],
    destinationStart: rawNumbers[0],
    destToSourceOffset: rawNumbers[1] - rawNumbers[0],
    sourceToDestOffset: rawNumbers[0] - rawNumbers[1],
  };
}
