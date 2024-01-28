import { extractNumbers } from '../lib/shared';
import { execute } from './execute';

export type Parameters = [number, number, 1 | 2, 'SAMPLE' | 'ACTUAL'];

function parseArgument(s: string): Parameters {
  const parts = extractNumbers(s);

  if (parts.length !== 3)
    throw new Error('Wrong amount of numbers: YYYY_DD_PART');
  if (parts[0] < 2015 || parts[0] > 2040)
    throw new Error('Invalid year: ' + parts[0]);
  if (parts[1] < 1 || parts[1] > 25)
    throw new Error('Invalid day: ' + parts[1]);
  if (parts[2] < 1 || parts[2] > 2)
    throw new Error('Invalid part: ' + parts[2]);

  return [...parts, s.includes(':sample') ? 'SAMPLE' : 'ACTUAL'] as [
    number,
    number,
    1 | 2,
    'SAMPLE' | 'ACTUAL'
  ];
}

const args = process.argv.slice(2);

if (args.length !== 1) throw new Error('Missing argument YYYY_DD_PART');

execute(parseArgument(args[0]));
