import {
  parseNumberList,
  readData,
  removeAllSubstrings,
  sum,
} from '../../../lib/shared.ts';

type InstructionKind = 'toggle' | 'off' | 'on';

type Instruction = {
  kind: InstructionKind;
  xRange: [number, number];
  yRange: [number, number];
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const instructions = data.map(parseInstruction);

  return instructions.reduce(applyInstruction, []).reduce((count, row) => {
    return count + sum(row);
  }, 0);
}

function applyInstruction(
  grid: Array<Array<number>>,
  inst: Instruction
): Array<Array<number>> {
  for (let x = inst.xRange[0]; x <= inst.xRange[1]; x++) {
    for (let y = inst.yRange[0]; y <= inst.yRange[1]; y++) {
      if (grid[x] === undefined) grid[x] = [];
      if (grid[x][y] === undefined) grid[x][y] = 0;
      switch (inst.kind) {
        case 'on':
          grid[x][y] += 1;
          break;
        case 'off':
          grid[x][y] = Math.max(grid[x][y] - 1, 0);
          break;
        case 'toggle':
          grid[x][y] += 2;
          break;
      }
    }
  }
  return grid;
}

function parseInstruction(line: string): Instruction {
  let kind: InstructionKind = 'toggle';
  if (line.startsWith('turn on')) {
    kind = 'on';
  } else if (line.startsWith('turn off')) {
    kind = 'off';
  }

  line = removeAllSubstrings(line, ['toggle ', 'turn on ', 'turn off ']);

  const parts = line.split(' through ');

  const start = parseNumberList(parts[0], ',');
  const end = parseNumberList(parts[1], ',');

  const xRange: [number, number] = [start[0], end[0]];
  const yRange: [number, number] = [start[1], end[1]];

  return { kind, xRange, yRange };
}
