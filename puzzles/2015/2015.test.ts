import { execute } from '../execute';

const YEAR = 2015;

const answers: [number, number][] = [
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
