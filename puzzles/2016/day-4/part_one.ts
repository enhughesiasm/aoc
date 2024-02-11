import {
  calculateCharacterFrequencies,
  nonNumericOnly,
  numericOnly,
  readData,
  sum,
} from '../../../lib/shared.ts';

type Room = {
  encryptedName: string;
  sectorID: number;
  checksum: string;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const rooms = data.map((l) => parseRoom(l));

  const realRooms = rooms.filter(isRealRoom);

  return sum(realRooms.map((r) => r.sectorID));
}

function isRealRoom(r: Room): boolean {
  const frequencies = calculateCharacterFrequencies(
    r.encryptedName.replaceAll('-', '')
  );

  let count = 0;

  for (const prop in frequencies.sortedFrequencies) {
    if (count < 5) {
      if (!r.checksum.includes(prop)) return false;
      count++;
    } else {
      break;
    }
  }

  return true;
}

function parseRoom(l: string): Room {
  const parts = l.split('-');

  const idAndChecksum = parts[parts.length - 1];

  const id = Number.parseInt(numericOnly(idAndChecksum));
  const checksum = nonNumericOnly(idAndChecksum)
    .replace('[', '')
    .replace(']', '');

  const name = l.replace('-' + idAndChecksum, '');

  return { encryptedName: name, sectorID: id, checksum };
}
