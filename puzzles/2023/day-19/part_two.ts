import { readData } from '../../../lib/shared.ts';
import chalk from 'chalk';

type Ranges = {
  label: string;
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath, true);
  const workflows = parseInput(data);

  const ranges: Ranges = {
    label: 'in',
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };
  return applyWorkflows(workflows, ranges);
}

const deepCloneWithNewLabel = (s: Ranges, label: string): Ranges => {
  return { ...structuredClone(s), label };
};

function applyWorkflows(workflows: Workflows, ranges: Ranges) {
  const stack: Ranges[] = [ranges];
  let total = 0;

  while (stack.length > 0) {
    const current = stack.pop();

    if (current.label === 'R') {
      // we reached rejection, so these combinations do not contribute to the total
      continue;
    }

    if (current.label === 'A') {
      // we reached acceptance, so these ranges are valid
      total += computeRangeScore(current);
      continue;
    }

    const [rules, fallback] = workflows.get(current.label)!;
    for (const { op, property, value, destination } of rules) {
      const trueBranchRange = deepCloneWithNewLabel(current, destination);

      if (op === '<') {
        // true branch, our new range must be shrunk on the current property to be less than the current value
        // (or stay the same if it's already less)
        const newMax = Math.min(trueBranchRange[property][1], value - 1);
        trueBranchRange[property][1] = newMax;

        // send the current branch down the false path
        // so the minimum must be higher than the value (or stay the same if it's already higher)
        const newMin = Math.max(
          current[property][0],
          trueBranchRange[property][1] + 1
        );
        current[property][0] = newMin;
      } else {
        // same as above but inverted for '>' operator
        const newMin = Math.max(trueBranchRange[property][0], value + 1);
        trueBranchRange[property][0] = newMin;

        const newMax = Math.min(
          current[property][1],
          trueBranchRange[property][0] - 1
        );
        current[property][1] = newMax;
      }

      // the current branch remains on the stack and follows the false path
      // so just add the new true branch to the stack
      stack.push(trueBranchRange);
    }

    // we've run out of rules, so this range doesn't split, we just jump to the fallback label
    stack.push(deepCloneWithNewLabel(current, fallback));
  }
  return total;
}

function computeRangeScore(ranges: Ranges): number {
  // this combination of ranges are valid
  // NB must include +1 as ranges are inclusive on both sides
  return (
    (ranges.x[1] - ranges.x[0] + 1) *
    (ranges.m[1] - ranges.m[0] + 1) *
    (ranges.a[1] - ranges.a[0] + 1) *
    (ranges.s[1] - ranges.s[0] + 1)
  );
}

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type RangePredicate = (a: number, b: number) => boolean;

type Rule = {
  property: keyof Part;
  op: '>' | '<';
  predicate: RangePredicate;
  value: number;
  destination: string;
};

type Workflows = Map<string, [Rule[], string]>;

const predicates: Record<'<' | '>', RangePredicate> = {
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
};

function parseInput(data: string[]): Workflows {
  const portions = data.join('\n').split('\n\n');
  return portions[0].split('\n').reduce(parseWorkflows, new Map());
}

const parseWorkflows = (workflows: Workflows, line: string): Workflows => {
  const parts = line.split('{');

  const label = parts[0];
  const rulesInput = parts[1].split(',');
  const fallback = rulesInput.pop();

  workflows.set(label, [
    rulesInput.map((x) => parseRule(x)),
    fallback.substring(0, fallback.length - 1),
  ]);
  return workflows;
};

const parseRule = (rule: string): Rule => {
  const [condition, destination] = rule.split(':');

  // we could validate these types properly but trust the input is well-formed
  const property = condition[0] as keyof Part;
  const op = condition[1] as '<' | '>';

  const predicate = predicates[op];

  const value = Number.parseInt(condition.substring(2));

  return { property, op, predicate, value, destination };
};
