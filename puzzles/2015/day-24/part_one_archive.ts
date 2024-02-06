import { min, readData, sum } from '../../../lib/shared.ts';

// this naive solution works great for the sample but is too slow for the real input
// doing some research indicates this is a famously tricky computational problem so
// am going to need a proper algorithm: Knapsack

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const weights = data.map((l) => Number.parseInt(l));

  const totalWeight = sum(weights);

  if (totalWeight % 3 !== 0) throw new Error("Can't divide into 3 groups");

  const weightPerGroup = totalWeight / 3;

  console.log(weightPerGroup);

  const distributions = computeDistributions(weights, weightPerGroup);

  const smallestGroupLength = min(
    distributions.map((d) => d.map((e) => e.length)).flat()
  );

  // @ts-ignore
  const smallestGroups = Array.from(
    new Set<string>(
      distributions
        .flat()
        .filter((d) => d.length === smallestGroupLength)
        .map((s) => JSON.stringify(s))
    ),
    JSON.parse
  );

  const entanglements = smallestGroups.map((g) => quantumEntanglement(g));

  return min(entanglements);
}

function computeDistributions(weights: number[], desiredWeight: number) {
  const distributions: [number[], number[], number[]][] = [];

  function distributeGroups(
    currentIndex: number,
    groups: [number[], number[], number[]]
  ) {
    if (groups.some((g) => sum(g) > desiredWeight)) return;

    if (currentIndex === weights.length) {
      if (
        groups.every((group) => group.length > 0) &&
        groups.every((g) => sum(g) === desiredWeight)
      ) {
        const clone = structuredClone(groups);
        distributions.push(clone);
      }
      return;
    }

    for (let i = 0; i < groups.length; i++) {
      groups[i].push(weights[currentIndex]);
      distributeGroups(currentIndex + 1, groups);
      groups[i].pop();
    }
  }

  distributeGroups(0, [[], [], []]);

  return distributions;
}

function quantumEntanglement(n: number[]) {
  return n.reduce((prev, curr) => prev * curr, 1);
}
