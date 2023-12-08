import { parse } from 'path';
import { readData } from '../../shared.ts';
import chalk from 'chalk';

type Input = {
  instructions: string;
  nodes: Node[];
};

type Node = {
  id: string;
  left: string;
  right: string;
};

export async function day8a(dataPath?: string) {
  const data = await readData(dataPath);
  const input = parseInput(data);

  const steps = followInstructions(input);

  return steps;
}

function parseInput(lines: string[]): Input {
  const instructions = lines[0];
  const rest = lines.slice(1);

  const nodes = rest.map((l) => parseNode(l));

  return { instructions, nodes };
}

function parseNode(line: string): Node {
  const parts = line.split(' = ');

  const id = parts[0];
  const directions = parts[1].replace('(', '').replace(')', '').split(', ');

  return { id, left: directions[0], right: directions[1] };
}

function followInstructions(input: Input): number {
  let stepsRequired = 0;

  let currentNode = input.nodes.find((n) => n.id === 'AAA');
  let currentInstructionIndex = 0;

  while (currentNode.id !== 'ZZZ') {
    currentNode = input.nodes.find(
      (n) =>
        n.id ===
        getNextNodeId(currentNode, input.instructions[currentInstructionIndex])
    );
    currentInstructionIndex = getNextInstructionIndex(
      currentInstructionIndex,
      input.instructions
    );
    stepsRequired++;
  }

  return stepsRequired;
}

function getNextInstructionIndex(
  currentInstructionIndex,
  instructions: string
): number {
  if (currentInstructionIndex === instructions.length - 1) return 0;
  return currentInstructionIndex + 1;
}

function getNextNodeId(node: Node, instruction: string): string {
  return instruction === 'L' ? node.left : node.right;
}

const answer = await day8a();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
