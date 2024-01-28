import { readData, sum } from '../../../lib/shared.ts';
import chalk from 'chalk';

type Lens = {
  label: string;
  length: number;
};

const HASHMAP: Array<Array<Lens>> = new Array(256).fill([]);

type Step =
  | {
      label: string;
      kind: '-';
    }
  | {
      label: string;
      kind: '=';
      focalLength: number;
    };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const steps = parseSteps(data[0]);

  for (const step of steps) {
    performStep(step);
  }

  return sum(HASHMAP.map((box, index) => getFocusingPowerForBox(box, index)));
}

function getFocusingPowerForBox(box: Array<Lens>, boxIndex: number): number {
  return sum(
    box.map((lens, lensIndex) =>
      getFocusingPowerForLens(lens, boxIndex, lensIndex)
    )
  );
}

function getFocusingPowerForLens(
  lens: Lens,
  boxIndex: number,
  lensIndex: number
): number {
  return (1 + boxIndex) * (1 + lensIndex) * lens.length;
}

function performStep(step: Step) {
  const hash = calculateHASH(step.label);

  switch (step.kind) {
    case '-':
      HASHMAP[hash] = HASHMAP[hash].filter((l) => l.label !== step.label);
      // console.log(`Removed ${step.label} from ${hash}`);
      break;
    case '=':
      const lenses = [...HASHMAP[hash]];
      const existingLensIndex = lenses.findIndex((l) => l.label === step.label);
      if (existingLensIndex !== -1) {
        // console.log(
        //   `Replaced ${step.label} with length ${step.focalLength} in ${hash}`
        // );
        lenses[existingLensIndex] = {
          label: step.label,
          length: step.focalLength,
        };
      } else {
        // console.log(
        //   `Pushed ${step.label} with length ${step.focalLength} into ${hash}`
        // );
        lenses.push({ label: step.label, length: step.focalLength });
      }
      HASHMAP[hash] = lenses;
      break;
  }
}

function parseSteps(input: string): Step[] {
  return input.split(',').map((i) => parseStep(i));
}

function parseStep(input: string): Step {
  if (input.includes('=')) {
    const parts = input.split('=');
    return {
      kind: '=',
      label: parts[0],
      focalLength: Number.parseInt(parts[1]),
    };
  } else {
    return { kind: '-', label: input.replaceAll('-', '') };
  }
}

function calculateHASH(input: string): number {
  let currentValue = 0;

  for (const char of input) {
    currentValue += char.charCodeAt(0);

    currentValue *= 17;

    currentValue = currentValue % 256;
  }

  return currentValue;
}
