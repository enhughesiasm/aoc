import { readData } from '../../../lib/shared.ts';

type IP = {
  supernet: string[];
  hypernet: string[];
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const ips = data.map(parseIP);

  const results = ips.map(supportsSSL);

  return results.filter((s) => s === true).length;
}

function parseIP(s: string): IP {
  const supernet: string[] = [];
  const hypernet: string[] = [];

  const regex = /(\[[^\]]+\])|([^\[\]]+)/g;

  let match;
  while ((match = regex.exec(s)) !== null) {
    if (match[1]) {
      hypernet.push(match[1].replace('[', '').replace(']', ''));
    } else if (match[2]) {
      supernet.push(match[2]);
    }
  }

  return { supernet, hypernet };
}

function supportsSSL(ip: IP) {
  const supernetABAs = findAllABAs(ip.supernet);
  const hypernetABAs = findAllABAs(ip.hypernet);
  return supernetABAs.some((supernetABA) =>
    hypernetABAs.some((hypernetABA) =>
      areCorrespondingABAs(supernetABA, hypernetABA)
    )
  );
}

function findAllABAs(seqArr: string[]) {
  return seqArr.reduce((acc, str) => {
    return [...acc, ...findABAs(str)];
  }, []);
}

function findABAs(s: string) {
  const result = [];
  if (s.length < 3) {
    return result;
  }
  for (let i = 0; i < s.length; i++) {
    if (!s[i]) break;
    const slice = s.slice(i, i + 3);
    if (isABA(slice)) {
      result.push(slice);
    }
  }
  return result;
}

function isABA(s: string) {
  const regex = /(?=((.)(?!\2).\2))/;
  return regex.test(s);
}

function areCorrespondingABAs(a, b) {
  return a[0] === b[1] && a[1] === b[0];
}
