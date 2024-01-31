import chalk from 'chalk';
import { extractNumbers } from '../lib/shared';
import { promises as fsPromises } from 'fs';

function parseArgument(s: string): number {
  const parts = extractNumbers(s);

  if (parts.length !== 1)
    throw new Error('Please run `npm run gen YYYY` for the year to generate');

  const year = parts[0];

  if (year < 2015) throw new Error(`Year ${year} is too low`);
  if (year > 2030) throw new Error(`Year ${year} is too high`);

  return year;
}

const args = process.argv.slice(2);

if (args.length !== 1)
  throw new Error('Please run `npm run gen YYYY` for the year to generate');

generateYear(parseArgument(args[0]));

async function generateYear(year: number) {
  const yearFolder = getPath(year);
  const exists = await folderExists(yearFolder);

  if (exists) throw new Error('Folder exists for ' + year);

  await performGenerateYear(yearFolder, year);
  console.log(
    chalk.bgGreen(' Success! '),
    chalk.green(year + ' has been generated.')
  );

  console.log(
    chalk.bgBlue('  Next:   '),
    chalk.blue(`- Run "npm start ${year}_DD_1" for part 1 of day DD.`)
  );
  console.log(
    chalk.bgBlue('          '),
    chalk.blue(
      `- "npm start ${year}_DD_2:sample" for part 2 of day DD using sample data.`
    )
  );
  console.log(
    chalk.bgBlue('          '),
    chalk.blue(
      `- Paste your inputs from AOC (sample/actual) into the txt files for that day.`
    )
  );
  console.log(
    chalk.bgRedBright('    !     '),
    chalk.red(
      `* Add your answers to the array in "${year}.test.ts" after each solve.`
    )
  );
}

function getPath(year: number): string {
  return './puzzles/' + year + '/';
}

async function performGenerateYear(yearFolder: string, year: number) {
  await fsPromises.mkdir(yearFolder);

  for (let i = 1; i <= 25; i++) {
    await generateDay(yearFolder, i);
  }

  const testFileDestination = `${yearFolder}${year}.test.ts`;
  await fsPromises.copyFile('./puzzles/TEST_TEMPLATE.ts', testFileDestination);
  await findReplaceInFile(
    testFileDestination,
    'YEAR_REPLACEMENT',
    year.toString()
  );
}

async function generateDay(yearFolder: string, dayNumber: number) {
  const dayPath = `${yearFolder}day-${dayNumber}/`;
  await fsPromises.mkdir(dayPath);

  const SOLVE_FILES = ['part_one.ts', 'part_two.ts'];
  const INPUT_FILES = [
    'part_one.sample.txt',
    'part_one.txt',
    'part_two.sample.txt',
    'part_two.txt',
  ];

  SOLVE_FILES.forEach(async (file) => {
    await fsPromises.copyFile('./puzzles/TEMPLATE.ts', `${dayPath}${file}`);
  });
  INPUT_FILES.forEach(async (file) => {
    await fsPromises.writeFile(`${dayPath}${file}`, '');
  });
}

async function folderExists(path): Promise<boolean> {
  try {
    await fsPromises.stat(path);

    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    } else {
      console.error(error);
      return false;
    }
  }
}

async function findReplaceInFile(filePath, searchPattern, replacement) {
  try {
    const fileContent = await fsPromises.readFile(filePath, 'utf-8');

    const modifiedContent = fileContent.replace(
      new RegExp(searchPattern, 'g'),
      replacement
    );

    await fsPromises.writeFile(filePath, modifiedContent, 'utf-8');
  } catch (error) {
    console.error(`Error performing find-and-replace: ${error.message}`);
    throw error;
  }
}
