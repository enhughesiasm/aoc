import { execute } from '../execute';

const answers: { year: number; day: number; part: 1 | 2; answer: number }[] = [
  {
    year: 2015,
    day: 1,
    part: 1,
    answer: 232,
  },
  {
    year: 2015,
    day: 1,
    part: 2,
    answer: 1783,
  },
  {
    year: 2015,
    day: 2,
    part: 1,
    answer: 1606483,
  },
  {
    year: 2015,
    day: 2,
    part: 2,
    answer: 3842356,
  },
  {
    year: 2015,
    day: 3,
    part: 1,
    answer: 2081,
  },
  {
    year: 2015,
    day: 3,
    part: 2,
    answer: 2341,
  },
  {
    year: 2015,
    day: 4,
    part: 1,
    answer: 346386,
  },
  {
    year: 2015,
    day: 4,
    part: 2,
    answer: 9958218,
  },
  {
    year: 2015,
    day: 5,
    part: 1,
    answer: 255,
  },
  {
    year: 2015,
    day: 5,
    part: 2,
    answer: 55,
  },
  {
    year: 2015,
    day: 6,
    part: 1,
    answer: 569999,
  },
  {
    year: 2015,
    day: 6,
    part: 2,
    answer: 17836115,
  },
  {
    year: 2015,
    day: 7,
    part: 1,
    answer: 46065,
  },
  {
    year: 2015,
    day: 7,
    part: 2,
    answer: 14134,
  },

  {
    year: 2015,
    day: 25,
    part: 2,
    answer: 0,
  },
];

describe(`2015`, () => {
  answers.forEach((a) => {
    test(`${a.year} - Day ${a.day} - Part ${a.part}`, async () => {
      const answer = await execute([a.year, a.day, a.part, 'ACTUAL']);
      expect(answer).toBe(a.answer);
    });
  });
});
