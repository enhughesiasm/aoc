import chalk from 'chalk';
import { readData } from '../../../lib/shared.ts';

type IP = {
  valid: string[];
  hypernet: string[];
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const ips = data.map(parseIP);

  const supportsTls = ips.map(supportsTLS);

  return supportsTls.filter((s) => s === true).length;
}

function parseIP(s: string): IP {
  const valid: string[] = [];
  const hypernet: string[] = [];

  const regex = /(\[[^\]]+\])|([^\[\]]+)/g;

  let match;
  while ((match = regex.exec(s)) !== null) {
    if (match[1]) {
      hypernet.push(match[1].replace('[', '').replace(']', ''));
    } else if (match[2]) {
      valid.push(match[2]);
    }
  }

  return { valid, hypernet };
}

function supportsTLS(ip: IP): boolean {
  const result =
    ip.hypernet.every((s) => !hasABBA(s)) && ip.valid.some((s) => hasABBA(s));

  return result;
}

function hasABBA(s: string): boolean {
  const patternRegex = /(.)(.)\2\1/;
  const nonIdenticalConditionRegex = /(.)(?!\1)(.)(?!\1)\2\1/;

  return patternRegex.test(s) && nonIdenticalConditionRegex.test(s);
}
