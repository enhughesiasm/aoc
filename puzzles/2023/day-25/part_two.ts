import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  return 0;
}
