import { extractNumbers, readData } from '../../../lib/shared.ts';

type Char = {
  hp: number;
  damage: number;
  armour: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const boss = parseBoss(data);

  const player: Char = { hp: 100, armour: 0, damage: 0 };

  return findMinimumGoldSpend(player, boss);
}

function findMinimumGoldSpend(player: Char, boss: Char) {
  let minimumGoldSpend = Number.POSITIVE_INFINITY;

  // cost/damage
  const WEAPONS: [number, number][] = [
    [8, 4],
    [10, 5],
    [25, 6],
    [40, 7],
    [74, 8],
  ];
  // cost/damage
  const ARMOUR: [number, number][] = [
    [13, 1],
    [31, 2],
    [53, 3],
    [75, 4],
    [102, 5],
  ];

  // cost/damage/armour
  const RINGS: [number, number, number][] = [
    [25, 1, 0],
    [50, 2, 0],
    [100, 3, 0],
    [20, 0, 1],
    [40, 0, 2],
    [80, 0, 3],
  ];

  for (let weaponI = 0; weaponI < WEAPONS.length; weaponI++) {
    for (let armourI = -1; armourI < ARMOUR.length; armourI++) {
      for (let ringOneI = -1; ringOneI < RINGS.length; ringOneI++) {
        for (let ringTwoI = -1; ringTwoI < RINGS.length; ringTwoI++) {
          if (ringOneI > 0 && ringOneI === ringTwoI) continue;

          let spentThisRound = 0;
          const thisBoss = { ...boss };
          const playerWithLoadout = { ...player };
          spentThisRound += WEAPONS[weaponI][0];
          playerWithLoadout.damage += WEAPONS[weaponI][1];

          if (armourI >= 0) {
            spentThisRound += ARMOUR[armourI][0];
            playerWithLoadout.armour += ARMOUR[armourI][1];
          }

          if (ringOneI >= 0) {
            spentThisRound += RINGS[ringOneI][0];
            playerWithLoadout.damage += RINGS[ringOneI][1];
            playerWithLoadout.armour += RINGS[ringOneI][2];
          }

          if (ringTwoI >= 0) {
            spentThisRound += RINGS[ringTwoI][0];
            playerWithLoadout.damage += RINGS[ringTwoI][1];
            playerWithLoadout.armour += RINGS[ringTwoI][2];
          }

          if (doesPlayerWin(playerWithLoadout, thisBoss)) {
            // console.log(
            //   `Won with ${weaponI}, ${armourI}, ${ringOneI}, ${ringTwoI} spending ${spentThisRound}`
            // );
            minimumGoldSpend = Math.min(minimumGoldSpend, spentThisRound);
          } else {
            // console.log(
            //   `Lost with ${weaponI}, ${armourI}, ${ringOneI}, ${ringTwoI} spending ${spentThisRound}`
            // );
          }
        }
      }
    }
  }

  return minimumGoldSpend;
}

function parseBoss(lines: string[]): Char {
  const hp = extractNumbers(lines[0])[0];
  const damage = extractNumbers(lines[1])[0];
  const armour = extractNumbers(lines[2])[0];
  return { hp, damage, armour };
}

function doesPlayerWin(player: Char, boss: Char) {
  while (true) {
    boss.hp -= Math.max(player.damage - boss.armour, 1);

    if (boss.hp <= 0) return true;

    player.hp -= Math.max(boss.damage - player.armour, 1);

    if (player.hp <= 0) return false;
  }
}
