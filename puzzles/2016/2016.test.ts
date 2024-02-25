import { execute } from '../execute';

const YEAR = 2016;

const answers: [number | string, number | string][] = [
  [307, 165],
  ['74921', 'A6B35'],
  [1032, 1838],
  [361724, 482],
  ['2414bc77', '437e60fc'],
  ['qoclwvah', 'ryrgviuv'],
  [115, 231],
  [110, 'ZJHRKCPLYJ'],
  [110346, 10774309173],
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
