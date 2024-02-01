import { execute } from '../execute';

const YEAR = YEAR_REPLACEMENT;

const answers: [number | string, number | string][] = [[0, 0]];

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
