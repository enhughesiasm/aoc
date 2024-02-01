import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const containers = data.map((x) => Number.parseInt(x));

  const MAX_LITRES = 150;
  const combinations = findContainerCombinations(containers, MAX_LITRES);

  // console.log(combinations);

  return combinations.length;
}
function findContainerCombinations(containers, total) {
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
