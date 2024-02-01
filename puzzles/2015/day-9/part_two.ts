import { max, min, readData, sum } from '../../../lib/shared.ts';

type Graph = {
  nodes: Set<string>;
  distances: Map<string, number>;
};

type ParsedLine = {
  startNode: string;
  endNode: string;
  distance: number;
};

export async function solve(dataPath?: string) {
  const data = await readData(dataPath);

  const graph = buildGraph(data);

  let routes: Route[] = [];

  for (const node of graph.nodes) {
    routes = routes.concat(walkAllRoutes(graph, node));
  }

  const totalDistances = routes.map((r) => sum(r.map((edge) => edge.dist)));

  return max(totalDistances);
}

type Route = { node: string; dist: number }[];

function walkAllRoutes(graph: Graph, startNode: string): Route[] {
  const routes: Route[] = [];

  const dfs = (
    previousNode: string,
    currentNode: string,
    visited: Set<string>,
    currentRoute: Route
  ) => {
    visited.add(currentNode);

    const distance =
      previousNode === currentNode
        ? 0
        : graph.distances.get(getKey(previousNode, currentNode));

    currentRoute.push({ node: currentNode, dist: distance });

    if (currentRoute.length === graph.nodes.size) {
      routes.push(currentRoute);
    } else {
      for (const neighbour of graph.nodes) {
        if (!visited.has(neighbour)) {
          dfs(currentNode, neighbour, new Set<string>(visited), [
            ...currentRoute,
          ]);
        }
      }
    }
  };

  dfs(startNode, startNode, new Set<string>(), []);

  return routes;
}

function getKey(start: string, end: string): string {
  return `${start}->${end}`;
}

function buildGraph(lines: string[]): Graph {
  const graph: Graph = {
    nodes: new Set<string>(),
    distances: new Map<string, number>(),
  };

  lines.forEach((l) => {
    const parsed = parseLine(l);

    graph.nodes.add(parsed.startNode);
    graph.nodes.add(parsed.endNode);
    graph.distances.set(
      getKey(parsed.startNode, parsed.endNode),
      parsed.distance
    );
    graph.distances.set(
      getKey(parsed.endNode, parsed.startNode),
      parsed.distance
    );
  });

  return graph;
}

function parseLine(l: string): ParsedLine {
  const parts = l.split(' = ');
  const nodes = parts[0].split(' to ').map((s) => s.trim());

  return {
    startNode: nodes[0],
    endNode: nodes[1],
    distance: Number.parseInt(parts[1]),
  };
}
