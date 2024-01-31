import { execute } from '../execute';

const YEAR = 2023;

const answers: [number, number][] = [
  [54388, 53515],

  [2416, 63307],
  [535235, 79844424],
  [25651, 19499881],
  [662197086, 52510809],
  [800280, 45128024],
  [249748283, 248029057],
  [13301, 7309459565207],
  [2174807968, 1208],
  [6864, 349],
  [9418609, 593821230983],
  [6958, 6555315065024],
  [32723, 34536],
  [108792, 99118],
  [505459, 228508],
  [6855, 7513],
  [902, 1073],
  [62573, 54662804037719],
  [401674, 134906204068564],

  [818723272, 243902373381257],
  [3574, 600090522932119],

  [375, 72352],
  [1930, 6230],
  [25433, 885093461440405],
  [533628, 0],
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
