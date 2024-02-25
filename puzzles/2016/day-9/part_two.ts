import { extractNumbers, readData } from '../../../lib/shared.ts';

type Marker = { charCount: number; times: number; endIndex: number };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const lengths = data
    .filter((l) => !l.startsWith('//'))
    .map((line) => calculateLength(line));

  // console.log(lengths);

  return lengths[0];
}

function calculateLength(line: string): number {
  const weights = line.split('').map((l) => 1);

  let total = 0;

  for (let i = 0; i < line.length; i++) {
    if (line[i] !== '(') {
      total += weights[i];
    } else {
      const marker = parseMarker(line, i);
      for (
        let j = marker.endIndex + 1;
        j < marker.endIndex + 1 + marker.charCount;
        j++
      ) {
        weights[j] *= marker.times;
      }
      //console.log(marker, weights, total);
      i = marker.endIndex;
    }
  }

  // console.log(line, total);

  return total;
}

function parseMarker(s: string, i: number): Marker {
  s = s.slice(i);

  const endIndex = s.indexOf(')');

  const marker = s.slice(0, endIndex);

  const numbers = extractNumbers(marker);

  return { charCount: numbers[0], times: numbers[1], endIndex: endIndex + i };
}
