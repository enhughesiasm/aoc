import chalk from 'chalk';
import { Parameters } from './solve';

export async function execute(params: Parameters) {
  const aocPart = params[2] === 1 ? 'part_one' : 'part_two';

  const path = `./${params[0]}/day-${params[1]}/${aocPart}`;

  const module = await import(path);

  const input = `${path.replace('./', './puzzles/')}${
    params[3] === 'ACTUAL' ? '' : '.sample'
  }.txt`;

  const answer = await module.solve(input);

  if (process.env.NODE_ENV !== 'test') {
    console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
  }

  return answer;
}
