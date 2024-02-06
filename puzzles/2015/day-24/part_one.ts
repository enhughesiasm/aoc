import { min, readData, sum } from '../../../lib/shared.ts';

// this solution is MUCH faster than the naive approach
// - instead of computing all possible groups just find the
// smallest sum that adds up to the desired amount
export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const weights = data.map((l) => Number.parseInt(l));

  const totalWeight = sum(weights);

  if (totalWeight % 3 !== 0) throw new Error("Can't divide into 3 groups");

  const weightPerGroup = totalWeight / 3;

  const smallestGroups = findPossibleSums(weights, weightPerGroup);

  const entanglements = smallestGroups.map((g) => quantumEntanglement(g));

  return min(entanglements);
}

function findPossibleSums(weights: number[], weightPerGroup): number[][] {
  const validGroups = new Set<string>();

  let smallestGroupSize = Number.POSITIVE_INFINITY;

  function findSums(
    start: number,
    currentSum: number,
    currentCombination: number[],
    used: boolean[]
  ) {
    if (currentCombination.length > smallestGroupSize) return;
    if (currentSum > weightPerGroup) return;
    if (currentSum === weightPerGroup) {
      smallestGroupSize = Math.min(
        smallestGroupSize,
        currentCombination.length
      );
      const key = JSON.stringify(currentCombination);
      if (!validGroups.has(key)) {
        validGroups.add(key);
      }
      return;
    }

    for (let i = start; i < weights.length; i++) {
      if (!used[i] && currentSum + weights[i] <= weightPerGroup) {
        used[i] = true;
        currentCombination.push(weights[i]);
        findSums(i + 1, currentSum + weights[i], currentCombination, used);
        used[i] = false;
        currentCombination.pop();
      }
    }
  }

  findSums(0, 0, [], []);

  return Array.from(validGroups)
    .map((m) => JSON.parse(m))
    .filter((g) => g.length === smallestGroupSize);
}

function quantumEntanglement(n: number[]) {
  return n.reduce((prev, curr) => prev * curr, 1);
}
