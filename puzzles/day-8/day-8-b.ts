import { lowestCommonMultiple, readData } from '../../shared.ts';
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

export async function day8b(dataPath?: string) {
  const data = await readData(dataPath);
  const input = parseInput(data);

  // the brute force approach takes about 1 minute to do 0.000054723608008449554%
  // so a bit more thought is needed here...

  // const steps = followInstructionsBruteForce(input);

  const steps = followInstructionsMoreIntelligently(input);

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

function followInstructionsBruteForce(input: Input): number {
  let stepsRequired = 0;

  let currentNodes = getAllNodesEndingWith(input.nodes, 'A');

  let currentInstructionIndex = 0;

  while (!currentNodes.every((n) => n.id.endsWith('Z'))) {
    const nextNodes = currentNodes.map((c) =>
      input.nodes.find(
        (n) =>
          n.id === getNextNodeId(c, input.instructions[currentInstructionIndex])
      )
    );
    currentNodes = nextNodes;
    currentInstructionIndex = getNextInstructionIndex(
      currentInstructionIndex,
      input.instructions
    );
    stepsRequired++;

    if (stepsRequired % 1000000 === 0) {
      console.log((100 * stepsRequired) / 7309459565207 + '%');
    }
  }

  return stepsRequired;
}

function followInstructionsMoreIntelligently(input: Input): number {
  let currentNodes = getAllNodesEndingWith(input.nodes, 'A');

  const pathTotals: number[] = [];

  for (const node of currentNodes) {
    pathTotals.push(countStepsForSingleNode(node, input));
  }

  return lowestCommonMultiple(pathTotals);
}

function countStepsForSingleNode(node: Node, input: Input): number {
  let stepsRequired = 0;

  let currentNode = node;
  let currentInstructionIndex = 0;

  while (!currentNode.id.endsWith('Z')) {
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

function getAllNodesEndingWith(nodes: Node[], char: string): Node[] {
  return nodes.filter((n) => n.id.endsWith(char));
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

const answer = await day8b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
