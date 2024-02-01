import { extractNumbers, readData } from '../../../lib/shared.ts';

type Instruction =
  | {
      kind: 'hlf';
      target: Register;
    }
  | {
      kind: 'tpl';
      target: Register;
    }
  | {
      kind: 'inc';
      target: Register;
    }
  | {
      kind: 'jmp';
      offset: number;
    }
  | {
      kind: 'jie';
      target: Register;
      offset: number;
    }
  | { kind: 'jio'; target: Register; offset: number };

type Register = 'a' | 'b';

type State = { a: number; b: number };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const instructions = data.map((l) => parseInstruction(l));

  const state: State = { a: 1, b: 0 };

  processInstructions(state, instructions);

  return state.b;
}

function processInstructions(state: State, instructions: Instruction[]) {
  let instPointer = 0;

  while (instPointer < instructions.length) {
    const currentInstruction = instructions[instPointer];

    //console.log(`${instPointer} - ${JSON.stringify(currentInstruction)}`);

    switch (currentInstruction.kind) {
      case 'hlf':
        hlf(state, currentInstruction.target);
        instPointer++;
        break;
      case 'inc':
        inc(state, currentInstruction.target);
        instPointer++;
        break;
      case 'tpl':
        tpl(state, currentInstruction.target);
        instPointer++;
        break;
      case 'jmp':
        // console.log(
        //   `Unconditional jump to ${instPointer + currentInstruction.offset}`
        // );
        instPointer += currentInstruction.offset;
        break;
      case 'jie':
        if (state[currentInstruction.target] % 2 === 0) {
          // console.log(
          //   `${currentInstruction.target} contains ${
          //     state[currentInstruction.target]
          //   } which is even`
          // );
          // console.log(`Jumping to ${instPointer + currentInstruction.offset}`);

          instPointer += currentInstruction.offset;
        } else {
          //console.log(`No jie`);
          instPointer++;
        }
        break;
      case 'jio':
        if (state[currentInstruction.target] === 1) {
          // console.log(
          //   `${currentInstruction.target} contains ${
          //     state[currentInstruction.target]
          //   } which is ONE`
          // );
          // console.log(`Jumping to ${instPointer + currentInstruction.offset}`);
          instPointer += currentInstruction.offset;
        } else {
          //console.log(`No jio`);
          instPointer++;
        }
        break;
      default:
        throw new Error("Can't process inst at address " + currentInstruction);
    }
  }
}

function hlf(state: State, reg: Register) {
  if (reg === 'a') {
    //console.log(`Halving a from ${state.a} to ${state.a / 2}`);
    state.a = state.a / 2;
  } else {
    //console.log(`Halving b from ${state.b} to ${state.b / 2}`);
    state.b = state.b / 2;
  }
}

function tpl(state: State, reg: Register) {
  if (reg === 'a') {
    //console.log(`Tripling a from ${state.a} to ${state.a * 3}`);
    state.a = state.a * 3;
  } else {
    //console.log(`Tripling b from ${state.b} to ${state.b * 3}`);
    state.b = state.b * 3;
  }
}

function inc(state: State, reg: Register) {
  if (reg === 'a') {
    //console.log(`Incrementing a from ${state.a} to ${state.a + 1}`);
    state.a = state.a + 1;
  } else {
    //console.log(`Incrementing b from ${state.b} to ${state.b + 1}`);
    state.b = state.b + 1;
  }
}

function parseInstruction(l: string): Instruction {
  const inst = l.slice(0, 3);

  switch (inst) {
    case 'hlf':
      return { kind: 'hlf', target: l[4] as Register };
    case 'tpl':
      return { kind: 'tpl', target: l[4] as Register };
    case 'inc':
      return { kind: 'inc', target: l[4] as Register };
    case 'jmp':
      return { kind: 'jmp', offset: extractNumbers(l)[0] };
    case 'jie':
      return {
        kind: 'jie',
        target: l[4] as Register,
        offset: Number.parseInt(l.split(',')[1]),
      };
    case 'jio':
      return {
        kind: 'jio',
        target: l[4] as Register,
        offset: Number.parseInt(l.split(',')[1]),
      };
    default:
      throw new Error('Unknown inst: ' + inst);
  }
}
