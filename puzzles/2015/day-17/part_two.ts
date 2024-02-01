import { min, readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const containers = data.map((x) => Number.parseInt(x));

  const MAX_LITRES = 150;
  const combinations = findContainerCombinations(containers, MAX_LITRES);

  const combinationSizes = combinations.map((c) => c.length);

  const minimumSize = min(combinationSizes);

  return combinations.filter((c) => c.length === minimumSize).length;
}

function findContainerCombinations(containers, total): number[][] {
  function findCombinations(index, remainingTotal, currentCombination) {
    if (remainingTotal === 0) {
      result.push([...currentCombination]);
      return;
    }

    for (let i = index; i < containers.length; i++) {
      if (remainingTotal - containers[i] >= 0) {
        currentCombination.push(containers[i]);
        findCombinations(
          i + 1,
          remainingTotal - containers[i],
          currentCombination
        );
        currentCombination.pop();
      }
    }
  }

  const result = [];
  findCombinations(0, total, []);
  return result;
}
