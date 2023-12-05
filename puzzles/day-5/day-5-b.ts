import { off, sourceMapsEnabled } from 'process';
import { groupByEmptyLines, parseNumberList, readData } from '../../shared.ts';
import chalk from 'chalk';

type SeedRange = { start: number; length: number };

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
  seedRanges: SeedRange[];
  layers: Layer[];
};

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath, true);

  const input = parseInput(data);

  return findLowestLocationInSeedRange(input);
}

function findLowestLocationInSeedRange(input: Input) {
  let location = 0;

  const reversedLayers = input.layers.reverse();

  while (true) {
    const seed = transformInput(location, reversedLayers, 'DEST-SOURCE');
    if (input.seedRanges.some((range) => isInRange(seed, range))) {
      break;
    }
    location++;
  }

  return location;
}

function isInRange(num: number, range: SeedRange): boolean {
  return num >= range.start && num < range.start + range.length;
}

function transformInput(
  input: number,
  layers: Layer[],
  dir: 'SOURCE-DEST' | 'DEST-SOURCE'
): number {
  for (const layer of layers) {
    input = transformLayer(input, layer, dir);
  }

  return input;
}

function transformLayer(
  input: number,
  layer: Layer,
  dir: 'SOURCE-DEST' | 'DEST-SOURCE'
): number {
  for (const mapping of layer) {
    const layerStart =
      dir === 'SOURCE-DEST' ? mapping.sourceStart : mapping.destinationStart;
    const layerEnd =
      dir === 'SOURCE-DEST' ? mapping.sourceEnd : mapping.destinationEnd;

    if (layerStart <= input && input < layerEnd) {
      const offset =
        dir === 'SOURCE-DEST'
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

const answer = await day5b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
