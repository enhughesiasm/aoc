import { readData, sum } from '../../../lib/shared.ts';

type InputString = {
  originalLength: number;
  originalContents: string;
  escapedContents: string;
  escapedLength: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const inputs = data.map((l) => parseLine(l));

  return sum(inputs.map((i) => i.escapedLength - i.originalLength));
}

function parseLine(line: string): InputString {
  const contents = line;

  const escaped = escape(contents);

  return {
    originalLength: line.length,
    originalContents: contents,
    escapedContents: escaped,
    escapedLength: escaped.length,
  };
}

function escape(s: string): string {
  const array = Array.from(s);

  const result = [];

  result.push('"');

  for (const char of array) {
    if (char === '"') {
      result.push('\\');
      result.push('"');
    } else if (char === '\\') {
      result.push('\\');
      result.push('\\');
    } else {
      result.push(char);
    }
  }

  result.push('"');

  return result.join('');
}

function unescape(s: string): string {
  // replace \" and \\ with a single char each
  const unescaped = s.replaceAll('\\\\', '\\').replaceAll('\\"', '"');

  const hexMatch = /\\x([0-9A-Fa-f]{2})/g;

  return unescaped.replace(hexMatch, (match, hex) => {
    const decimalValue = parseInt(hex, 16);
    return String.fromCharCode(decimalValue);
  });
}
