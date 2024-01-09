import {
  ALL_CARTESIAN_DIRECTIONS,
  getGridMax,
  isWithinBounds,
  readData,
} from '../../shared.ts';
import chalk from 'chalk';

export async function day17b(dataPath?: string) {
  const data = await readData(dataPath);
  const grid = parseGrid(data);
  const { maxX, maxY } = getGridMax(grid);
  const destination: [number, number] = [maxX, maxY];
  return computeHeatLoss(grid, destination, 10, 4);
}

function parseGrid(input: string[]): number[][] {
  return input.map((i) => i.split('').map((j) => Number.parseInt(j)));
}

// Dijkstra, with custom state / weighting
type State = {
  row: number;
  col: number;
  rowDir: number;
  colDir: number;
  consecutiveSteps: number;
  heatLoss: number;
  atStartPosition: boolean;
};

function computeStateKey({
  row,
  col,
  rowDir,
  colDir,
  consecutiveSteps,
}: State) {
  return `${row}-${col}-${rowDir}-${colDir}-${consecutiveSteps}`;
}

const addNodeToQueue = (
  queue: State[],
  row: number,
  col: number,
  rowDir: number,
  colDir: number,
  consecutiveSteps: number,
  heatLoss: number
) => {
  const s = {
    row,
    col,
    rowDir,
    colDir,
    consecutiveSteps,
    heatLoss,
    atStartPosition: false,
  };

  if (queue.length === 0) {
    queue.push(s);
    return;
  }

  // find minimal heat loss
  for (let i = queue.length - 1; i >= 0; i--) {
    if (queue[i].heatLoss <= s.heatLoss) {
      queue.splice(i + 1, 0, s);
      return;
    }
  }

  // push this node to the start of the queue
  queue.unshift(s);
};

const computeHeatLoss = (
  grid: number[][],
  destination: [number, number],
  maxStraightSteps: number,
  minStepsBeforeTurn: number
) => {
  const start: State = {
    row: 0,
    col: 0,
    rowDir: 0,
    colDir: 0,
    consecutiveSteps: 0,
    heatLoss: 0,
    atStartPosition: true,
  };
  const queue: State[] = [start];
  const visited = new Set<string>();

  while (queue.length) {
    const node = queue.shift();
    const {
      row,
      col,
      rowDir,
      colDir,
      consecutiveSteps,
      heatLoss,
      atStartPosition,
    } = node;

    if (
      row === destination[1] &&
      col === destination[0] &&
      minStepsBeforeTurn <= consecutiveSteps
    ) {
      return heatLoss;
    }

    const key = computeStateKey(node);
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    // we can ONLY continue straight if less than max steps
    if (!atStartPosition && consecutiveSteps < maxStraightSteps) {
      const newRow = row + rowDir;
      const newCol = col + colDir;
      if (isWithinBounds(grid, newRow, newCol)) {
        addNodeToQueue(
          queue,
          newRow,
          newCol,
          rowDir,
          colDir,
          consecutiveSteps + 1,
          heatLoss + grid[newRow][newCol]
        );
      }
    }

    // we can only turn after min steps (or at the beginning)
    if (minStepsBeforeTurn <= consecutiveSteps || atStartPosition) {
      for (const [possibleRowDir, possibleColDir] of ALL_CARTESIAN_DIRECTIONS) {
        if (
          // avoid going in the same direction or going back where we came from
          (possibleRowDir === rowDir && possibleColDir === colDir) ||
          (possibleRowDir === rowDir * -1 && possibleColDir === colDir * -1)
        ) {
          continue;
        }
        const newRow = row + possibleRowDir;
        const newCol = col + possibleColDir;
        if (isWithinBounds(grid, newRow, newCol)) {
          addNodeToQueue(
            queue,
            newRow,
            newCol,
            possibleRowDir,
            possibleColDir,
            1,
            heatLoss + grid[newRow][newCol]
          );
        }
      }
    }
  }

  throw new Error('Something went wrong!');
};

const answer = await day17b();
console.log(chalk.bgGreen('Answer:'), chalk.green(answer));
