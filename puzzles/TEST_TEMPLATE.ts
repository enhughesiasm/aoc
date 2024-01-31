import { execute } from '../execute';

const answers: { year: number; day: number; part: 1 | 2; answer: number }[] = [
  {
    year: YEAR_REPLACEMENT,
    day: 25,
    part: 2,
    answer: 0,
  },
];

describe(`YEAR_REPLACEMENT`, () => {
  answers.forEach((a) => {
    test(`${a.year} - Day ${a.day} - Part ${a.part}`, async () => {
      const answer = await execute([a.year, a.day, a.part, 'ACTUAL']);
      expect(answer).toBe(a.answer);
    });
  });
});
