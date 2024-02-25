import { extractNumbers, readData } from '../../../lib/shared.ts';

type Marker = { charCount: number; times: number; endIndex: number };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const decompressed = data.map((line) => decompressLine(line, 0));

  // console.log(decompressed);

  return decompressed[0];
}

function decompressLine(line: string, total: number): number {
  const markerIndex = line.indexOf('(');

  if (markerIndex === -1) {
    return line.length + total;
  }

  const prePartLength = line.slice(0, markerIndex).length;

  const marker = parseMarker(line, markerIndex);

  const toExpand = line.slice(marker.endIndex + 1);

  const expandedLength = expandMarker(toExpand, marker);

  total += prePartLength + expandedLength;

  const remaining = line.slice(marker.endIndex + 1 + marker.charCount);

  return decompressLine(remaining, total);
}

function expandMarker(s: string, marker: Marker) {
  const toRepeat = s.slice(0, marker.charCount);

  let expanded = '';

  for (let i = 0; i < marker.times; i++) {
    expanded += toRepeat;
  }

  return expanded.length;
}

function parseMarker(s: string, i: number): Marker {
  const endIndex = s.indexOf(')');

  const marker = s.slice(i, endIndex);

  const numbers = extractNumbers(marker);

  return { charCount: numbers[0], times: numbers[1], endIndex };
}
