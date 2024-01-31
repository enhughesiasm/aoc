import { readData } from '../../../lib/shared.ts';

type WireInput =
  | {
      kind: 'IMM';
      value: string;
    }
  | {
      kind: 'AND';
      inputs: [string, string];
    }
  | {
      kind: 'OR';
      inputs: [string, string];
    }
  | {
      kind: 'LSHIFT';
      wire: string;
      amount: number;
    }
  | {
      kind: 'RSHIFT';
      wire: string;
      amount: number;
    }
  | {
      kind: 'NOT';
      wire: string;
    };

type CircuitOperation = {
  input: WireInput;
  destinationWire: string;
};

type Circuit = { [key: string]: number | null };

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);
  const initialOps = parseCircuit(data);

  const wires = new Set(Array.from(initialOps.map((c) => c.destinationWire)));

  const circuit: Circuit = {};
  for (const wire of wires) {
    circuit[wire] = null;
  }

  const bIndex = initialOps.findIndex((w) => w.destinationWire === 'b');

  let ops = [...initialOps];

  ops[bIndex] = {
    destinationWire: 'b',
    input: { kind: 'IMM', value: '46065' },
  };

  while (ops.length > 0) {
    const opsToRemove = [];
    ops.forEach((op) => {
      if (isOpReady(op, circuit)) {
        applyOp(op, circuit);
        opsToRemove.push(op);
      }
    });

    ops = ops.filter((o) => !opsToRemove.includes(o));
  }

  return circuit['a'];
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function val(input: string, circuit: Circuit) {
  if (isNumber(input)) return Number(input);
  return circuit[input];
}

function isOpReady(op: CircuitOperation, circuit: Circuit) {
  switch (op.input.kind) {
    case 'IMM':
      return val(op.input.value, circuit) !== null;
    case 'NOT':
    case 'LSHIFT':
    case 'RSHIFT':
      return val(op.input.wire, circuit) !== null;
    case 'AND':
    case 'OR':
      return (
        val(op.input.inputs[0], circuit) !== null &&
        val(op.input.inputs[1], circuit) !== null
      );
  }
}

function applyOp(op: CircuitOperation, circuit: Circuit) {
  // console.log(`Applying op ${JSON.stringify(op)}...`);

  switch (op.input.kind) {
    case 'IMM':
      const immResult = val(op.input.value, circuit);
      // console.log(`Setting ${op.destinationWire} to ${immResult}...`);
      circuit[op.destinationWire] = immResult;
      break;
    case 'AND':
      const andResult =
        val(op.input.inputs[0], circuit) & val(op.input.inputs[1], circuit);
      // console.log(`AND result "${andResult}" to ${op.destinationWire}`);
      circuit[op.destinationWire] = andResult;
      break;
    case 'OR':
      const orResult =
        val(op.input.inputs[0], circuit) | val(op.input.inputs[1], circuit);
      // console.log(`OR result "${orResult}" to ${op.destinationWire}`);
      circuit[op.destinationWire] = orResult;

      break;
    case 'NOT':
      const notResult = ~(val(op.input.wire, circuit) >>> 0);
      // console.log(`NOT result "${notResult}" to ${op.destinationWire}`);
      circuit[op.destinationWire] = notResult;
      break;
    case 'LSHIFT':
      const lShiftResult = val(op.input.wire, circuit) << op.input.amount;
      // console.log(`LSHIFT result "${lShiftResult}" to ${op.destinationWire}`);
      circuit[op.destinationWire] = lShiftResult;

      break;
    case 'RSHIFT':
      const rShiftResult = val(op.input.wire, circuit) >> op.input.amount;
      // console.log(`RSHIFT result "${rShiftResult}" to ${op.destinationWire}`);
      circuit[op.destinationWire] = rShiftResult;
      break;
  }

  circuit[op.destinationWire] = circuit[op.destinationWire] & 65535; // 16 bit mask
}

function parseCircuit(lines: string[]): CircuitOperation[] {
  return lines.map((l) => parseOp(l));
}

function parseOp(line: string): CircuitOperation {
  const parts = line.split(' -> ');
  const outputWire = parts[1];
  const input = parts[0];

  if (input.includes('AND')) {
    return {
      input: { kind: 'AND', inputs: input.split(' AND ') as [string, string] },
      destinationWire: outputWire,
    };
  } else if (input.includes('OR')) {
    return {
      input: { kind: 'OR', inputs: input.split(' OR ') as [string, string] },
      destinationWire: outputWire,
    };
  } else if (input.includes('LSHIFT')) {
    const inputParts = input.split(' LSHIFT ');
    return {
      input: {
        kind: 'LSHIFT',
        wire: inputParts[0],
        amount: parseInt(inputParts[1]),
      },
      destinationWire: outputWire,
    };
  } else if (input.includes('RSHIFT')) {
    const inputParts = input.split(' RSHIFT ');
    return {
      input: {
        kind: 'RSHIFT',
        wire: inputParts[0],
        amount: parseInt(inputParts[1]),
      },
      destinationWire: outputWire,
    };
  } else if (input.includes('NOT')) {
    return {
      input: { kind: 'NOT', wire: input.replace('NOT ', '').trim() },
      destinationWire: outputWire,
    };
  } else {
    return {
      input: { kind: 'IMM', value: input },
      destinationWire: outputWire,
    };
  }
}
