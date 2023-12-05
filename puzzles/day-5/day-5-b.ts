import { parseNumberList, readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day5b(dataPath?: string) {
  const data = await readData(dataPath);
  const parsed = parseData(data);

  //return getBruteForceResult(parsed); // a few minutes
  return getReversedResult(parsed);
}

function getReversedResult(parsed: ParsedData): number {
  let location = 0;

  while (true) {
    if (!doesLocationHaveValidSeed(parsed, location)) {
      location++;
    } else {
      break;
    }
  }

  return location;
}

function getBruteForceResult(parsed: ParsedData): number {
  let lowestLocation = Infinity;

  let currentRange = 1;

  for (const seed of parsed.initialSeeds) {
    lowestLocation = findLowestLocationForSeedRange(
      parsed,
      seed,
      lowestLocation,
      currentRange,
      parsed.initialSeeds.length
    );

    currentRange++;
  }

  return lowestLocation;
}

type Category =
  | 'SEED'
  | 'SOIL'
  | 'FERTILIZER'
  | 'WATER'
  | 'LIGHT'
  | 'TEMPERATURE'
  | 'HUMIDITY'
  | 'LOCATION';

type CategoryMap<In extends Category, Out extends Category> = {
  in: In;
  out: Out;
  valueRanges: {
    destinationStart: number;
    sourceStart: number;
    rangeLength: number;
  }[];
};

const PARSE_MODES = [
  'none',
  'seeds:',
  'seed-to-soil map:',
  'soil-to-fertilizer map:',
  'fertilizer-to-water map:',
  'water-to-light map:',
  'light-to-temperature map:',
  'temperature-to-humidity map:',
  'humidity-to-location map:',
] as const;

type ParseMode = (typeof PARSE_MODES)[number];

type SeedRange = { start: number; length: number };

type ParsedData = {
  initialSeeds: SeedRange[];
  seedToSoil: CategoryMap<'SEED', 'SOIL'>;
  soilToFertilizer: CategoryMap<'SOIL', 'FERTILIZER'>;
  fertilizerToWater: CategoryMap<'FERTILIZER', 'WATER'>;
  waterToLight: CategoryMap<'WATER', 'LIGHT'>;
  lightToTemperature: CategoryMap<'LIGHT', 'TEMPERATURE'>;
  temperatureToHumidity: CategoryMap<'TEMPERATURE', 'HUMIDITY'>;
  humidityToLocation: CategoryMap<'HUMIDITY', 'LOCATION'>;
};

function parseData(lines: string[]): ParsedData {
  lines = lines.filter((l) => l.length > 0);
  let parseMode: ParseMode = 'none';
  const initialSeeds: SeedRange[] = [];
  const seedToSoil: CategoryMap<'SEED', 'SOIL'> = {
    in: 'SEED',
    out: 'SOIL',
    valueRanges: [],
  };
  const soilToFertilizer: CategoryMap<'SOIL', 'FERTILIZER'> = {
    in: 'SOIL',
    out: 'FERTILIZER',
    valueRanges: [],
  };
  const fertilizerToWater: CategoryMap<'FERTILIZER', 'WATER'> = {
    in: 'FERTILIZER',
    out: 'WATER',
    valueRanges: [],
  };
  const waterToLight: CategoryMap<'WATER', 'LIGHT'> = {
    in: 'WATER',
    out: 'LIGHT',
    valueRanges: [],
  };
  const lightToTemperature: CategoryMap<'LIGHT', 'TEMPERATURE'> = {
    in: 'LIGHT',
    out: 'TEMPERATURE',
    valueRanges: [],
  };
  const temperatureToHumidity: CategoryMap<'TEMPERATURE', 'HUMIDITY'> = {
    in: 'TEMPERATURE',
    out: 'HUMIDITY',
    valueRanges: [],
  };
  const humidityToLocation: CategoryMap<'HUMIDITY', 'LOCATION'> = {
    in: 'HUMIDITY',
    out: 'LOCATION',
    valueRanges: [],
  };
  for (const line of lines) {
    if (isParseMode(line)) {
      parseMode = line;
      continue;
    }

    if (line.startsWith('seeds')) {
      const rawNumbers = parseNumberList(
        line.replace('seeds:', '').trim(),
        ' '
      );
      if (rawNumbers.length % 2 !== 0)
        throw new Error('Seed numbers must come in pairs!');

      for (let i = 0; i < rawNumbers.length; i += 2) {
        initialSeeds.push({ start: rawNumbers[i], length: rawNumbers[i + 1] });
      }
      continue;
    }

    switch (parseMode) {
      case 'fertilizer-to-water map:':
        addValuesToMap<'FERTILIZER', 'WATER'>(line, fertilizerToWater);
        break;
      case 'humidity-to-location map:':
        addValuesToMap<'HUMIDITY', 'LOCATION'>(line, humidityToLocation);
        break;
      case 'light-to-temperature map:':
        addValuesToMap<'LIGHT', 'TEMPERATURE'>(line, lightToTemperature);
        break;
      case 'seed-to-soil map:':
        addValuesToMap<'SEED', 'SOIL'>(line, seedToSoil);
        break;
      case 'soil-to-fertilizer map:':
        addValuesToMap<'SOIL', 'FERTILIZER'>(line, soilToFertilizer);
        break;
      case 'temperature-to-humidity map:':
        addValuesToMap<'TEMPERATURE', 'HUMIDITY'>(line, temperatureToHumidity);
        break;
      case 'water-to-light map:':
        addValuesToMap<'WATER', 'LIGHT'>(line, waterToLight);
        break;
    }
  }

  return {
    initialSeeds,
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  };
}

function doesLocationHaveValidSeed(
  allMaps: ParsedData,
  location: number
): boolean {
  const humidity = calculateSource<'HUMIDITY', 'LOCATION'>(
    allMaps.humidityToLocation,
    location
  );

  const temperature = calculateSource<'TEMPERATURE', 'HUMIDITY'>(
    allMaps.temperatureToHumidity,
    humidity
  );

  const light = calculateSource<'LIGHT', 'TEMPERATURE'>(
    allMaps.lightToTemperature,
    temperature
  );
  const water = calculateSource<'WATER', 'LIGHT'>(allMaps.waterToLight, light);
  const fertilizer = calculateSource<'FERTILIZER', 'WATER'>(
    allMaps.fertilizerToWater,
    water
  );
  const soil = calculateSource<'SOIL', 'FERTILIZER'>(
    allMaps.soilToFertilizer,
    fertilizer
  );
  const seed = calculateSource<'SEED', 'SOIL'>(allMaps.seedToSoil, soil);

  for (const seedRange of allMaps.initialSeeds) {
    if (isInRange(seed, seedRange)) return true;
  }

  return false;
}

function isInRange(num: number, range: SeedRange) {
  return range.start <= num && num < range.start + range.length;
}

function findLowestLocationForSeedRange(
  allMaps: ParsedData,
  range: SeedRange,
  lowestLocation: number,
  currentRange: number,
  totalRanges: number
) {
  console.log(`Starting range ${currentRange} of ${totalRanges}...`);

  let progress = 0;

  for (let i = range.start; i < range.start + range.length; i++) {
    const newLocation = findLocationForSeedValue(allMaps, i);
    if (newLocation < lowestLocation) {
      lowestLocation = newLocation;
    }

    const currentStatus = i - range.start;
    const percentCompletion = Math.floor((currentStatus * 100) / range.length);

    if (progress !== percentCompletion) {
      progress = percentCompletion;
      console.log(`${progress}%`);
    }
  }
  console.log(`Ending range ${currentRange} of ${totalRanges}...`);
  console.log(`Current answer: ${lowestLocation}`);
  return lowestLocation;
}

function findLocationForSeedValue(allMaps: ParsedData, seedValue: number) {
  const soilNumber = calculateDestination<'SEED', 'SOIL'>(
    allMaps.seedToSoil,
    seedValue
  );
  const fertilizer = calculateDestination<'SOIL', 'FERTILIZER'>(
    allMaps.soilToFertilizer,
    soilNumber
  );

  const water = calculateDestination<'FERTILIZER', 'WATER'>(
    allMaps.fertilizerToWater,
    fertilizer
  );

  const light = calculateDestination<'WATER', 'LIGHT'>(
    allMaps.waterToLight,
    water
  );
  const temperature = calculateDestination<'LIGHT', 'TEMPERATURE'>(
    allMaps.lightToTemperature,
    light
  );
  const humidity = calculateDestination<'TEMPERATURE', 'HUMIDITY'>(
    allMaps.temperatureToHumidity,
    temperature
  );

  const location = calculateDestination<'HUMIDITY', 'LOCATION'>(
    allMaps.humidityToLocation,
    humidity
  );

  return location;
}

function calculateDestination<In extends Category, Out extends Category>(
  map: CategoryMap<In, Out>,
  source: number
): number {
  for (const valueRange of map.valueRanges) {
    if (
      valueRange.sourceStart <= source &&
      source < valueRange.sourceStart + valueRange.rangeLength
    ) {
      // we're in this range!
      const offset = source - valueRange.sourceStart;
      return valueRange.destinationStart + offset;
    }
  }

  // doesn't exist, so destination = source
  return source;
}

function calculateSource<In extends Category, Out extends Category>(
  map: CategoryMap<In, Out>,
  destination: number
): number {
  for (const valueRange of map.valueRanges) {
    if (
      valueRange.destinationStart <= destination &&
      destination < valueRange.destinationStart + valueRange.rangeLength
    ) {
      // we're in this range!
      const offset = destination - valueRange.destinationStart;
      return valueRange.sourceStart + offset;
    }
  }

  // doesn't exist, so destination = source
  return destination;
}

function addValuesToMap<In extends Category, Out extends Category>(
  line: string,
  map: CategoryMap<In, Out>
) {
  const list = parseNumberList(line, ' ');
  if (list.length !== 3) throw new Error('Parse error with line ' + line);

  map.valueRanges.push({
    destinationStart: list[0],
    sourceStart: list[1],
    rangeLength: list[2],
  });
}

function isParseMode(input: string): input is ParseMode {
  return PARSE_MODES.includes(input as ParseMode);
}

const answer = await day5b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
