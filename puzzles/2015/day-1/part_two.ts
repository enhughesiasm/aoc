import { readData } from '../../../lib/shared.ts';

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = Array.from(data[0]);
  let currentFloor = 0;
  for (let i = 0; i < instructions.length; i++) {
    // console.log(`${currentFloor} ${instructions[i]}`);
    if (instructions[i] === '(') {
      currentFloor++;
    } else {
      currentFloor--;
    }
    if (currentFloor === -1) return i + 1;
  }

  return 0;
}
