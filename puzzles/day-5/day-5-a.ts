import { min, parseNumberList, readData } from '../../shared.ts';
import chalk from 'chalk';

export async function day5a(dataPath?: string) {
  const data = await readData(dataPath);
  const parsed = parseData(data);
  const allLocations: number[] = [];

  for (const seed of parsed.initialSeeds) {
    allLocations.push(findLocationForSeed(parsed, seed));
  }

  return min(allLocations);
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

type ParsedData = {
  initialSeeds: number[];
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
  let initialSeeds: number[] = [];
  let seedToSoil: CategoryMap<'SEED', 'SOIL'> = {
    in: 'SEED',
    out: 'SOIL',
    valueRanges: [],
  };
  let soilToFertilizer: CategoryMap<'SOIL', 'FERTILIZER'> = {
    in: 'SOIL',
    out: 'FERTILIZER',
    valueRanges: [],
  };
  let fertilizerToWater: CategoryMap<'FERTILIZER', 'WATER'> = {
    in: 'FERTILIZER',
    out: 'WATER',
    valueRanges: [],
  };
  let waterToLight: CategoryMap<'WATER', 'LIGHT'> = {
    in: 'WATER',
    out: 'LIGHT',
    valueRanges: [],
  };
  let lightToTemperature: CategoryMap<'LIGHT', 'TEMPERATURE'> = {
    in: 'LIGHT',
    out: 'TEMPERATURE',
    valueRanges: [],
  };
  let temperatureToHumidity: CategoryMap<'TEMPERATURE', 'HUMIDITY'> = {
    in: 'TEMPERATURE',
    out: 'HUMIDITY',
    valueRanges: [],
  };
  let humidityToLocation: CategoryMap<'HUMIDITY', 'LOCATION'> = {
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
      initialSeeds = parseNumberList(line.replace('seeds:', '').trim(), ' ');
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

function findLocationForSeed(allMaps: ParsedData, seedValue: number) {
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
      source <= valueRange.sourceStart + valueRange.rangeLength
    ) {
      // we're in this range!
      const offset = source - valueRange.sourceStart;
      return valueRange.destinationStart + offset;
    }
  }

  // doesn't exist, so destination = source
  return source;
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

const answer = await day5a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
