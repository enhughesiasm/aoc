import { execute } from '../execute';

const answers: { year: number; day: number; part: 1 | 2; answer: number }[] = [
  {
    year: 2023,
    day: 1,
    part: 1,
    answer: 54388,
  },
  {
    year: 2023,
    day: 1,
    part: 2,
    answer: 53515,
  },
  {
    year: 2023,
    day: 2,
    part: 1,
    answer: 2416,
  },
  {
    year: 2023,
    day: 2,
    part: 2,
    answer: 63307,
  },
  {
    year: 2023,
    day: 3,
    part: 1,
    answer: 535235,
  },
  {
    year: 2023,
    day: 3,
    part: 2,
    answer: 79844424,
  },
  {
    year: 2023,
    day: 4,
    part: 1,
    answer: 25651,
  },
  {
    year: 2023,
    day: 4,
    part: 2,
    answer: 19499881,
  },
  {
    year: 2023,
    day: 5,
    part: 1,
    answer: 662197086,
  },
  {
    year: 2023,
    day: 5,
    part: 2,
    answer: 52510809,
  },
  {
    year: 2023,
    day: 6,
    part: 1,
    answer: 800280,
  },
  {
    year: 2023,
    day: 6,
    part: 2,
    answer: 45128024,
  },
  {
    year: 2023,
    day: 7,
    part: 1,
    answer: 249748283,
  },
  {
    year: 2023,
    day: 7,
    part: 2,
    answer: 248029057,
  },
  {
    year: 2023,
    day: 8,
    part: 1,
    answer: 13301,
  },
  {
    year: 2023,
    day: 8,
    part: 2,
    answer: 7309459565207,
  },
  {
    year: 2023,
    day: 9,
    part: 1,
    answer: 2174807968,
  },
  {
    year: 2023,
    day: 9,
    part: 2,
    answer: 1208,
  },
  {
    year: 2023,
    day: 10,
    part: 1,
    answer: 6864,
  },
  {
    year: 2023,
    day: 10,
    part: 2,
    answer: 349,
  },
  {
    year: 2023,
    day: 11,
    part: 1,
    answer: 9418609,
  },
  {
    year: 2023,
    day: 11,
    part: 2,
    answer: 593821230983,
  },
  {
    year: 2023,
    day: 12,
    part: 1,
    answer: 6958,
  },
  {
    year: 2023,
    day: 12,
    part: 2,
    answer: 6555315065024,
  },
  {
    year: 2023,
    day: 13,
    part: 1,
    answer: 32723,
  },
  {
    year: 2023,
    day: 13,
    part: 2,
    answer: 34536,
  },
  {
    year: 2023,
    day: 14,
    part: 1,
    answer: 108792,
  },
  {
    year: 2023,
    day: 14,
    part: 2,
    answer: 99118,
  },
  {
    year: 2023,
    day: 15,
    part: 1,
    answer: 505459,
  },
  {
    year: 2023,
    day: 15,
    part: 2,
    answer: 228508,
  },
  {
    year: 2023,
    day: 16,
    part: 1,
    answer: 6855,
  },
  {
    year: 2023,
    day: 16,
    part: 2,
    answer: 7513,
  },
  {
    year: 2023,
    day: 17,
    part: 1,
    answer: 902,
  },
  {
    year: 2023,
    day: 17,
    part: 2,
    answer: 1073,
  },
  {
    year: 2023,
    day: 18,
    part: 1,
    answer: 62573,
  },
  {
    year: 2023,
    day: 18,
    part: 2,
    answer: 54662804037719,
  },
  {
    year: 2023,
    day: 19,
    part: 1,
    answer: 401674,
  },
  {
    year: 2023,
    day: 19,
    part: 2,
    answer: 134906204068564,
  },
  {
    year: 2023,
    day: 20,
    part: 1,
    answer: 818723272,
  },
  {
    year: 2023,
    day: 20,
    part: 2,
    answer: 243902373381257,
  },
  {
    year: 2023,
    day: 21,
    part: 1,
    answer: 3574,
  },
  {
    year: 2023,
    day: 21,
    part: 2,
    answer: 600090522932119,
  },
  {
    year: 2023,
    day: 22,
    part: 1,
    answer: 375,
  },
  {
    year: 2023,
    day: 22,
    part: 2,
    answer: 72352,
  },
  {
    year: 2023,
    day: 23,
    part: 1,
    answer: 1930,
  },
  {
    year: 2023,
    day: 23,
    part: 2,
    answer: 6230,
  },
  {
    year: 2023,
    day: 24,
    part: 1,
    answer: 25433,
  },
  {
    year: 2023,
    day: 24,
    part: 2,
    answer: 885093461440405,
  },
  {
    year: 2023,
    day: 25,
    part: 1,
    answer: 533628,
  },
  {
    year: 2023,
    day: 25,
    part: 2,
    answer: 0,
  },
];

describe(`2023`, () => {
  answers.forEach((a) => {
    test(`${a.year} - Day ${a.day} - Part ${a.part}`, async () => {
      const answer = await execute([a.year, a.day, a.part, 'ACTUAL']);
      expect(answer).toBe(a.answer);
    });
  });
});
