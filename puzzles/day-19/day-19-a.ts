import { numericOnly, readData, sum } from '../../shared.ts';
import chalk from 'chalk';

export async function day19a(dataPath?: string) {
  const data = await readData(dataPath, true);
  const { parts, workflows } = parseInput(data);

  const accepted: Part[] = [];

  for (const part of parts) {
    if (findDestination(part, workflows) === 'A') {
      accepted.push(part);
    }
  }

  return sum(accepted.map((p) => p.x + p.m + p.a + p.s));
}

function findDestination(part: Part, workflows: Workflows): 'A' | 'R' {
  let currentLabel = 'in';

  while (currentLabel !== 'A' && currentLabel !== 'R') {
    const rules = workflows[currentLabel];
    for (const r of rules) {
      if (r[0](part)) {
        currentLabel = r[1];
        break;
      }
    }
  }

  return currentLabel;
}

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};

type Rule = [PartPredicate, string];

type PartPredicate = (p: Part) => boolean;

type Workflows = Record<string, Rule[]>;

function parseInput(data: string[]): {
  parts: Part[];
  workflows: Workflows;
} {
  const portions = data.join('\n').split('\n\n');

  return {
    parts: portions[1]
      .split('\n')
      .filter((s) => s !== '')
      .map((p) => parsePart(p)),
    workflows: parseWorkflows(portions[0]),
  };
}

function parseWorkflows(input: string): Workflows {
  const workflows = input.split('\n').map((s) => parseWorkflow(s));

  const allWorkflows = {};
  workflows.forEach((w) => {
    allWorkflows[w.label] = w.rules;
  });

  return allWorkflows;
}

function parseWorkflow(s: string): { label: string; rules: Rule[] } {
  const parts = s.split('{');
  const label = parts[0];

  const rules = parts[1].replace('}', '').split(',');

  return { label, rules: rules.map((r) => parseRule(r)) };
}

function parseRule(s: string): Rule {
  if (s.includes(':')) {
    const ruleParts = s.split(':');
    const predicate = parsePredicate(
      s[0] as 'x' | 'm' | 'a' | 's',
      s.includes('<') ? '<' : '>',
      Number.parseInt(numericOnly(s))
    );

    return [predicate, ruleParts[1]];
  } else {
    // destination only
    return [() => true, s];
  }
}

function parsePredicate(
  property: 'x' | 'm' | 'a' | 's',
  kind: '<' | '>',
  value: number
): PartPredicate {
  if (kind === '<') {
    return (p: Part) => p[property] < value;
  } else {
    return (p: Part) => p[property] > value;
  }
}

function parsePart(s: string): Part {
  const p = s.replaceAll('\n', '').split(',');

  return {
    x: Number.parseInt(numericOnly(p[0])),
    m: Number.parseInt(numericOnly(p[1])),
    a: Number.parseInt(numericOnly(p[2])),
    s: Number.parseInt(numericOnly(p[3])),
  };
}

const answer = await day19a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
