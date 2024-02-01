import { readData, sum } from '../../../lib/shared.ts';

type InputString = {
  escapedLengthWithQuotes: number;
  escapedContents: string;
  unescapedContents: string;
  unescapedLength: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const inputs = data.map((l) => parseLine(l));

  return sum(inputs.map((i) => i.escapedLengthWithQuotes - i.unescapedLength));
}

function parseLine(line: string): InputString {
  const contents = line.slice(1, line.length - 1);

  const unescaped = unescape(contents);

  return {
    escapedLengthWithQuotes: line.length,
    escapedContents: contents,
    unescapedContents: unescaped,
    unescapedLength: unescaped.length,
  };
}

function unescape(s: string): string {
  // replace \" and \\ with a single char each
  const escaped = s.replaceAll('\\\\', '\\').replaceAll('\\"', '"');

  const hexMatch = /\\x([0-9A-Fa-f]{2})/g;

  return escaped.replace(hexMatch, (match, hex) => {
    const decimalValue = parseInt(hex, 16);
    return String.fromCharCode(decimalValue);
  });
}
