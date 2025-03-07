import { execute } from '../execute';

const YEAR = 2015;

const answers: [number | string, number | string][] = [
  [232, 1783],
  [1606483, 3842356],
  [2081, 2341],
  [346386, 9958218],
  [255, 55],
  [569999, 17836115],
  [46065, 14134],
  [1350, 2085],
  [207, 804],
  [360154, 5103798],
  ['hepxxyzz', 'heqaabcc'],
  [119433, 68466],
  [618, 601],
  [2660, 1256],
  [222870, 117936],
  [40, 241],
  [4372, 4],
  [821, 886],
  [509, 195],
  [786240, 831600],
  [91, 158],
  [1269, 1309],
  [184, 231],
  [10723906903, 74850409],
  [2650453, 0],
];

describe(`${YEAR}`, () => {
  answers.forEach((a, dayIndex) => {
    for (let partIndex = 0; partIndex <= 1; partIndex++) {
      test(`${YEAR} - Day ${dayIndex + 1} - Part ${
        partIndex + 1
      }`, async () => {
        const answer = await execute([
          YEAR,
          dayIndex + 1,
          (partIndex + 1) as 1 | 2,
          'ACTUAL',
        ]);
        expect(answer).toBe(answers[dayIndex][partIndex]);
      });
    }
  });
});
